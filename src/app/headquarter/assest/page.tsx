
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Cloud,
  MapPin,
  Plane,
  Radio,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

type Airbase = {
  name: string;
  code: string;
  location: string;
  state: string;
  status: "Operational" | "Limited operations" | "Standby";
  squadrons: string[];
  aircraft: number;
  personnel: number;
  runway: string;
  commander: string;
  accent: string;
};

const airbases: Airbase[] = [
  {
    name: "Ambala Air Force Station",
    code: "AFS-AMB",
    location: "Ambala",
    state: "Haryana",
    status: "Operational",
    squadrons: ["17 Golden Arrows", "7 Battle Axes"],
    aircraft: 42,
    personnel: 1840,
    runway: "Runway 08/26 · 3,658 m",
    commander: "Air Commodore R. Mehta",
    accent: "from-[#123d69] to-[#236a87]",
  },
  {
    name: "Hindon Air Force Station",
    code: "AFS-HDN",
    location: "Ghaziabad",
    state: "Uttar Pradesh",
    status: "Operational",
    squadrons: ["C-17 Globemaster", "C-130J Super Hercules"],
    aircraft: 28,
    personnel: 1260,
    runway: "Runway 10/28 · 2,743 m",
    commander: "Air Commodore S. Iyer",
    accent: "from-[#3b6170] to-[#1f3949]",
  },
  {
    name: "Jodhpur Air Force Station",
    code: "AFS-JDH",
    location: "Jodhpur",
    state: "Rajasthan",
    status: "Limited operations",
    squadrons: ["1 Tigers", "32 Thunderbirds"],
    aircraft: 31,
    personnel: 1480,
    runway: "Runway 05/23 · 2,744 m",
    commander: "Air Commodore A. Rathore",
    accent: "from-[#855537] to-[#49301f]",
  },
  {
    name: "Pune Air Force Station",
    code: "AFS-PUN",
    location: "Pune",
    state: "Maharashtra",
    status: "Operational",
    squadrons: ["30 Rhinos", "221 Squadron"],
    aircraft: 36,
    personnel: 1590,
    runway: "Runway 10/28 · 2,530 m",
    commander: "Air Commodore V. Nair",
    accent: "from-[#244d55] to-[#173136]",
  },
  {
    name: "Tezpur Air Force Station",
    code: "AFS-TEZ",
    location: "Tezpur",
    state: "Assam",
    status: "Standby",
    squadrons: ["2 Squadron", "101 Squadron"],
    aircraft: 22,
    personnel: 920,
    runway: "Runway 04/22 · 2,743 m",
    commander: "Air Commodore P. Bora",
    accent: "from-[#4b4772] to-[#272843]",
  },
  {
    name: "Sulur Air Force Station",
    code: "AFS-SUL",
    location: "Coimbatore",
    state: "Tamil Nadu",
    status: "Operational",
    squadrons: ["43 Squadron", "151 Helicopter Unit"],
    aircraft: 27,
    personnel: 1110,
    runway: "Runway 06/24 · 2,043 m",
    commander: "Air Commodore K. Menon",
    accent: "from-[#23625c] to-[#153a3a]",
  },
];

const stats = [
  {
    label: "Total airbases",
    value: "12",
    note: "Across 7 commands",
    icon: MapPin,
  },
  {
    label: "Operational",
    value: "09",
    note: "75% readiness",
    icon: ShieldCheck,
  },
  {
    label: "Active squadrons",
    value: "24",
    note: "+2 this quarter",
    icon: Radio,
  },
  {
    label: "Aircraft deployed",
    value: "186",
    note: "92% availability",
    icon: Plane,
  },
];

