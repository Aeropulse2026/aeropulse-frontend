import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { join, resolve, relative, sep } from "node:path";
import { readFileSync, readdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const buildDir = process.env.AEROPULSE_COMMAND_NETWORK_TEST_BUILD;
const { filterLocations, isValidCoordinates, normalizeFleetOverview, selectLocation } = require(join(buildDir, "adapter.js"));
const { loadFleetOverview } = require(join(buildDir, "api.js"));
const { demoLocations, demoOverview } = require(join(buildDir, "demo-command-network.js"));
const { demoAircraft, filterAircraftRecords } = require(join(buildDir, "aircraft.js"));
const { demoSquadrons, getSquadronRecommendationCandidates } = require(join(buildDir, "squadrons.js"));
const { demoAirbases, getAirbaseSummary, getHeadquartersFleetSummary } = require(join(buildDir, "headquarters.js"));
const { cartoResponseContentType, rewriteCartoSpriteRequest, rewriteCartoUrls } = require(join(buildDir, "style-proxy.js"));
const { DEMO_AS_OF_DATE, demoInventory, demoSquadron, demoSquadronAircraft } = require(join(buildDir, "squadron-data.js"));
const { filterSquadronInventory, filterSquadronTasks, getAvailableQuantity, getSquadronAircraft, getSquadronAircraftById, getSquadronInventory, getSquadronSummary, getSquadronTasks, isLowStock, isTaskPastScheduledDate, searchSquadronTasks } = require(join(buildDir, "squadron-selectors.js"));
const { getSectionSwitchTarget } = require(join(buildDir, "section-switch.js"));
const tests = [];
const cleanup = [];
const test = (name, callback) => tests.push({ name, callback });
const afterEach = (callback) => cleanup.push(callback);

function listPageRoutes(directory, prefix) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) return listPageRoutes(absolutePath, prefix);
    if (entry.name !== "page.tsx") return [];
    const section = prefix.split(sep).filter(Boolean).at(-1);
    const route = relative(prefix, directory).split(sep).filter(Boolean).join("/");
    return [`/${section}${route ? `/${route}` : ""}`];
  }).sort();
}

test("Headquarters fleet, squadron management, and statistics have distinct routes", () => {
  const appDirectory = resolve(process.cwd(), "src/app");
  const headquartersRoutes = listPageRoutes(join(appDirectory, "headquarter"), join(appDirectory, "headquarter"));
  const squadronRoutes = listPageRoutes(join(appDirectory, "squadron"), join(appDirectory, "squadron"));
  assert.deepEqual(headquartersRoutes, ["/", "/assets", "/fleet", "/fleet-overview", "/fleet/[id]", "/squadrons", "/stats"].map((route) => `/headquarter${route === "/" ? "" : route}`));
  assert.deepEqual(squadronRoutes, ["/", "/assets", "/fleet"].map((route) => `/squadron${route === "/" ? "" : route}`));

  const nextConfig = readFileSync(resolve(process.cwd(), "next.config.ts"), "utf8");
  for (const [source, destination] of [
    ["/headquarter/assest", "/headquarter/assets"],
    ["/squadron/reports", "/squadron#reports"],
    ["/squadron/maintenance", "/squadron#maintenance"],
    ["/squadron/fleet/:id", "/squadron/fleet?aircraft=:id"],
  ]) {
    assert.ok(nextConfig.includes(`source: "${source}", destination: "${destination}"`));
  }
  assert.ok(!nextConfig.includes('source: "/headquarter/stats"'));
  assert.ok(!nextConfig.includes('source: "/headquarter/squadrons"'));
  const navigation = readFileSync(resolve(process.cwd(), "src/app/headquarter/layout.tsx"), "utf8");
  assert.ok(navigation.includes('href: "/headquarter/squadrons"'));
  assert.ok(navigation.includes('href: "/headquarter/stats"'));
  assert.ok(navigation.includes('href: "/headquarter/fleet-overview"'));
  const fleetLanding = readFileSync(resolve(process.cwd(), "src/app/headquarter/fleet/page.tsx"), "utf8");
  const fleetOverview = readFileSync(resolve(process.cwd(), "src/app/headquarter/fleet-overview/page.tsx"), "utf8");
  assert.ok(fleetLanding.includes("HeadquartersNetworkFleet"));
  assert.ok(fleetOverview.includes("HeadquartersFleetWorkspace"));
});

