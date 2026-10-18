import type { InventoryItem, MaintenanceTask, SquadronIdentity } from "./types";
import type { AircraftRecord } from "@/lib/demo-data/aircraft";

export const demoSquadron: SquadronIdentity = {
  id: "SQ-017",
  name: "17 Golden Arrows",
  base: "Ambala",
  role: "Air defence",
};

export const DEMO_AS_OF_DATE = "2026-10-18";

export const demoSquadronAircraft: readonly AircraftRecord[] = [
  { id: "SQ17-01", name: "Arrow 01", model: "Multirole fighter", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Air defence", base: "Ambala", status: "Operational", readiness: 94, hours: 84.3, hoursSinceMaintenance: 18.4, lastMaintenance: "2026-09-18", nextMaintenance: "2026-10-28", description: "Assigned to the air defence flight.", accent: "#167c96" },
  { id: "SQ17-02", name: "Arrow 02", model: "Air superiority", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Air defence", base: "Ambala", status: "Standby", readiness: 86, hours: 71.9, hoursSinceMaintenance: 42.1, lastMaintenance: "2026-08-27", nextMaintenance: "2026-10-20", description: "Awaiting a routine readiness review.", accent: "#d39024" },
  { id: "SQ17-03", name: "Arrow 03", model: "Multirole fighter", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Air defence", base: "Ambala", status: "Maintenance", readiness: 64, hours: 112.6, hoursSinceMaintenance: 96.2, lastMaintenance: "2026-07-14", nextMaintenance: "2026-10-16", description: "An inspection task is in progress.", accent: "#c75b5b" },
  { id: "SQ17-04", name: "Arrow 04", model: "Advanced trainer", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Conversion training", base: "Ambala", status: "Operational", readiness: 91, hours: 53.7, hoursSinceMaintenance: 31.6, lastMaintenance: "2026-09-06", nextMaintenance: "2026-10-25", description: "Supports conversion and continuation training.", accent: "#34a982" },
];

export const demoMaintenanceTasks: readonly MaintenanceTask[] = [
  { id: "MT-017-01", aircraftId: "SQ17-03", component: "Flight control inspection", action: "Complete scheduled inspection and attach inspection checklist", status: "in_progress", priority: "urgent", scheduledFor: "2026-10-16", evidence: "incomplete", requiredPartId: "SP-204" },
  { id: "MT-017-02", aircraftId: "SQ17-02", component: "Hydraulic system", action: "Review pressure trend and replace filter if inspection confirms wear", status: "pending", priority: "review", scheduledFor: "2026-10-20", evidence: "complete", requiredPartId: "SP-118" },
  { id: "MT-017-03", aircraftId: "SQ17-01", component: "Routine service", action: "Plan routine service window", status: "pending", priority: "routine", scheduledFor: "2026-10-28", evidence: "incomplete" },
  { id: "MT-017-04", aircraftId: "SQ17-01", component: "Routine service inspection", action: "Completed routine service inspection", status: "completed", priority: "routine", scheduledFor: "2026-09-18", completedAt: "2026-09-18", evidence: "complete" },
];

export const demoInventory: readonly InventoryItem[] = [
  { id: "CTL-014", name: "Authorized training stores", category: "Controlled inventory", quantity: 14, reserved: 5, serviceability: "Secured", location: "Armory A", unit: "units" },
  { id: "SP-118", name: "Hydraulic filter kit", category: "Spare parts", quantity: 8, reserved: 3, serviceability: "Serviceable", location: "Stores B", unit: "kits", reorderPoint: 4 },
  { id: "SP-204", name: "Landing gear seal set", category: "Spare parts", quantity: 2, reserved: 1, serviceability: "Low stock", location: "Stores B", unit: "sets", reorderPoint: 3 },
  { id: "SP-309", name: "Pressure sensor unit", category: "Spare parts", quantity: 0, reserved: 0, serviceability: "Out of stock", location: "Stores B", unit: "units", reorderPoint: 2 },
  { id: "EQ-031", name: "Ground power unit", category: "Operational equipment", quantity: 4, reserved: 1, serviceability: "Available", location: "Apron", unit: "units", reorderPoint: 1 },
  { id: "EQ-055", name: "Portable diagnostic set", category: "Operational equipment", quantity: 3, reserved: 2, serviceability: "Limited availability", location: "Workshop", unit: "sets", reorderPoint: 1 },
];
