"use client";

import { Activity, Plane, Wrench } from "lucide-react";

import { SkewedCardCarousel, type SkewedCarouselCard } from "@/components/skewed-card-carousel";

const fleet: SkewedCarouselCard[] = [
  { id: "falcon-01", title: "Falcon 01", description: "Multirole fighter assigned to western air command. Ready for immediate deployment.", eyebrow: "AP-401 / FIGHTER WING", meta: "Flight hours", detail: "842.6 h", accent: "#8dd8e6", tone: "bg-gradient-to-br from-[#173f6b] via-[#236a87] to-[#0b1f33]" },
  { id: "falcon-02", title: "Falcon 02", description: "Air superiority platform with long-range radar and rapid response capability.", eyebrow: "AP-402 / FIGHTER WING", meta: "Flight hours", detail: "719.3 h", accent: "#e3adc2", tone: "bg-gradient-to-br from-[#543b63] via-[#8b5578] to-[#251d3b]" },
  { id: "atlas-07", title: "Atlas 07", description: "Strategic transport aircraft supporting logistics and forward base operations.", eyebrow: "AP-607 / TRANSPORT", meta: "Flight hours", detail: "1,204.1 h", accent: "#c7e1df", tone: "bg-gradient-to-br from-[#435b62] via-[#78949a] to-[#1e343d]" },
  { id: "sentinel-12", title: "Sentinel 12", description: "Aerial surveillance platform monitoring designated airspace and maritime corridors.", eyebrow: "AP-812 / SURVEILLANCE", meta: "Readiness", detail: "72% / MAINTENANCE", accent: "#f2ca8c", tone: "bg-gradient-to-br from-[#694f35] via-[#ae8350] to-[#30251c]" },
  { id: "hawk-21", title: "Hawk 21", description: "Advanced training aircraft supporting pilot conversion and readiness programs.", eyebrow: "AP-921 / TRAINING", meta: "Flight hours", detail: "391.2 h", accent: "#9ee7ca", tone: "bg-gradient-to-br from-[#254e50] via-[#3c8e83] to-[#102e35]" },
];

export default function HeadquarterFleetPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-brand-background px-6 py-10 text-slate-950 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-brand-secondary">Headquarters / Fleet</p><h1 className="text-4xl font-semibold tracking-tight text-brand-primary-dark">Fleet overview</h1><p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted">Browse aircraft readiness, availability, and mission hours across the Aeropulse fleet.</p></div><div className="flex items-center gap-2 text-sm text-brand-muted"><span className="size-2 rounded-full bg-brand-success shadow-[0_0_12px_var(--color-brand-success)]" />24 aircraft online</div></header>
        <SkewedCardCarousel cards={fleet} ariaLabel="Aeropulse fleet carousel" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4"><Plane className="size-5 text-brand-secondary" /><div><p className="text-xs text-brand-muted">Operational</p><p className="text-lg font-semibold text-brand-primary-dark">18 aircraft</p></div></div><div className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4"><Activity className="size-5 text-brand-secondary" /><div><p className="text-xs text-brand-muted">On standby</p><p className="text-lg font-semibold text-brand-primary-dark">04 aircraft</p></div></div><div className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-4"><Wrench className="size-5 text-brand-accent" /><div><p className="text-xs text-brand-muted">Maintenance</p><p className="text-lg font-semibold text-brand-primary-dark">02 aircraft</p></div></div></div>
      </div>
    </main>
  );
}