test("command switch targets the canonical landing page for the other section", () => {
  assert.deepEqual(getSectionSwitchTarget("headquarters"), { role: "squadron-leader", path: "/squadron" });
  assert.deepEqual(getSectionSwitchTarget("squadron-leader"), { role: "headquarters", path: "/headquarter" });
});

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

test("Headquarters demonstration records have unique identifiers and summaries derive from canonical records", () => {
  assert.equal(new Set(demoAircraft.map((record) => record.id)).size, demoAircraft.length);
  assert.equal(new Set(demoAirbases.map((record) => record.code)).size, demoAirbases.length);
  assert.equal(new Set(demoSquadrons.map((record) => record.id)).size, demoSquadrons.length);
  assert.ok(demoAircraft.every((record) => demoSquadrons.some((squadron) => squadron.id === record.squadronId && squadron.name === record.squadron && squadron.base === record.base)));
  assert.ok(demoAirbases.every((base) => base.squadrons.every((name) => demoSquadrons.some((squadron) => squadron.name === name))));
  assert.ok(demoAircraft.every((record) => ["Operational", "Maintenance", "Standby"].includes(record.status)));
  assert.ok(demoAircraft.every((record) => Number.isFinite(record.hours) && record.hours >= 0 && record.readiness >= 0 && record.readiness <= 100));
  assert.ok(demoAirbases.every((base) => Number.isFinite(base.aircraft) && base.aircraft >= 0));

  const baseSummary = getAirbaseSummary();
  assert.equal(baseSummary.total, demoAirbases.length);
  assert.equal(baseSummary.operational, demoAirbases.filter((base) => base.status === "Operational").length);
  assert.equal(baseSummary.squadronAssignments, demoAirbases.reduce((sum, base) => sum + base.squadrons.length, 0));
  assert.equal(baseSummary.aircraftRepresented, demoAirbases.reduce((sum, base) => sum + base.aircraft, 0));

  const fleetSummary = getHeadquartersFleetSummary(demoAircraft);
  assert.equal(fleetSummary.total, demoAircraft.length);
  assert.equal(fleetSummary.distribution.reduce((sum, item) => sum + item.count, 0), demoAircraft.length);
  assert.deepEqual(fleetSummary.aircraftHours.map((item) => item.id), demoAircraft.map((item) => item.id));
  assert.equal(fleetSummary.operational + fleetSummary.inMaintenance + fleetSummary.unavailable, fleetSummary.total);
  assert.equal(fleetSummary.averageReadiness, Math.round(demoAircraft.reduce((sum, item) => sum + item.readiness, 0) / demoAircraft.length));
  assert.equal(fleetSummary.totalFlightHours, demoAircraft.reduce((sum, item) => sum + item.hours, 0));
  assert.equal(fleetSummary.byModel.reduce((sum, item) => sum + item.count, 0), demoAircraft.length);
  assert.equal(fleetSummary.bySquadron.reduce((sum, item) => sum + item.count, 0), demoAircraft.length);
  assert.equal(fleetSummary.byBase.reduce((sum, item) => sum + item.count, 0), demoAircraft.length);
  assert.equal(fleetSummary.dueWithin14Days, demoAircraft.filter((record) => {
    const days = (Date.parse(record.nextMaintenance) - Date.parse("2026-10-18")) / 86_400_000;
    return days >= 0 && days <= 14;
  }).length);
  const originalIds = demoAircraft.map((item) => item.id);
  getHeadquartersFleetSummary(demoAircraft).aircraftHours.reverse();
  assert.deepEqual(demoAircraft.map((item) => item.id), originalIds);
});

