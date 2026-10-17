import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const buildDir = process.env.AEROPULSE_COMMAND_NETWORK_TEST_BUILD;
const { filterLocations, isValidCoordinates, normalizeFleetOverview, selectLocation } = require(join(buildDir, "adapter.js"));
const { loadFleetOverview } = require(join(buildDir, "api.js"));
const { demoLocations } = require(join(buildDir, "demo-command-network.js"));
const { cartoResponseContentType, rewriteCartoSpriteRequest, rewriteCartoUrls } = require(join(buildDir, "style-proxy.js"));
const tests = [];
const cleanup = [];
const test = (name, callback) => tests.push({ name, callback });
const afterEach = (callback) => cleanup.push(callback);

const locations = [
  { id: "hq", name: "Command HQ", category: "headquarters", coordinates: [77.2, 28.6], source: "demo" },
  { id: "base", name: "Example Air Station", category: "airbase", coordinates: [76.8, 30.3], region: "Haryana", source: "demo" },
  { id: "invalid", name: "No coordinates", category: "airbase", coordinates: null, source: "demo" },
];

const originalFetch = globalThis.fetch;
const originalApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiBase === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
  else process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBase;
});

test("coordinate validation rejects missing, malformed, non-finite, and out-of-range coordinates", () => {
  assert.equal(isValidCoordinates([77.2, 28.6]), true);
  for (const value of [null, [], [77], [181, 28], [77, 91], [NaN, 0], ["77", 28]]) {
    assert.equal(isValidCoordinates(value), false);
  }
});

test("fleet overview normalization preserves nullable data and rejects an invalid response shape", () => {
  assert.deepEqual(normalizeFleetOverview({
    aircraft_total: 4,
    mission_ready: 2,
    at_risk: 1,
    average_health_score: null,
    pending_work_orders: 3,
  }), {
    aircraftTotal: 4,
    missionReady: 2,
    atRisk: 1,
    averageHealthScore: null,
    pendingWorkOrders: 3,
  });
  assert.equal(normalizeFleetOverview({ aircraft_total: -1 }).aircraftTotal, null);
  assert.throws(() => normalizeFleetOverview([]), /unexpected response shape/);
});

test("location filters search only visible names and categories, and selection clears when filtered out", () => {
  assert.deepEqual(filterLocations(locations, new Set(["headquarters", "airbase"]), "").map((location) => location.id), ["hq", "base"]);
  const visible = filterLocations(locations, new Set(["airbase"]), "haryana");
  assert.deepEqual(visible.map((location) => location.id), ["base"]);
  assert.equal(selectLocation(visible, "base")?.name, "Example Air Station");
  assert.equal(selectLocation(visible, "hq"), null);
  assert.deepEqual(filterLocations(locations, new Set(["airbase"]), "missing"), []);
});

test("the initial synthetic HQ and airbase filter shows all seven demo locations", () => {
  const initiallyVisible = filterLocations(demoLocations, new Set(["headquarters", "airbase"]), "");
  assert.equal(demoLocations.length, 7);
  assert.equal(initiallyVisible.length, 7);
  assert.equal(initiallyVisible[0].category, "headquarters");
});

test("an unconfigured API has a distinct state and does not use fabricated metrics", async () => {
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  globalThis.fetch = async () => { throw new Error("fetch should not run"); };
  assert.deepEqual(await loadFleetOverview(new AbortController().signal), { status: "unconfigured" });
});

test("unauthorized and API failures remain errors rather than demo metrics", async () => {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://backend.test/api/";
  globalThis.fetch = async () => new Response("", { status: 401 });
  assert.equal((await loadFleetOverview(new AbortController().signal)).status, "unauthorized");

  globalThis.fetch = async () => new Response("backend failure", { status: 503 });
  const failed = await loadFleetOverview(new AbortController().signal);
  assert.equal(failed.status, "error");
  assert.match(failed.message, /503/);
});

