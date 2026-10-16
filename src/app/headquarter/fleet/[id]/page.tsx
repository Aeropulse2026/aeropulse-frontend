import { AircraftDetail } from "@/components/aircraft-detail";
import { Suspense } from "react";
export default function AircraftDetailsPage(){return <Suspense fallback={<main className="min-h-screen bg-brand-background p-8 text-brand-muted">Loading aircraft record…</main>}><AircraftDetail backHref="/headquarter/fleet"/></Suspense>}
