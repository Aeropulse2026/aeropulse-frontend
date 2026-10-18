import { Suspense } from "react";
import { SquadronFleetWorkspace } from "@/components/squadron-fleet-workspace";

export default function SquadronFleetPage() {
  return <Suspense fallback={<main className="min-h-screen bg-brand-background p-8 text-brand-muted">Loading fleet workspace…</main>}><SquadronFleetWorkspace /></Suspense>;
}