test("aircraft filters combine trimmed case-insensitive search and status without mutating records", () => {
  const originalIds = demoAircraft.map((aircraft) => aircraft.id);
  assert.deepEqual(filterAircraftRecords(demoAircraft, "  falCON  ", "Maintenance").map((aircraft) => aircraft.id), ["AP-403"]);
  assert.deepEqual(filterAircraftRecords(demoAircraft, " ambala ", "Operational").map((aircraft) => aircraft.id), ["AP-401"]);
  assert.deepEqual(filterAircraftRecords(demoAircraft, "no aircraft", "All status"), []);
  assert.deepEqual(filterAircraftRecords(demoAircraft, "", "All status"), demoAircraft);
  assert.deepEqual(filterAircraftRecords([{ ...demoAircraft[0], name: undefined, base: undefined, description: undefined }], "AP-401", "Operational").map((aircraft) => aircraft.id), ["AP-401"]);
  assert.deepEqual(demoAircraft.map((aircraft) => aircraft.id), originalIds);
});

test("squadron recommendation selectors combine role and base and keep a stable ranked result", () => {
  const candidates = getSquadronRecommendationCandidates(demoSquadrons, "Air defence", "Ambala");
  assert.deepEqual(candidates.map((squadron) => squadron.id), ["SQ-017", "SQ-007"]);
  assert.ok(candidates.every((squadron) => squadron.role === "Air defence" && squadron.base === "Ambala"));
  assert.deepEqual(getSquadronRecommendationCandidates(demoSquadrons, "Training", "Ambala"), []);
});

