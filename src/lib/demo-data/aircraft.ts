export type AircraftRecord = {
  id: string; name: string; model: string; squadron: string; squadronId: string; role: string;
  base: string; status: "Operational" | "Maintenance" | "Standby"; readiness: number;
  hours: number; hoursSinceMaintenance: number; lastMaintenance: string; nextMaintenance: string;
  description: string; accent: string;
};

// Synthetic preview data. Replace this module with the authorized fleet API adapter when available.
export const demoAircraft: AircraftRecord[] = [
  { id: "AP-401", name: "Falcon 01", model: "Multirole fighter", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Air defence", base: "Ambala", status: "Operational", readiness: 96, hours: 84.3, hoursSinceMaintenance: 18.4, lastMaintenance: "2026-09-18", nextMaintenance: "2026-10-28", description: "Multirole platform assigned to western air command.", accent: "#167c96" },
  { id: "AP-402", name: "Falcon 02", model: "Air superiority", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Air defence", base: "Ambala", status: "Standby", readiness: 88, hours: 71.9, hoursSinceMaintenance: 42.1, lastMaintenance: "2026-08-27", nextMaintenance: "2026-10-20", description: "Air superiority platform with rapid response capability.", accent: "#d39024" },
  { id: "AP-403", name: "Falcon 03", model: "Multirole fighter", squadron: "17 Golden Arrows", squadronId: "SQ-017", role: "Air defence", base: "Ambala", status: "Maintenance", readiness: 64, hours: 112.6, hoursSinceMaintenance: 96.2, lastMaintenance: "2026-07-14", nextMaintenance: "2026-10-16", description: "Scheduled inspection and service work in progress.", accent: "#c75b5b" },
  { id: "AP-921", name: "Hawk 21", model: "Advanced trainer", squadron: "2 Squadron", squadronId: "SQ-002", role: "Training", base: "Tezpur", status: "Operational", readiness: 91, hours: 39.1, hoursSinceMaintenance: 12.8, lastMaintenance: "2026-09-25", nextMaintenance: "2026-11-12", description: "Training aircraft supporting pilot conversion programs.", accent: "#34a982" },
  { id: "AP-812", name: "Sentinel 12", model: "Surveillance", squadron: "43 Squadron", squadronId: "SQ-043", role: "Surveillance", base: "Sulur", status: "Maintenance", readiness: 72, hours: 102.4, hoursSinceMaintenance: 82.5, lastMaintenance: "2026-08-02", nextMaintenance: "2026-10-18", description: "Surveillance platform for designated airspace corridors.", accent: "#d39024" },
  { id: "AP-607", name: "Atlas 07", model: "Strategic transport", squadron: "9 Squadron", squadronId: "SQ-009", role: "Transport", base: "Ghaziabad", status: "Operational", readiness: 94, hours: 120.4, hoursSinceMaintenance: 22.1, lastMaintenance: "2026-09-12", nextMaintenance: "2026-11-02", description: "Strategic transport supporting logistics operations.", accent: "#167c96" },
  { id: "AP-224", name: "Rhino 24", model: "Heavy transport", squadron: "30 Rhinos", squadronId: "SQ-030", role: "Transport", base: "Pune", status: "Operational", readiness: 89, hours: 64.8, hoursSinceMaintenance: 38.2, lastMaintenance: "2026-09-04", nextMaintenance: "2026-10-30", description: "Heavy transport aircraft for regional logistics.", accent: "#167c96" },
];

export type AircraftStatusFilter = "All status" | AircraftRecord["status"];

export function filterAircraftRecords(
  records: readonly AircraftRecord[],
  query: string,
  status: AircraftStatusFilter,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return records.filter((aircraft) => {
    const searchableText = [
      aircraft.id,
      aircraft.name,
      aircraft.squadron,
      aircraft.squadronId,
      aircraft.model,
      aircraft.role,
      aircraft.base,
      aircraft.status,
      aircraft.description,
    ].filter(Boolean).join(" ").toLowerCase();

    return searchableText.includes(normalizedQuery)
      && (status === "All status" || aircraft.status === status);
  });
}
