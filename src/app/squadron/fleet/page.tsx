import { FleetBrowser } from "@/components/fleet-browser";
import { demoAircraft } from "@/lib/demo-data/aircraft";
export default function SquadronFleetPage(){return <FleetBrowser aircraft={demoAircraft.filter(a=>a.squadronId==="SQ-017")} title="Assigned fleet" eyebrow="Squadron / Fleet" detailPrefix="/squadron/fleet" appearance="squadron"/>}