test("Headquarters map preview totals match its canonical airbase location metrics", () => {
  const airbases = demoLocations.filter((location) => location.category === "airbase");
  assert.equal(airbases.length, demoAirbases.length);
  for (const base of demoAirbases) {
    const marker = airbases.find((location) => location.id === `demo-${base.code.toLowerCase().replace("afs-", "")}`);
    assert.ok(marker);
    assert.deepEqual(marker.coordinates, base.coordinates);
    assert.equal(Number(marker.details.find((metric) => metric.label === "Aircraft").value), base.aircraft);
    assert.equal(Number(marker.details.find((metric) => metric.label === "Reported operational").value), base.operationalAircraft);
  }
  const metricTotal = (label) => airbases.reduce((sum, location) => sum + Number(location.details.find((metric) => metric.label === label)?.value ?? 0), 0);
  assert.equal(Number(demoOverview.find((metric) => metric.label === "Aircraft across airbases").value), metricTotal("Aircraft"));
  assert.equal(Number(demoOverview.find((metric) => metric.label === "Reported operational").value), metricTotal("Reported operational"));
  assert.equal(Number(demoOverview.find((metric) => metric.label === "In maintenance").value), metricTotal("Maintenance"));
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

test("Squadron demonstration relationships, dates, and summary values are consistent", () => {
  const aircraft = getSquadronAircraft();
  const tasks = getSquadronTasks();
  const inventory = getSquadronInventory();
  assert.ok(new Set(aircraft.map((item) => item.id)).size === aircraft.length);
  assert.ok(new Set(tasks.map((item) => item.id)).size === tasks.length);
  assert.ok(new Set(inventory.map((item) => item.id)).size === inventory.length);
  assert.ok(new Set([...aircraft.map((item) => item.id), ...tasks.map((item) => item.id)]).size === aircraft.length + tasks.length);
  assert.ok(aircraft.every((item) => item.squadronId === demoSquadron.id));
  assert.ok(tasks.every((task) => aircraft.some((item) => item.id === task.aircraftId)));
  assert.ok(tasks.every((task) => !task.requiredPartId || demoInventory.some((item) => item.id === task.requiredPartId)));
  assert.ok(tasks.every((task) => Number.isFinite(Date.parse(task.scheduledFor)) && ["pending", "in_progress", "completed"].includes(task.status)));
  assert.ok(tasks.every((task) => !task.completedAt || Date.parse(task.completedAt) >= Date.parse(task.scheduledFor)));
  assert.ok(aircraft.every((item) => ["Operational", "Maintenance", "Standby"].includes(item.status)));
  assert.ok(aircraft.every((item) => Number.isFinite(item.readiness) && item.readiness >= 0 && item.readiness <= 100 && Number.isFinite(item.hours) && item.hours >= 0 && item.hoursSinceMaintenance <= item.hours));
  assert.ok(aircraft.every((item) => Number.isFinite(Date.parse(item.lastMaintenance)) && Number.isFinite(Date.parse(item.nextMaintenance)) && Date.parse(item.lastMaintenance) <= Date.parse(item.nextMaintenance)));
  assert.ok(inventory.every((item) => Number.isFinite(item.quantity) && item.quantity >= 0 && Number.isFinite(item.reserved) && item.reserved >= 0 && item.reserved <= item.quantity && ["Operational", "Maintenance", "Standby", "Secured", "Serviceable", "Low stock", "Out of stock", "Available", "Limited availability"].includes(item.serviceability) && (item.reorderPoint === undefined || (Number.isFinite(item.reorderPoint) && item.reorderPoint >= 0))));
  assert.ok(aircraft.every((item) => getSquadronAircraftById(item.id) === item));
  const summary = getSquadronSummary();
  assert.equal(summary.totalAircraft, aircraft.length);
  assert.equal(summary.operational, aircraft.filter((item) => item.status === "Operational").length);
  assert.equal(summary.inMaintenance, aircraft.filter((item) => item.status === "Maintenance").length);
  assert.equal(summary.unavailable, aircraft.filter((item) => item.status === "Standby").length);
  assert.equal(summary.operational + summary.inMaintenance + summary.unavailable, summary.totalAircraft);
  assert.equal(summary.pendingTasks, tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length);
  assert.equal(summary.readiness, Math.round(aircraft.reduce((sum, item) => sum + item.readiness, 0) / aircraft.length));
  assert.deepEqual(searchSquadronTasks(tasks, "SQ17-03").map((task) => task.aircraftId), ["SQ17-03"]);
  assert.deepEqual(searchSquadronTasks(tasks, "no match"), []);
  assert.deepEqual(filterSquadronTasks(tasks, " HYDRAULIC ", "pending").map((task) => task.id), ["MT-017-02"]);
  assert.deepEqual(filterSquadronTasks(tasks, "routine", "completed").map((task) => task.id), ["MT-017-04"]);
  assert.deepEqual(filterSquadronTasks(tasks, "no match", "pending"), []);
  assert.equal(isTaskPastScheduledDate(tasks.find((task) => task.id === "MT-017-01"), "2026-10-18"), true);
  assert.equal(isTaskPastScheduledDate(tasks.find((task) => task.id === "MT-017-01"), DEMO_AS_OF_DATE), true);
  assert.equal(isTaskPastScheduledDate(tasks.find((task) => task.id === "MT-017-04"), "2026-10-18"), false);
  const originalIds = demoSquadronAircraft.map((item) => item.id);
  getSquadronAircraft().reverse();
  assert.deepEqual(demoSquadronAircraft.map((item) => item.id), originalIds);
});

test("inventory low-stock flags use recorded unreserved quantity", () => {
  const parts = getSquadronInventory().filter((item) => item.category === "Spare parts");
  assert.equal(isLowStock(parts.find((item) => item.id === "SP-204")), true);
  assert.equal(getAvailableQuantity(parts.find((item) => item.id === "SP-204")), 1);
  assert.equal(isLowStock(parts.find((item) => item.id === "SP-118")), false);
  assert.equal(getAvailableQuantity(parts.find((item) => item.id === "SP-309")), 0);
  assert.equal(isLowStock(parts.find((item) => item.id === "SP-309")), true);
  assert.deepEqual(filterSquadronInventory(getSquadronInventory(), { query: " sp-204 ", category: "Spare parts", lowStockOnly: true }).map((item) => item.id), ["SP-204"]);
  assert.deepEqual(filterSquadronInventory(getSquadronInventory(), { query: "SP-118", category: "Spare parts", lowStockOnly: true }), []);
  assert.deepEqual(filterSquadronInventory(getSquadronInventory(), { query: "", category: "Spare parts", lowStockOnly: false }).map((item) => item.id), ["SP-118", "SP-204", "SP-309"]);
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