export default function AirbaseAssetsPage() {
  const [selectedAirbase, setSelectedAirbase] =
    useState<Airbase | null>(null);

  return (
    <main className="min-h-screen bg-brand-background px-4 py-8 text-slate-950 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-brand-secondary">
              Headquarters / Assets
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">
              Airbase command
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-brand-muted">
              Monitor airbase readiness, active squadrons, and command
              infrastructure across the network.
            </p>
          </div>
        </header>

        {/* Statistics */}
        <section
          className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Airbase statistics"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="hq-interactive-card group border-brand-border bg-white shadow-sm"
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-light text-brand-secondary transition-transform duration-200 group-hover:scale-105">
                    <Icon className="size-5" />
                  </span>

                  <div>
                    <p className="text-xs font-medium text-brand-muted">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-brand-primary-dark">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-brand-secondary">
                      {stat.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Airbase cards */}
        <section aria-labelledby="airbases-heading">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2
                id="airbases-heading"
                className="text-xl font-semibold tracking-tight text-brand-primary-dark sm:text-2xl"
              >
                Airbases & active squadrons
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                Select an airbase to view its complete operational profile.
              </p>
            </div>

            <Badge variant="outline" className="hidden sm:inline-flex">
              {airbases.length} shown
            </Badge>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {airbases.map((airbase) => (
              <AirbaseCard
                key={airbase.code}
                airbase={airbase}
                onSelect={setSelectedAirbase}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Compact airbase modal */}
      <Dialog
        open={Boolean(selectedAirbase)}
        onOpenChange={(open) => {
          if (!open) setSelectedAirbase(null);
        }}
      >
        {selectedAirbase && (
          <DialogContent
            className="w-[calc(100%-24px)] max-w-3xl gap-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-0 shadow-[0_30px_100px_rgba(15,35,60,0.25)] sm:rounded-[28px]"
          >
            {/* Compact gradient header */}
            <div
              className={`relative isolate overflow-hidden bg-gradient-to-br ${selectedAirbase.accent} px-5 py-5 text-white sm:px-8 sm:py-6`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-14 -z-10 size-52 rounded-full border border-white/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 bottom-0 -z-10 text-white/[0.07]"
              >
                <Plane className="size-44 -rotate-12 sm:size-52" strokeWidth={0.8} />
              </div>

              <div className="relative z-10 flex items-start justify-between gap-4 pr-7">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">
                    {selectedAirbase.code}
                  </p>

                  <DialogTitle className="mt-2 text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                    {selectedAirbase.name}
                  </DialogTitle>

                  <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-white/80 sm:text-base">
                    <MapPin className="size-4 shrink-0" />
                    {selectedAirbase.location}, {selectedAirbase.state}, India
                  </DialogDescription>
                </div>

                <Badge
                  className={`shrink-0 rounded-full border border-white/25 px-2.5 py-1 text-[11px] font-semibold text-white shadow-none sm:text-xs ${selectedAirbase.status === "Operational"
                      ? "bg-emerald-500/20"
                      : selectedAirbase.status === "Standby"
                        ? "bg-rose-500/20"
                        : "bg-amber-500/20"
                    }`}
                >
                  <span
                    className={`mr-1.5 inline-block size-2 rounded-full ${selectedAirbase.status === "Operational"
                        ? "bg-emerald-400"
                        : selectedAirbase.status === "Standby"
                          ? "bg-rose-400"
                          : "bg-amber-400"
                      }`}
                  />
                  {selectedAirbase.status}
                </Badge>
              </div>

              <div className="relative z-10 mt-4 flex flex-wrap gap-2 text-[11px] text-white/85 sm:text-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                  <ShieldCheck className="size-4" />
                  Base profile
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                  <Plane className="size-4" />
                  {selectedAirbase.aircraft} assigned aircraft
                </span>
              </div>
            </div>

            {/* Overview: no Active Squadrons section */}
            <div className="px-5 py-4 sm:px-8 sm:py-5">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">
                  Base overview
                </p>
                <p className="mt-1 text-xs text-brand-muted sm:text-sm">
                  Key personnel and infrastructure details
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <InfoRow
                  icon={Users}
                  label="Personnel"
                  value={selectedAirbase.personnel.toLocaleString("en-IN")}
                />

                <InfoRow
                  icon={Plane}
                  label="Aircraft assigned"
                  value={String(selectedAirbase.aircraft)}
                />

                <InfoRow
                  icon={Cloud}
                  label="Runway"
                  value={selectedAirbase.runway}
                />

                <InfoRow
                  icon={ShieldCheck}
                  label="Base commander"
                  value={selectedAirbase.commander}
                  last
                />
              </div>
            </div>

            {/* Compact footer */}
            <DialogFooter className="flex flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/90 px-4 py-3 sm:px-6">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 shrink-0 rounded-full border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-100"
                  />
                }
              >
                <X className="size-4" />
                Close
              </DialogClose>

              <Link
                href="/headquarter/squadrons"
                className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-[#123D69] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0B1F33] sm:flex-none sm:px-6"
              >
                <ArrowUpRight className="size-4 shrink-0" />
                <span className="truncate">Open squadron management</span>
              </Link>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </main>
  );
}

/* Existing airbase cards */
function AirbaseCard({
  airbase,
  onSelect,
}: {
  airbase: Airbase;
  onSelect: (airbase: Airbase) => void;
}) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(airbase);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(airbase)}
      onKeyDown={handleKeyDown}
      className="hq-interactive-card group cursor-pointer overflow-hidden border-brand-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-brand-secondary/50 hover:shadow-lg hover:shadow-slate-200/60 focus-visible:outline-2 focus-visible:outline-brand-secondary"
    >
      <div
        className={`relative h-28 overflow-hidden bg-gradient-to-br ${airbase.accent} p-5 text-white`}
      >
        <div className="absolute -right-6 -top-12 size-40 rounded-full border border-white/15" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
              {airbase.code}
            </p>
            <h3 className="mt-2 text-xl font-semibold">
              {airbase.location}
            </h3>
          </div>

          <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/20">
            {airbase.status}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-base text-brand-primary-dark">
          {airbase.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs text-brand-muted">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {airbase.state}
          </span>

          <span className="flex items-center gap-1.5">
            <Plane className="size-3.5" />
            {airbase.aircraft} aircraft
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {airbase.squadrons.map((squadron) => (
            <span
              key={squadron}
              className="rounded-md bg-brand-secondary-light px-2 py-1 text-[11px] font-medium text-brand-secondary"
            >
              {squadron}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-brand-border pt-4 text-xs font-semibold text-brand-secondary">
          <span>View airbase details</span>
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </CardContent>
    </Card>
  );
}

/* Compact overview rows */
function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-3 ${last ? "" : "border-b border-slate-100"
        }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700 sm:size-10">
        <Icon className="size-5" strokeWidth={1.9} />
      </span>

      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <p className="text-xs text-slate-500 sm:text-sm">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-900 sm:mt-0 sm:max-w-[60%] sm:text-right">
          {value}
        </p>
      </div>
    </div>
  );
}