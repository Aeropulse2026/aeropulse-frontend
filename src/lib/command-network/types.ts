export type LocationCategory = "headquarters" | "airbase" | "fleet";
export type DataSource = "demo" | "api";

export interface CommandLocation {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: [longitude: number, latitude: number];
  region?: string;
  description?: string;
  source: DataSource;
  details?: ReadonlyArray<{ label: string; value: string }>;
}

export interface FleetOverview {
  aircraftTotal: number | null;
  missionReady: number | null;
  atRisk: number | null;
  averageHealthScore: number | null;
  pendingWorkOrders: number | null;
}

export type ApiState =
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "ready"; overview: FleetOverview; fetchedAt: string }
  | { status: "empty"; overview: FleetOverview; fetchedAt: string }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string };
