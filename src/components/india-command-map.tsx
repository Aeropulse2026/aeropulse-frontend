"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ErrorEvent as MapLibreErrorEvent, Map as MapLibreMap, Marker as MapLibreMarker, Popup as MapLibrePopup } from "maplibre-gl";
import {
  Building2, Crosshair, MapPin, Plane, Radio,
  RefreshCw, RotateCcw, Search, ShieldAlert, X,
} from "lucide-react";
import { DEMO_MODE_ENABLED } from "@/lib/auth/demo-session";
import { demoLocations, demoOverview } from "@/lib/command-network/demo-command-network";
import { filterLocations, selectLocation } from "@/lib/command-network/adapter";
import type { ApiState, CommandLocation, LocationCategory } from "@/lib/command-network/types";
import { useCommandNetwork } from "@/hooks/use-command-network";
import { rewriteCartoSpriteRequest } from "@/lib/carto/style-proxy";

const MAP_MODE = process.env.NEXT_PUBLIC_AEROPULSE_MAP_MODE === "api"
  ? "api"
  : process.env.NEXT_PUBLIC_AEROPULSE_MAP_MODE === "demo"
    ? "demo"
    : DEMO_MODE_ENABLED ? "demo" : "api";
const IS_DEMO_MODE = MAP_MODE === "demo";
const MAP_DEBUG_ENABLED = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mapDebug") === "1";
const CARTO_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const CARTO_STYLE_PROXY = `/api/carto/proxy?url=${encodeURIComponent(CARTO_STYLE)}`;
const INDIA_CENTER: [number, number] = [82.8, 22.5];
const INDIA_BOUNDS: [[number, number], [number, number]] = [[68, 6], [98, 37]];
const CATEGORY_LABELS: Record<LocationCategory, string> = {
  headquarters: "Headquarters",
  airbase: "Airbases",
  fleet: "Fleet / squadron",
};

function categoryIcon(category: LocationCategory) {
  if (category === "headquarters") return Building2;
  if (category === "fleet") return Plane;
  return Radio;
}

function numberOrUnavailable(value: number | null, suffix = "") {
  return value === null ? "Unavailable" : `${Number.isInteger(value) ? value : value.toFixed(1)}${suffix}`;
}

function selectedMetrics(location: CommandLocation) {
  return location.details ?? [];
}

function safeMapErrorMessage(error: { message: string } | undefined) {
  return (error?.message || "A CARTO style resource failed to load.")
    .replace(/https?:\/\/\S+/g, "[resource URL]")
    .slice(0, 240);
}

