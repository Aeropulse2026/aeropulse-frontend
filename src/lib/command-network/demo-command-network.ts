import type { CommandLocation } from "./types";
import { demoAirbases } from "../demo-data/headquarters";

// Retained from the former SVG map solely for the explicitly synthetic preview.
// Positions are illustrative placements and never backend-reported locations.
export const demoLocations: CommandLocation[] = [
  { id: "demo-hq", name: "Command HQ", category: "headquarters", coordinates: [77.209, 28.614], region: "New Delhi", description: "Headquarters", source: "demo", details: [{ label: "Aircraft", value: "24" }, { label: "Reported operational", value: "21" }, { label: "Maintenance", value: "2" }, { label: "Readiness", value: "92%" }] },
  ...demoAirbases.map((base) => ({
    id: `demo-${base.code.toLowerCase().replace("afs-", "")}`,
    name: base.name,
    category: "airbase" as const,
    coordinates: base.coordinates,
    region: base.state,
    description: base.squadrons.join(" · "),
    source: "demo" as const,
    details: [
      { label: "Aircraft", value: String(base.aircraft) },
      { label: "Reported operational", value: String(base.operationalAircraft) },
      { label: "Maintenance", value: String(base.maintenanceAircraft) },
      { label: "Readiness", value: `${base.readiness}%` },
    ],
  })),
];

const airbaseLocations = demoLocations.filter((location) => location.category === "airbase");
const sumMetric = (label: string) => airbaseLocations.reduce((sum, location) => {
  const value = location.details?.find((metric) => metric.label === label)?.value;
  const parsed = value ? Number.parseFloat(value) : Number.NaN;
  return sum + (Number.isFinite(parsed) ? parsed : 0);
}, 0);
const networkAircraft = sumMetric("Aircraft");
const networkOperational = sumMetric("Reported operational");

export const demoOverview = [
  { label: "Aircraft across airbases", value: String(networkAircraft) },
  { label: "Reported operational", value: String(networkOperational) },
  { label: "In maintenance", value: String(sumMetric("Maintenance")) },
  { label: "Reported operational share", value: `${networkAircraft ? Math.round((networkOperational / networkAircraft) * 100) : 0}%` },
] as const;
