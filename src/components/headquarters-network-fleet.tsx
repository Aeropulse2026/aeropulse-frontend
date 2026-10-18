import Link from "next/link";
import { ArrowRight, Gauge, Plane } from "lucide-react";
import { demoAircraft } from "@/lib/demo-data/aircraft";
import { HEADQUARTERS_DEMO_AS_OF_DATE, getHeadquartersFleetSummary } from "@/lib/demo-data/headquarters";
import { HeadquartersFleetSnapshot } from "@/components/headquarters-fleet-snapshot";

const summary = getHeadquartersFleetSummary(demoAircraft);
const maxPlatformCount = Math.max(1, ...summary.byModel.map((item) => item.count));

export function HeadquartersNetworkFleet() {
  return (
    <main className="min-h-screen bg-brand-background px-4 py-7 text-slate-950 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header>
          <p className="text-[11px] font-bold uppercase tracking-[.24em] text-brand-secondary">Command fleet</p>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">Network fleet</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">Command-level composition and readiness across the aircraft records available to Headquarters. Readiness and service windows use the reference date {HEADQUARTERS_DEMO_AS_OF_DATE}.</p>
        </header>

        <HeadquartersFleetSnapshot />

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6" aria-labelledby="network-status-heading">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-light text-brand-secondary"><Gauge aria-hidden="true" className="size-5" /></span>
              <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Readiness overview</p><h2 id="network-status-heading" className="mt-1 text-lg font-semibold text-brand-primary-dark">Status distribution</h2></div>
            </div>
            {summary.total > 0 ? <ul className="mt-5 space-y-4">{summary.distribution.map((item) => <li key={item.name}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-medium text-brand-primary-dark">{item.name}</span><span className="tabular-nums text-brand-muted">{item.count} · {item.percentage}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.name === "Operational" ? "bg-emerald-600" : item.name === "Maintenance" ? "bg-amber-500" : "bg-slate-400"}`} style={{ width: `${item.percentage}%` }} /></div></li>)}</ul> : <p className="mt-5 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No fleet records are available.</p>}
            <p className="mt-5 border-t border-brand-border pt-4 text-xs leading-5 text-brand-muted">Status totals are mutually exclusive and reconcile to {summary.total} aircraft records.</p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6" aria-labelledby="network-platform-heading">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-light text-brand-secondary"><Plane aria-hidden="true" className="size-5" /></span>
              <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Fleet composition</p><h2 id="network-platform-heading" className="mt-1 text-lg font-semibold text-brand-primary-dark">Aircraft by platform</h2></div>
            </div>
            {summary.byModel.length > 0 ? <ul className="mt-5 space-y-4">{summary.byModel.map((item) => <li key={item.name}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="font-medium text-brand-primary-dark">{item.name}</span><span className="tabular-nums text-brand-muted">{item.count} aircraft</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-secondary" style={{ width: `${item.count / maxPlatformCount * 100}%` }} /></div></li>)}</ul> : <p className="mt-5 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No platform records are available.</p>}
            <p className="mt-5 border-t border-brand-border pt-4 text-xs leading-5 text-brand-muted">Breakdown is calculated from the platform field on each aircraft record.</p>
          </section>
        </div>

        <section className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm sm:p-6" aria-labelledby="network-squadron-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Unit distribution</p><h2 id="network-squadron-heading" className="mt-1 text-lg font-semibold text-brand-primary-dark">Aircraft and readiness by squadron</h2></div>
            <Link href="/headquarter/squadrons" className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary">Squadron management <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </div>
          {summary.bySquadron.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{summary.bySquadron.map((unit) => <article key={unit.name} className="rounded-xl border border-brand-border bg-brand-background p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-brand-primary-dark">{unit.name}</h3><span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold tabular-nums text-brand-muted">{unit.count} aircraft</span></div><div className="mt-4 flex items-center justify-between gap-3 text-xs"><span className="text-brand-muted">Average recorded readiness</span><strong className="tabular-nums text-brand-primary-dark">{unit.averageReadiness}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${unit.averageReadiness}%` }} /></div></article>)}</div> : <p className="mt-4 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No squadron assignments are available.</p>}
        </section>

        <Link href="/headquarter/fleet-overview" className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-brand-secondary/20 bg-white p-5 shadow-sm transition hover:border-brand-secondary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary sm:p-6">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-secondary">Aircraft workspace</p><h2 className="mt-1 text-lg font-semibold text-brand-primary-dark">Open Fleet Overview</h2><p className="mt-1 text-sm text-brand-muted">Search, filter, compare, and inspect individual aircraft records.</p></div>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-brand-secondary transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </main>
  );
}
