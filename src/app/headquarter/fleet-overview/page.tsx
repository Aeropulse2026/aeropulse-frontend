import { HeadquartersFleetWorkspace } from "@/components/headquarters-fleet-workspace";
import { demoAircraft } from "@/lib/demo-data/aircraft";

export default function HeadquarterFleetOverviewPage() {
  return <HeadquartersFleetWorkspace aircraft={demoAircraft} />;
}