test("network and malformed payload failures are distinct API errors", async () => {
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://backend.test/api";
  globalThis.fetch = async () => { throw new Error("offline"); };
  assert.match((await loadFleetOverview(new AbortController().signal)).message, /could not be reached/);
  globalThis.fetch = async () => new Response("not json", { status: 200 });
  assert.match((await loadFleetOverview(new AbortController().signal)).message, /invalid JSON/);
});

test("CARTO style proxy returns absolute same-origin sprites, preserves tokens, and hides keys", () => {
  const style = rewriteCartoUrls({
    glyphs: "https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf?key=demo-secret",
    sprite: "https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/sprite?key=demo-secret",
    sources: {
      carto: {
        url: "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json?key=demo-secret",
      },
    },
    vectorTiles: [
      "https://tiles-a.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt?key=demo-secret",
      "https://tiles-d.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt?key=demo-secret",
    ],
    external: "https://example.test/not-a-proxy-resource",
  }, "https://dashboard.example.test:8443");

  assert.equal(new URL(style.sprite).origin, "https://dashboard.example.test:8443");
  for (const [suffix, contentType] of [[".json", "application/json"], [".png", "image/png"], ["@2x.json", "application/json"], ["@2x.png", "image/png"]]) {
    // This is the path MapLibre 6's normalizeSpriteURL generates: the variant
    // is appended to the pathname before the proxy's query string.
    const normalizedSpriteRequest = new URL(style.sprite);
    normalizedSpriteRequest.pathname += suffix;
    const routedRequest = rewriteCartoSpriteRequest(normalizedSpriteRequest.toString(), "https://dashboard.example.test:8443");
    assert.ok(routedRequest);
    const proxyRequest = new URL(routedRequest);
    assert.equal(proxyRequest.pathname, "/api/carto/proxy");
    assert.equal(proxyRequest.searchParams.get("url"), `https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/sprite${suffix}`);
    assert.equal(cartoResponseContentType(proxyRequest.searchParams.get("url"), "application/octet-stream"), contentType);
    assert.equal(routedRequest.includes("demo-secret"), false);
  }
  assert.equal(style.external, "https://example.test/not-a-proxy-resource");
  assert.ok(style.glyphs.includes("{fontstack}"));
  assert.ok(style.glyphs.includes("{range}.pbf"));
  assert.equal(style.glyphs.includes("%7Bfontstack%7D"), false);
  assert.equal(style.glyphs.includes("%7Brange%7D"), false);
  assert.equal(JSON.stringify(style).includes("demo-secret"), false);

  const glyphRequest = new URL(style.glyphs.replace("{fontstack}", "Noto Sans Regular").replace("{range}", "0-255"));
  assert.equal(glyphRequest.origin, "https://dashboard.example.test:8443");
  assert.equal(glyphRequest.searchParams.get("url"), "https://tiles.basemaps.cartocdn.com/fonts/Noto Sans Regular/0-255.pbf");

  const tileJsonRequest = new URL(style.sources.carto.url);
  assert.equal(tileJsonRequest.searchParams.get("url"), "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json");
  for (const [index, host] of ["tiles-a", "tiles-d"].entries()) {
    for (const token of ["{z}", "{x}", "{y}"]) assert.ok(style.vectorTiles[index].includes(token));
    const vectorTileRequest = new URL(style.vectorTiles[index].replace("{z}", "4").replace("{x}", "9").replace("{y}", "6"));
    assert.equal(vectorTileRequest.origin, "https://dashboard.example.test:8443");
    assert.equal(vectorTileRequest.searchParams.get("url"), `https://${host}.basemaps.cartocdn.com/vectortiles/carto.streets/v1/4/9/6.mvt`);
  }
});

let failures = 0;
for (const { name, callback } of tests) {
  try {
    await callback();
    console.log(`✓ ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`✗ ${name}`, error);
  } finally {
    for (const callback of cleanup) callback();
  }
}
console.log(`${tests.length - failures}/${tests.length} tests passed`);
if (failures) process.exitCode = 1;
