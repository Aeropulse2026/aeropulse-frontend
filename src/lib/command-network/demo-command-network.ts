import type { CommandLocation } from "./types";

// Retained from the former SVG map solely for the explicitly synthetic preview.
// Positions are illustrative placements and never backend-reported locations.
export const demoLocations: CommandLocation[] = [
  { id: "demo-hq", name: "Command HQ", category: "headquarters", coordinates: [77.209, 28.614], region: "New Delhi", description: "Illustrative headquarters marker", source: "demo", details: [{ label: "Aircraft", value: "24" }, { label: "Reported operational", value: "21" }, { label: "Maintenance", value: "2" }, { label: "Readiness", value: "92%" }] },
  { id: "demo-ambala", name: "Ambala Air Station", category: "airbase", coordinates: [76.78, 30.38], region: "Haryana", description: "Air defence · 17 Golden Arrows", source: "demo", details: [{ label: "Aircraft", value: "42" }, { label: "Reported operational", value: "37" }, { label: "Maintenance", value: "3" }, { label: "Readiness", value: "91%" }] },
  { id: "demo-hindon", name: "Hindon Air Station", category: "airbase", coordinates: [77.38, 28.71], region: "Uttar Pradesh", description: "Transport · 9 Squadron", source: "demo", details: [{ label: "Aircraft", value: "28" }, { label: "Reported operational", value: "24" }, { label: "Maintenance", value: "2" }, { label: "Readiness", value: "90%" }] },
  { id: "demo-jodhpur", name: "Jodhpur Air Station", category: "airbase", coordinates: [73.02, 26.26], region: "Rajasthan", description: "Air defence · 1 Tigers", source: "demo", details: [{ label: "Aircraft", value: "31" }, { label: "Reported operational", value: "24" }, { label: "Maintenance", value: "4" }, { label: "Readiness", value: "74%" }] },
  { id: "demo-pune", name: "Pune Air Station", category: "airbase", coordinates: [73.85, 18.52], region: "Maharashtra", description: "Transport · 30 Rhinos", source: "demo", details: [{ label: "Aircraft", value: "36" }, { label: "Reported operational", value: "33" }, { label: "Maintenance", value: "1" }, { label: "Readiness", value: "93%" }] },
  { id: "demo-tezpur", name: "Tezpur Air Station", category: "airbase", coordinates: [92.8, 26.63], region: "Assam", description: "Training · 2 Squadron", source: "demo", details: [{ label: "Aircraft", value: "22" }, { label: "Reported operational", value: "19" }, { label: "Maintenance", value: "2" }, { label: "Readiness", value: "89%" }] },
  { id: "demo-sulur", name: "Sulur Air Station", category: "airbase", coordinates: [77.13, 11], region: "Tamil Nadu", description: "Surveillance · 43 Squadron", source: "demo", details: [{ label: "Aircraft", value: "27" }, { label: "Reported operational", value: "23" }, { label: "Maintenance", value: "2" }, { label: "Readiness", value: "88%" }] },
];

export const demoOverview = [
  { label: "Aircraft across sample network", value: "186" },
  { label: "Reported operational", value: "162" },
  { label: "In maintenance", value: "17" },
  { label: "Squadron readiness", value: "87%" },
] as const;
