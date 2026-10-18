import type { AircraftRecord } from "./aircraft";

export const HEADQUARTERS_DEMO_AS_OF_DATE = "2026-10-18";

export type AirbaseRecord = {
  name: string;
  code: string;
  location: string;
  state: string;
  status: "Operational" | "Limited operations" | "Standby";
  squadrons: string[];
  aircraft: number;
  personnel: number;
  runway: string;
  commander: string;
  accent: string;
  coordinates: [longitude: number, latitude: number];
  operationalAircraft: number;
  maintenanceAircraft: number;
  readiness: number;
};

// Fictional preview profiles. No service readiness or live deployment is implied.
export const demoAirbases: readonly AirbaseRecord[] = [
  { name: "Ambala Air Force Station", code: "AFS-AMB", location: "Ambala", state: "Haryana", status: "Operational", squadrons: ["17 Golden Arrows", "7 Battle Axes"], aircraft: 42, personnel: 1840, runway: "Runway 08/26 · 3,658 m", commander: "Air Commodore R. Mehta", accent: "from-[#123d69] to-[#236a87]", coordinates: [76.78, 30.38], operationalAircraft: 37, maintenanceAircraft: 3, readiness: 91 },
  { name: "Hindon Air Force Station", code: "AFS-HDN", location: "Ghaziabad", state: "Uttar Pradesh", status: "Operational", squadrons: ["9 Squadron"], aircraft: 28, personnel: 1260, runway: "Runway 10/28 · 2,743 m", commander: "Air Commodore S. Iyer", accent: "from-[#3b6170] to-[#1f3949]", coordinates: [77.38, 28.71], operationalAircraft: 24, maintenanceAircraft: 2, readiness: 90 },
  { name: "Jodhpur Air Force Station", code: "AFS-JDH", location: "Jodhpur", state: "Rajasthan", status: "Limited operations", squadrons: ["1 Tigers"], aircraft: 31, personnel: 1480, runway: "Runway 05/23 · 2,744 m", commander: "Air Commodore A. Rathore", accent: "from-[#855537] to-[#49301f]", coordinates: [73.02, 26.26], operationalAircraft: 24, maintenanceAircraft: 4, readiness: 74 },
  { name: "Pune Air Force Station", code: "AFS-PUN", location: "Pune", state: "Maharashtra", status: "Operational", squadrons: ["30 Rhinos", "221 Squadron"], aircraft: 36, personnel: 1590, runway: "Runway 10/28 · 2,530 m", commander: "Air Commodore V. Nair", accent: "from-[#244d55] to-[#173136]", coordinates: [73.85, 18.52], operationalAircraft: 33, maintenanceAircraft: 1, readiness: 93 },
  { name: "Tezpur Air Force Station", code: "AFS-TEZ", location: "Tezpur", state: "Assam", status: "Standby", squadrons: ["2 Squadron", "101 Squadron"], aircraft: 22, personnel: 920, runway: "Runway 04/22 · 2,743 m", commander: "Air Commodore P. Bora", accent: "from-[#4b4772] to-[#272843]", coordinates: [92.8, 26.63], operationalAircraft: 19, maintenanceAircraft: 2, readiness: 89 },
  { name: "Sulur Air Force Station", code: "AFS-SUL", location: "Coimbatore", state: "Tamil Nadu", status: "Operational", squadrons: ["43 Squadron", "151 Helicopter Unit"], aircraft: 27, personnel: 1110, runway: "Runway 06/24 · 2,043 m", commander: "Air Commodore K. Menon", accent: "from-[#23625c] to-[#153a3a]", coordinates: [77.13, 11], operationalAircraft: 23, maintenanceAircraft: 2, readiness: 88 },
];

export function getAirbaseSummary(airbases: readonly AirbaseRecord[] = demoAirbases) {
  return {
    total: airbases.length,
    operational: airbases.filter((base) => base.status === "Operational").length,
    squadronAssignments: airbases.reduce((total, base) => total + base.squadrons.length, 0),
    aircraftRepresented: airbases.reduce((total, base) => total + base.aircraft, 0),
  };
}

export function getHeadquartersFleetSummary(aircraft: readonly AircraftRecord[]) {
  const statuses = ["Operational", "Maintenance", "Standby"] as const;
  const distribution = statuses.map((status) => ({
    name: status,
    count: aircraft.filter((record) => record.status === status).length,
    percentage: aircraft.length
      ? Math.round((aircraft.filter((record) => record.status === status).length / aircraft.length) * 100)
      : 0,
  }));
  return {
    total: aircraft.length,
    distribution,
    aircraftHours: aircraft.map(({ id, hours }) => ({ id, hours })),
    operational: distribution.find((item) => item.name === "Operational")?.count ?? 0,
    inMaintenance: distribution.find((item) => item.name === "Maintenance")?.count ?? 0,
    unavailable: distribution.find((item) => item.name === "Standby")?.count ?? 0,
    averageReadiness: aircraft.length ? Math.round(aircraft.reduce((sum, record) => sum + record.readiness, 0) / aircraft.length) : null,
    operationalShare: aircraft.length ? Math.round(((distribution.find((item) => item.name === "Operational")?.count ?? 0) / aircraft.length) * 100) : null,
    totalFlightHours: aircraft.reduce((sum, record) => sum + record.hours, 0),
    averageFlightHours: aircraft.length ? aircraft.reduce((sum, record) => sum + record.hours, 0) / aircraft.length : null,
    dueWithin14Days: aircraft.filter((record) => {
      const days = (Date.parse(record.nextMaintenance) - Date.parse(HEADQUARTERS_DEMO_AS_OF_DATE)) / 86_400_000;
      return Number.isFinite(days) && days >= 0 && days <= 14;
    }).length,
    pastScheduledServiceDate: aircraft.filter((record) => record.nextMaintenance < HEADQUARTERS_DEMO_AS_OF_DATE).length,
    byModel: Object.values(aircraft.reduce<Record<string, { name: string; count: number }>>((groups, record) => {
      groups[record.model] ??= { name: record.model, count: 0 };
      groups[record.model].count += 1;
      return groups;
    }, {})),
    bySquadron: Object.values(aircraft.reduce<Record<string, { name: string; count: number; readinessTotal: number }>>((groups, record) => {
      groups[record.squadronId] ??= { name: record.squadron, count: 0, readinessTotal: 0 };
      groups[record.squadronId].count += 1;
      groups[record.squadronId].readinessTotal += record.readiness;
      return groups;
    }, {})).map((group) => ({ name: group.name, count: group.count, averageReadiness: Math.round(group.readinessTotal / group.count) })),
    byBase: Object.values(aircraft.reduce<Record<string, { name: string; count: number }>>((groups, record) => {
      groups[record.base] ??= { name: record.base, count: 0 };
      groups[record.base].count += 1;
      return groups;
    }, {})),
  };
}
