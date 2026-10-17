import type { CommandLocation, FleetOverview, LocationCategory } from "./types";

export function isValidCoordinates(value: unknown): value is [number, number] {
  if (!Array.isArray(value) || value.length !== 2) return false;
  const [longitude, latitude] = value;
  return (
    typeof longitude === "number" &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90
  );
}

export function normalizeFleetOverview(value: unknown): FleetOverview {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Fleet overview returned an unexpected response shape.");
  }
  const raw = value as Record<string, unknown>;
  const readCount = (key: string) => {
    const count = raw[key];
    return typeof count === "number" && Number.isFinite(count) && count >= 0 ? count : null;
  };
  const health = raw.average_health_score;
  return {
    aircraftTotal: readCount("aircraft_total"),
    missionReady: readCount("mission_ready"),
    atRisk: readCount("at_risk"),
    averageHealthScore:
      typeof health === "number" && Number.isFinite(health) && health >= 0 && health <= 100
        ? health
        : null,
    pendingWorkOrders: readCount("pending_work_orders"),
  };
}

export function filterLocations(
  locations: readonly CommandLocation[],
  categories: ReadonlySet<LocationCategory>,
  query: string,
): CommandLocation[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return locations.filter((location) =>
    isValidCoordinates(location.coordinates) &&
    categories.has(location.category) &&
    (!normalizedQuery || `${location.name} ${location.region ?? ""}`.toLocaleLowerCase().includes(normalizedQuery)),
  );
}

export function selectLocation(
  visibleLocations: readonly CommandLocation[],
  selectedId: string | null,
): CommandLocation | null {
  return visibleLocations.find((location) => location.id === selectedId) ?? null;
}

export function isOverviewEmpty(overview: FleetOverview): boolean {
  return overview.aircraftTotal === 0;
}
