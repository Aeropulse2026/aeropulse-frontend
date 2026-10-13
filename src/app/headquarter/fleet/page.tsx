
"use client";

import { Activity, Plane, Wrench, ArrowUpRight, ShieldCheck } from "lucide-react";
import {
  SkewedCardCarousel,
  type SkewedCarouselCard,
} from "@/components/skewed-card-carousel";

const fleet: SkewedCarouselCard[] = [
  {
    id: "sentinel-12",
    title: "Sentinel 12",
    description:
      "Aerial surveillance platform monitoring designated airspace and maritime corridors.",
    eyebrow: "AP-812 / SURVEILLANCE",
    meta: "Readiness",
    detail: "72% / Maintenance",
    accent: "#f2ca8c",
    tone: "from-[#694f35] via-[#ae8350] to-[#30251c]",
    status: "Maintenance",
    readiness: 72,
  },
  {
    id: "hawk-21",
    title: "Hawk 21",
    description:
      "Advanced training aircraft supporting pilot conversion and readiness programs.",
    eyebrow: "AP-921 / TRAINING",
    meta: "Flight hours",
    detail: "39.1 h",
    accent: "#9ee7ca",
    tone: "from-[#254e50] via-[#3c8e83] to-[#102e35]",
    status: "Operational",
    readiness: 91,
  },
  {
    id: "falcon-01",
    title: "Falcon 01",
    description:
      "Multirole fighter assigned to western air command. Ready for immediate deployment.",
    eyebrow: "AP-401 / FIGHTER WING",
    meta: "Flight hours",
    detail: "84.3 h",
    accent: "#8dd8e6",
    tone: "from-[#173f6b] via-[#236a87] to-[#0b1f33]",
    status: "Operational",
    readiness: 96,
  },
  {
    id: "falcon-02",
    title: "Falcon 02",
    description:
      "Air superiority platform with long-range radar and rapid response capability.",
    eyebrow: "AP-402 / FIGHTER WING",
    meta: "Flight hours",
    detail: "71.9 h",
    accent: "#e3adc2",
    tone: "from-[#543b63] via-[#8b5578] to-[#251d3b]",
    status: "Standby",
    readiness: 88,
  },
  {
    id: "atlas-07",
    title: "Atlas 07",
    description:
      "Strategic transport aircraft supporting logistics and forward base operations.",
    eyebrow: "AP-607 / TRANSPORT",
    meta: "Flight hours",
    detail: "120.4 h",
    accent: "#c7e1df",
    tone: "from-[#435b62] via-[#78949a] to-[#1e343d]",
    status: "Operational",
    readiness: 94,
  },
];

export default function HeadquarterFleetPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-brand-background px-4 py-7 text-slate-950 sm:px-6 sm:py-9 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-[1440px] flex-col">
        {/* Page header */}
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-secondary">
              Headquarters / Fleet
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">
              Fleet overview
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
              Browse aircraft readiness, availability, and mission hours
              across the Aeropulse fleet.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border bg-white/80 px-4 py-2.5 text-sm text-brand-muted shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-success opacity-40" />
              <span className="relative size-2 rounded-full bg-brand-success" />
            </span>
            24 aircraft online
          </div>
        </header>

        {/* Aircraft carousel only */}
        <section
          aria-label="Fleet aircraft"
          className="flex-1"
        >
          <SkewedCardCarousel
            cards={fleet}
            ariaLabel="Aeropulse fleet carousel"
          />
        </section>

        {/* Footer */}
        <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-brand-border pt-4 text-xs text-brand-muted">
          <span>Aeropulse / Headquarters fleet management</span>

          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brand-success" />
            Network connected
          </span>
        </footer>
      </div>
    </main>
  );
}
