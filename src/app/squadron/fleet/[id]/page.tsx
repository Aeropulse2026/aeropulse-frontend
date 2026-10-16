import { AircraftDetail } from "@/components/aircraft-detail";
import { Suspense } from "react";
export default function SquadronAircraftDetailsPage(){return <Suspense fallback={<main className="min-h-screen bg-brand-background p-8 text-brand-muted">Loading aircraft record…</main>}><AircraftDetail backHref="/squadron/fleet"/></Suspense>}
