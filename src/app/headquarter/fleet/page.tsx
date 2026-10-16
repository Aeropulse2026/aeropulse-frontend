import { FleetBrowser } from "@/components/fleet-browser";
import { demoAircraft } from "@/lib/demo-data/aircraft";
export default function HeadquarterFleetPage(){return <FleetBrowser aircraft={demoAircraft} detailPrefix="/headquarter/fleet" />}