export function IndiaCommandMap() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Set<LocationCategory>>(
    () => new Set(["headquarters", "airbase"]),
  );
  const [selectedId, setSelectedId] = useState<string | null>(IS_DEMO_MODE ? demoLocations[0]?.id ?? null : null);
  const [mapKey, setMapKey] = useState(0);
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">("loading");
  const [mapError, setMapError] = useState<string | null>(null);
  const { state: apiState, refresh } = useCommandNetwork(!IS_DEMO_MODE);
  const visibleLocations = useMemo(
    () => filterLocations(IS_DEMO_MODE ? demoLocations : [], categories, query),
    [categories, query],
  );
  const selected = selectLocation(visibleLocations, selectedId);
  const toggleCategory = (category: LocationCategory) => {
    setCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };
  const handleSelect = useCallback((location: CommandLocation) => setSelectedId(location.id), []);
  const handleMapState = useCallback((state: "loading" | "ready" | "error", message?: string) => {
    setMapState(state);
    setMapError(message ?? null);
  }, []);

  const apiOverview = apiState.status === "ready" || apiState.status === "empty" ? apiState.overview : null;
  const overviewRows = IS_DEMO_MODE
    ? demoOverview
    : apiOverview
      ? [
          { label: "Aircraft total", value: numberOrUnavailable(apiOverview.aircraftTotal) },
          { label: "Mission ready", value: numberOrUnavailable(apiOverview.missionReady) },
          { label: "At risk", value: numberOrUnavailable(apiOverview.atRisk) },
          { label: "Average health score", value: numberOrUnavailable(apiOverview.averageHealthScore, "%") },
          { label: "Pending work orders", value: numberOrUnavailable(apiOverview.pendingWorkOrders) },
        ]
      : [];

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.8fr)]">
      <section className="min-w-0 overflow-hidden rounded-3xl border border-brand-border bg-white shadow-sm" aria-labelledby="command-map-heading">
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 pb-3 pt-5 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.22em] text-brand-secondary">
              {IS_DEMO_MODE ? "Synthetic preview · non-operational" : "Backend network overview"}
            </p>
            <h2 id="command-map-heading" className="mt-1 text-xl font-semibold text-brand-primary-dark">India command network</h2>
          </div>
        </div>

        {IS_DEMO_MODE && (
          <div className="grid gap-3 px-4 pb-3 sm:grid-cols-[minmax(180px,1fr)_auto] sm:px-6" aria-label="Map filters">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" aria-hidden="true" />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedId(null); }} placeholder="Search demo locations" aria-label="Search locations" className="h-10 w-full rounded-xl border border-brand-border bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:border-brand-secondary focus-visible:ring-2 focus-visible:ring-brand-secondary/20" />
            </label>
            <div className="flex flex-wrap items-center gap-2" aria-label="Location categories">
              {(["headquarters", "airbase"] as const).map((category) => {
                const Icon = categoryIcon(category);
                return <button key={category} type="button" aria-pressed={categories.has(category)} onClick={() => { toggleCategory(category); setSelectedId(null); }} className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary ${categories.has(category) ? "border-brand-secondary/30 bg-brand-secondary-light text-brand-secondary" : "border-brand-border bg-white text-brand-muted"}`}><Icon className="size-3.5" />{CATEGORY_LABELS[category]}</button>;
              })}
            </div>
          </div>
        )}

        <div className="relative h-[410px] w-full bg-[#eef2f2] sm:h-[500px] xl:h-[600px]" aria-label="Interactive map of India">
          <MapLibreCanvas
            locations={visibleLocations}
            selectedId={selectedId}
            mapKey={mapKey}
            mapStatus={mapState}
            onSelect={handleSelect}
            onMapState={handleMapState}
          />
          <div className="absolute left-3 top-3 z-10 flex gap-2 sm:left-4 sm:top-4">
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("aeropulse-reset-map"))} className="map-control-button" aria-label="Reset map view to India"><RotateCcw className="size-4" /><span className="hidden sm:inline">Reset India</span></button>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("aeropulse-fit-markers"))} disabled={!visibleLocations.length} className="map-control-button disabled:cursor-not-allowed disabled:opacity-50" aria-label="Fit map to visible markers"><Crosshair className="size-4" /><span className="hidden sm:inline">Fit markers</span></button>
          </div>
          {mapState === "loading" && <div className="absolute inset-0 z-[5] flex items-center justify-center bg-white/55 backdrop-blur-[1px]" role="status"><div className="rounded-xl border border-brand-border bg-white/95 px-4 py-3 text-sm font-medium text-brand-primary-dark shadow-sm"><span className="mr-2 inline-block size-2 animate-pulse rounded-full bg-brand-secondary" />Loading CARTO basemap…</div></div>}
          {mapState === "error" && <div className="absolute inset-0 z-[6] flex items-center justify-center bg-white/65 p-5 backdrop-blur-sm"><div className="max-w-sm rounded-2xl border border-amber-200 bg-white p-5 text-center shadow-lg"><ShieldAlert className="mx-auto size-7 text-amber-700" /><h3 className="mt-3 font-semibold text-brand-primary-dark">Basemap unavailable</h3><p className="mt-1 text-sm leading-5 text-brand-muted">{mapError ?? "The CARTO style or one of its map resources could not be loaded."}</p><button type="button" onClick={() => setMapKey((key) => key + 1)} className="mt-4 rounded-lg bg-brand-primary-dark px-4 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary">Retry map</button></div></div>}
          {mapState === "ready" && !visibleLocations.length && <div className="pointer-events-none absolute bottom-12 left-1/2 z-[4] w-[min(92%,380px)] -translate-x-1/2 rounded-xl border border-brand-border bg-white/95 p-3 text-center text-sm text-brand-muted shadow-md">{IS_DEMO_MODE ? "No demo locations match these filters." : "No backend facility records with valid coordinates are available to map."}</div>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border px-4 py-3 text-xs text-brand-muted sm:px-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2"><i className="size-2.5 rounded-full bg-brand-accent" />Headquarters</span>
            <span className="inline-flex items-center gap-2"><i className="size-2.5 rounded-full bg-brand-secondary" />Airbase</span>
          </div>
          <span>{visibleLocations.length} {IS_DEMO_MODE ? "synthetic" : "API-backed"} mapped {visibleLocations.length === 1 ? "location" : "locations"}</span>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-3xl border border-brand-border bg-white p-5 shadow-sm" aria-live="polite" aria-labelledby="selected-location-heading">
          <div className="flex items-center justify-between gap-3">
            <p id="selected-location-heading" className="text-[11px] font-bold uppercase tracking-[.2em] text-brand-secondary">Selected location</p>
            {selected && <button type="button" onClick={() => setSelectedId(null)} className="rounded-md p-1 text-brand-muted hover:bg-brand-background focus-visible:outline-2 focus-visible:outline-brand-secondary" aria-label="Clear selected location"><X className="size-4" /></button>}
          </div>
          {selected ? <>
            <div className="mt-2 flex items-start gap-3">
              <span className={`mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl ${selected.category === "headquarters" ? "bg-amber-100 text-amber-800" : "bg-brand-secondary-light text-brand-secondary"}`}><MapPin className="size-5" /></span>
              <div className="min-w-0"><h3 className="text-xl font-semibold text-brand-primary-dark">{selected.name}</h3><p className="mt-1 text-sm text-brand-muted">{CATEGORY_LABELS[selected.category]}{selected.region ? ` · ${selected.region}` : ""}</p></div>
            </div>
            {selected.description && <p className="mt-4 text-sm leading-5 text-brand-muted">{selected.description}</p>}
            {selectedMetrics(selected).length > 0 ? <div className="mt-4 grid grid-cols-2 gap-2">{selectedMetrics(selected).map((metric) => <div key={metric.label} className="rounded-xl bg-brand-background p-3"><p className="text-xs text-brand-muted">{metric.label}</p><p className="mt-1 text-lg font-semibold text-brand-primary-dark">{metric.value}</p></div>)}</div> : <p className="mt-4 rounded-xl bg-brand-background p-3 text-sm text-brand-muted">No additional location details are available from the API.</p>}

          </> : <div className="mt-3 rounded-xl bg-brand-background p-4 text-sm leading-5 text-brand-muted">{IS_DEMO_MODE ? "Select a visible demo marker to view its sample details." : "The verified backend exposes no airbase or facility coordinates. No location is selected or inferred from a fleet-to-base text association."}</div>}
        </section>

        <section className="rounded-3xl border border-brand-border bg-white p-5 shadow-sm" aria-labelledby="network-overview-heading">
          <div className="flex items-center justify-between gap-3"><h3 id="network-overview-heading" className="font-semibold text-brand-primary-dark">Network overview</h3>{!IS_DEMO_MODE && <button type="button" onClick={refresh} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-brand-secondary" disabled={apiState.status === "loading"}><RefreshCw className={`size-3.5 ${apiState.status === "loading" ? "animate-spin" : ""}`} />Refresh</button>}</div>
          {!IS_DEMO_MODE && <ApiStatus state={apiState} />}
          {overviewRows.length > 0 && <div className="mt-4 space-y-3">{overviewRows.map((item) => <div key={item.label} className="flex justify-between gap-3 border-b border-brand-border pb-3 last:border-0 last:pb-0"><span className="text-sm text-brand-muted">{item.label}</span><b className="text-right text-sm text-brand-primary-dark">{item.value}</b></div>)}</div>}
          {!IS_DEMO_MODE && apiState.status === "ready" && <p className="mt-4 text-xs text-brand-muted">Source: <code>/api/fleet/overview</code> · refreshed {new Date(apiState.fetchedAt).toLocaleTimeString()}</p>}
        </section>
      </aside>
    </div>
  );
}

function ApiStatus({ state }: { state: ApiState }) {
  if (state.status === "ready") return null;
  if (state.status === "loading") return <p className="mt-3 flex items-center gap-2 text-sm text-brand-muted" role="status"><span className="size-2 animate-pulse rounded-full bg-brand-secondary" />Loading backend statistics…</p>;
  if (state.status === "unconfigured") return <p className="mt-3 rounded-xl bg-brand-background p-3 text-sm text-brand-muted">Set <code>NEXT_PUBLIC_API_BASE_URL</code> to enable API statistics.</p>;
  if (state.status === "empty") return <p className="mt-3 rounded-xl bg-brand-background p-3 text-sm text-brand-muted">The API is available, but it reports no aircraft records.</p>;
  if (state.status === "unauthorized") return <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Unauthorized: {state.message}</p>;
  return <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">API error: {state.message}</p>;
}

function MapLibreCanvas({
  locations,
  selectedId,
  mapKey,
  mapStatus,
  onSelect,
  onMapState,
}: {
  locations: readonly CommandLocation[];
  selectedId: string | null;
  mapKey: number;
  mapStatus: "loading" | "ready" | "error";
  onSelect: (location: CommandLocation) => void;
  onMapState: (state: "loading" | "ready" | "error", message?: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const popupRef = useRef<MapLibrePopup | null>(null);
  const locationsRef = useRef(locations);
  const onSelectRef = useRef(onSelect);
  const selectedRef = useRef(selectedId);

  useEffect(() => { locationsRef.current = locations; }, [locations]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let loadTimer: ReturnType<typeof setTimeout> | undefined;
    let resizeFrame: number | undefined;
    let onError: ((event: MapLibreErrorEvent) => void) | undefined;
    let resourceErrorCount = 0;
    let didMapLoad = false;

    const initialize = async () => {
      if (!containerRef.current) return;
      onMapState("loading");
      try {
        const styleResponse = await fetch(CARTO_STYLE_PROXY, { cache: "no-store" });
        if (!styleResponse.ok) {
          const errorBody = await styleResponse.json().catch(() => null) as { error?: string } | null;
          if (errorBody?.error?.includes("CARTO_BASEMAP_API_KEY")) {
            throw new Error("CARTO requires a basemap API key. Set CARTO_BASEMAP_API_KEY in the Next.js server environment and restart the server; do not expose it as a NEXT_PUBLIC_ variable.");
          }
          if (styleResponse.status === 401 || styleResponse.status === 403) {
            throw new Error(`CARTO rejected the basemap key (HTTP ${styleResponse.status}). Verify the server-side key and its allowed domains or usage limits.`);
          }
          throw new Error(errorBody?.error ?? `CARTO style request failed with HTTP ${styleResponse.status}.`);
        }
        const style = await styleResponse.json();
        if (!style || typeof style !== "object" || !("version" in style)) {
          throw new Error("CARTO returned an invalid style document.");
        }
        const maplibre = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;
        // MapLibre 6 normally derives a sibling worker URL from import.meta.url.
        // Turbopack serves the ESM module as a generated chunk, not from the
        // package's dist directory, so serve the version-matched worker through
        // a same-origin route instead of relying on that inferred URL.
        maplibre.setWorkerUrl("/maplibre-worker");
        map = new maplibre.Map({
          container: containerRef.current,
          style,
          center: INDIA_CENTER,
          zoom: 4.15,
          minZoom: 3.2,
          maxZoom: 15,
          maxBounds: [[35, -5], [112, 43]],
          attributionControl: false,
          cooperativeGestures: true,
          transformRequest: (url, resourceType) => {
            if (resourceType !== "SpriteJSON" && resourceType !== "SpriteImage") return undefined;
            const rewritten = rewriteCartoSpriteRequest(url, window.location.origin);
            return rewritten ? { url: rewritten } : undefined;
          },
        });
        mapRef.current = map;
        map.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right");
        map.addControl(new maplibre.AttributionControl({
          compact: false,
          customAttribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a> contributors, <a href="https://carto.com/attribution/" target="_blank" rel="noreferrer">© CARTO</a>',
        }), "bottom-right");
        map.once("load", () => {
          if (cancelled) return;
          didMapLoad = true;
          if (loadTimer) clearTimeout(loadTimer);
          // A resource error can be non-fatal (for example, one unavailable
          // tile). MapLibre's `load` event is the authoritative signal that
          // the style has initialized; do not leave a full-map error overlay
          // covering a successfully initialized canvas because of a warning.
          map?.resize();
          const canvas = map?.getCanvas();
          const styleSnapshot = map?.getStyle();
          if (MAP_DEBUG_ENABLED && map && containerRef.current) {
            const mapRect = map.getContainer().getBoundingClientRect();
            const canvasRect = canvas?.getBoundingClientRect();
            Object.assign(containerRef.current.dataset, {
              mapLoaded: "true",
              mapRect: `${Math.round(mapRect.width)}x${Math.round(mapRect.height)}`,
              canvasRect: canvasRect ? `${Math.round(canvasRect.width)}x${Math.round(canvasRect.height)}` : "unavailable",
              layerCount: String(styleSnapshot?.layers?.length ?? 0),
              sourceIds: Object.keys(styleSnapshot?.sources ?? {}).join(","),
              center: map.getCenter().toArray().join(","),
              zoom: String(map.getZoom()),
              resourceErrors: String(resourceErrorCount),
            });
            console.info("[AeroPulse map debug] MapLibre load completed", {
              styleLoaded: map.isStyleLoaded(),
              sourceIds: Object.keys(styleSnapshot?.sources ?? {}),
              layerCount: styleSnapshot?.layers?.length ?? 0,
              mapRect: { width: mapRect.width, height: mapRect.height },
              canvas: canvas ? { width: canvas.width, height: canvas.height } : null,
              center: map.getCenter().toArray(),
              zoom: map.getZoom(),
              resourceErrorCount,
            });
          }
          onMapState("ready");
        });
        map.once("idle", () => {
          if (cancelled || !map) return;
          let renderedFeatures: ReturnType<MapLibreMap["queryRenderedFeatures"]> = [];
          try {
            renderedFeatures = map.queryRenderedFeatures();
          } catch {
            // A WebGL/context issue is still represented by MapLibre's error event.
          }
          if (MAP_DEBUG_ENABLED && containerRef.current) {
            const renderedLayerIds = [...new Set(renderedFeatures.map((feature) => feature.layer.id))];
            const renderedSourceLayers = [...new Set(renderedFeatures.map((feature) => feature.sourceLayer).filter(Boolean))];
            Object.assign(containerRef.current.dataset, {
              renderedFeatureCount: String(renderedFeatures.length),
              renderedLayerIds: renderedLayerIds.join(","),
              renderedSourceLayers: renderedSourceLayers.join(","),
              tilesLoaded: String(map.areTilesLoaded()),
            });
            console.info("[AeroPulse map debug] MapLibre reached idle", {
              styleLoaded: map.isStyleLoaded(),
              tilesLoaded: map.areTilesLoaded(),
              renderedFeatureCount: renderedFeatures.length,
              renderedLayerIds,
              renderedSourceLayers,
              canvas: { width: map.getCanvas().width, height: map.getCanvas().height },
            });
          }
        });
        onError = (event) => {
          resourceErrorCount += 1;
          // Never log the full ErrorEvent or URL: it can contain the encoded
          // proxy request. Keep only non-sensitive diagnostics.
          if (MAP_DEBUG_ENABLED) {
            console.warn("[AeroPulse map debug] MapLibre resource error", {
              message: safeMapErrorMessage(event.error),
              resourceErrorCount,
            });
          }
        };
        map.on("error", onError);
        loadTimer = setTimeout(() => {
          if (map && !didMapLoad) {
            const canvas = map.getCanvas();
            const message = `MapLibre did not complete its initial load (styleLoaded=${map.isStyleLoaded()}, canvas=${canvas.width}×${canvas.height}, resourceErrors=${resourceErrorCount}). Check MapLibre diagnostics and failed /api/carto/proxy requests.`;
            console.warn("[AeroPulse map] MapLibre load timed out", {
              mapLoaded: didMapLoad,
              styleLoaded: map.isStyleLoaded(),
              canvas: { width: canvas.width, height: canvas.height },
              resourceErrorCount,
            });
            onMapState("error", message);
          }
        }, 15000);
        const fit = () => {
          const currentMap = mapRef.current;
          const points = locationsRef.current;
          if (!currentMap || !points.length) return;
          if (points.length === 1) {
            currentMap.flyTo({ center: points[0].coordinates, zoom: 6.5, duration: 550 });
            return;
          }
          const bounds = new maplibre.LngLatBounds();
          points.forEach((point) => bounds.extend(point.coordinates));
          currentMap.fitBounds(bounds, { padding: 56, maxZoom: 7.5, duration: 550 });
        };
        window.addEventListener("aeropulse-fit-markers", fit);
        map.once("remove", () => window.removeEventListener("aeropulse-fit-markers", fit));
        const reset = () => map?.fitBounds(INDIA_BOUNDS, { padding: 30, duration: 550 });
        window.addEventListener("aeropulse-reset-map", reset);
        map.once("remove", () => window.removeEventListener("aeropulse-reset-map", reset));
        const observer = new ResizeObserver(() => map?.resize());
        observer.observe(containerRef.current);
        resizeFrame = requestAnimationFrame(() => map?.resize());
        map.once("remove", () => observer.disconnect());
      } catch (error) {
        const message = error instanceof Error ? error.message : "The CARTO style request failed before the map could initialize.";
        console.error("[AeroPulse map] CARTO style initialization failed", error);
        if (!cancelled) onMapState("error", message);
      }
    };
    void initialize();

    return () => {
      cancelled = true;
      if (loadTimer) clearTimeout(loadTimer);
      if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
      if (map && onError) map.off("error", onError);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      popupRef.current?.remove();
      popupRef.current = null;
      map?.remove();
      mapRef.current = null;
    };
  }, [mapKey, onMapState]);

  useEffect(() => {
    const map = mapRef.current;
    if (mapStatus !== "ready" || !map) return;
    popupRef.current?.remove();
    popupRef.current = null;
    let alive = true;
    void import("maplibre-gl").then((maplibre) => {
      if (!alive || mapRef.current !== map) return;
      const addMarkers = () => {
        if (!alive || mapRef.current !== map) return;
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = locations.map((location) => {
        const element = document.createElement("button");
        element.type = "button";
        element.className = `command-map-marker command-map-marker--${location.category}${selectedRef.current === location.id ? " is-selected" : ""}`;
        element.dataset.locationId = location.id;
        element.setAttribute("aria-label", `Select ${location.name}, ${CATEGORY_LABELS[location.category]}`);
        element.title = location.name;
        const iconElement = document.createElement("span");
        iconElement.setAttribute("aria-hidden", "true");
        iconElement.textContent = location.category === "headquarters" ? "⌖" : location.category === "fleet" ? "✈" : "●";
        element.append(iconElement);
        element.addEventListener("click", () => {
          onSelectRef.current(location);
          popupRef.current?.remove();
          const popupContent = document.createElement("div");
          const title = document.createElement("strong");
          title.textContent = location.name;
          const description = document.createElement("p");
          description.textContent = [CATEGORY_LABELS[location.category], location.region, location.description].filter(Boolean).join(" · ");
          popupContent.append(title, description);
          popupRef.current = new maplibre.Popup({ offset: 18, closeButton: true, closeOnClick: false })
            .setDOMContent(popupContent)
            .setLngLat(location.coordinates)
            .addTo(map);
        });
        return new maplibre.Marker({ element, anchor: "bottom" }).setLngLat(location.coordinates).addTo(map);
      });
      };
      if (map.isStyleLoaded()) addMarkers();
      else map.once("load", addMarkers);
    });
    return () => {
      alive = false;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [locations, mapStatus]);

  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const element = marker.getElement();
      const isSelected = element.dataset.locationId === selectedId;
      element.classList.toggle("is-selected", isSelected);
    });
  }, [locations, selectedId]);

  // MapLibre applies `position: relative` to this element. Keep it in normal
  // flow with an explicit size so that its absolutely positioned canvas and
  // markers do not collapse/clamp against the parent when MapLibre's CSS wins
  // the `position` cascade over Tailwind's `absolute` utility.
  return <div ref={containerRef} className="size-full" />;
}
