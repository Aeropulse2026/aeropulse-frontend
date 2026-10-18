"use client";

import type { AircraftRecord } from "@/lib/demo-data/aircraft";
import { FleetBrowser } from "@/components/fleet-browser";
import { HeadquartersFleetSnapshot } from "@/components/headquarters-fleet-snapshot";

export function HeadquartersFleetWorkspace({ aircraft }: { aircraft: AircraftRecord[] }) {
  return (
    <main className="min-h-screen bg-brand-background px-4 py-7 text-slate-950 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.24em] text-brand-secondary">Fleet workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">Fleet Overview</h1>
          <p className="mt-2 text-sm text-brand-muted">Search and compare aircraft records, then open a record for its serviceability and maintenance details.</p>
        </header>
        <div className="mb-6"><HeadquartersFleetSnapshot /></div>
        <FleetBrowser aircraft={aircraft} title="Aircraft directory" eyebrow="Aircraft records" description="Filter the network aircraft records by status, name, unit, platform, or base." detailPrefix="/headquarter/fleet" embedded />
      </div>
    </main>
  );
}
