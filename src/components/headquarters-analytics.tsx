"use client";

import { Activity, BarChart3, Clock3, Gauge, Plane, Wrench } from "lucide-react";
import { demoAircraft } from "@/lib/demo-data/aircraft";
import { getHeadquartersFleetSummary, HEADQUARTERS_DEMO_AS_OF_DATE } from "@/lib/demo-data/headquarters";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fleetSummary = getHeadquartersFleetSummary(demoAircraft);
const statusStyles = {
  Operational: { color: "bg-emerald-500", text: "text-emerald-700" },
  Maintenance: { color: "bg-amber-500", text: "text-amber-800" },
  Standby: { color: "bg-slate-400", text: "text-slate-700" },
};
const summaryCards = [
  { label: "Total fleet", value: fleetSummary.total, note: "Aircraft records", icon: Plane },
  { label: "Operational", value: fleetSummary.operational, note: "Recorded status", icon: Activity },
  { label: "In maintenance", value: fleetSummary.inMaintenance, note: "Recorded status", icon: Wrench },
  { label: "Unavailable", value: fleetSummary.unavailable, note: "Standby status", icon: Gauge },
  { label: "Average readiness", value: fleetSummary.averageReadiness === null ? "—" : `${fleetSummary.averageReadiness}%`, note: "Mean of available aircraft readiness fields", icon: Gauge },
  { label: "Average flight hours", value: fleetSummary.averageFlightHours === null ? "—" : `${fleetSummary.averageFlightHours.toFixed(1)} h`, note: "Mean recorded counter", icon: Clock3 },
  { label: "Due within 14 days", value: fleetSummary.dueWithin14Days, note: `From ${HEADQUARTERS_DEMO_AS_OF_DATE}`, icon: Wrench },
  { label: "Past scheduled date", value: fleetSummary.pastScheduledServiceDate, note: "Not a maintenance-task count", icon: Clock3 },
];
const aircraftByPlatform = fleetSummary.byModel;
const readinessBySquadron = fleetSummary.bySquadron;
const serviceWindowDistribution = [
  { name: "Past scheduled date", count: fleetSummary.pastScheduledServiceDate },
  { name: "Due within 14 days", count: fleetSummary.dueWithin14Days },
  { name: "Beyond 14 days", count: Math.max(0, fleetSummary.total - fleetSummary.pastScheduledServiceDate - fleetSummary.dueWithin14Days) },
];

function DistributionPanel({ title, eyebrow, rows, valueLabel = "aircraft" }: { title: string; eyebrow: string; rows: { name: string; count: number; averageReadiness?: number }[]; valueLabel?: string }) {
  const maximum = Math.max(1, ...rows.map((row) => row.count));
  return <section className="hq-interactive-card hq-statistics-panel rounded-2xl border border-brand-border bg-white p-5 sm:p-6" aria-label={title}>
    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-brand-secondary">{eyebrow}</p><h3 className="mt-1 text-lg font-semibold text-brand-primary-dark">{title}</h3>
    {rows.length ? <ul className="mt-5 space-y-4">{rows.map((row) => <li key={row.name}><div className="mb-1 flex flex-wrap justify-between gap-2 text-sm"><span className="font-medium text-brand-primary-dark">{row.name}</span><span className="tabular-nums text-brand-muted">{row.count} {valueLabel}{row.averageReadiness === undefined ? "" : ` · ${row.averageReadiness}% avg readiness`}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-secondary" style={{ width: `${row.count / maximum * 100}%` }}/></div></li>)}</ul> : <p className="mt-5 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No aircraft records are available.</p>}
  </section>;
}

function AnalyticsBarChart({ title, description, data, dataKey, unit, domain, color }: { title: string; description: string; data: { name: string; [key: string]: string | number }[]; dataKey: string; unit: string; domain?: [number, number]; color: string }) {
  return <section className="hq-interactive-card rounded-2xl border border-brand-border bg-white p-5 sm:p-6" aria-label={title}>
    <h3 className="font-semibold text-brand-primary-dark">{title}</h3><p className="mt-1 text-xs text-brand-muted">{description}</p>
    {data.length ? <div className="mt-4 h-64" role="img" aria-label={`${title}. ${description}`}><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 480, height: 250 }}><BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/><XAxis dataKey="name" tickLine={false} interval={0} angle={-12} textAnchor="end" height={58} tick={{ fontSize: 10 }}/><YAxis allowDecimals={unit === "%"} domain={domain} unit={unit} width={38} tick={{ fontSize: 10 }}/><Tooltip formatter={(value) => [`${value}${unit}`, title]}/><Bar dataKey={dataKey} name={title} fill={color} radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div> : <p className="mt-4 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No records are available for this chart.</p>}
  </section>;
}

export function HeadquartersAnalytics() {
  return (
    <section id="statistics" className="hq-statistics-page rounded-3xl border border-brand-border p-4 sm:p-6" aria-labelledby="hq-analytics-title">
      <header className="hq-stats-header mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-secondary">Command analytics</p>
        </div>
        <h2 id="hq-analytics-title" className="mt-2 text-2xl font-semibold tracking-tight text-brand-primary-dark">Fleet status and utilization</h2>
        <p className="mt-2 text-sm text-brand-muted">Fleet indicators and distributions calculated from aircraft records in Fleet overview.</p>
      </header>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{summaryCards.map(({ label, value, note, icon: Icon }) => <article key={label} className="hq-interactive-card rounded-2xl border border-brand-border bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium text-brand-muted">{label}</p><Icon className="size-4 shrink-0 text-brand-secondary" aria-hidden="true"/></div><p className="mt-2 text-2xl font-semibold tabular-nums text-brand-primary-dark">{value}</p><p className="mt-1 text-xs leading-5 text-brand-muted">{note}</p></article>)}</div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="hq-interactive-card hq-statistics-panel group rounded-2xl border border-brand-border bg-white p-5 sm:p-6" aria-labelledby="readiness-title">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">Fleet status</p><h3 id="readiness-title" className="mt-1 text-lg font-semibold text-brand-primary-dark">Aircraft status distribution</h3></div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-secondary/15 bg-brand-secondary-light/70 text-brand-secondary"><BarChart3 className="size-5" aria-hidden="true" /></span>
          </div>
          {fleetSummary.total > 0 ? <div className="hq-readiness-track mt-7 flex h-5 overflow-hidden rounded-full bg-slate-100 p-0.5" role="img" aria-label={`Status distribution for ${fleetSummary.total} aircraft`}>
            {fleetSummary.distribution.map((item, index) => <div key={item.name} className={`hq-chart-segment ${statusStyles[item.name].color} ${index === 0 ? "rounded-l-full" : ""} ${index === fleetSummary.distribution.length - 1 ? "rounded-r-full" : ""}`} style={{ width: `${item.percentage}%`, animationDelay: `${index * 75}ms` }} />)}
          </div> : <p className="mt-7 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No aircraft are available for this chart.</p>}
          <ul className="mt-5 space-y-2">
            {fleetSummary.distribution.map((item) => <li key={item.name} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm"><span className="flex items-center gap-2.5 text-brand-muted"><span className={`size-2.5 rounded-full ring-4 ring-white ${statusStyles[item.name].color}`} />{item.name} <span className="text-xs">({item.count} aircraft)</span></span><strong className={`tabular-nums ${statusStyles[item.name].text}`}>{item.percentage}%</strong></li>)}
          </ul>
        </section>

        <section className="hq-interactive-card hq-statistics-panel group rounded-2xl border border-brand-border bg-white p-5 sm:p-6" aria-labelledby="hours-title">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">Utilization</p><h3 id="hours-title" className="mt-1 text-lg font-semibold text-brand-primary-dark">Flight hours by aircraft</h3></div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-secondary/15 bg-brand-secondary-light/70 text-brand-secondary"><Clock3 className="size-5" aria-hidden="true" /></span>
          </div>
          {fleetSummary.aircraftHours.length > 0 ? <div className="hq-hours-chart mt-6 grid h-52 grid-cols-4 gap-2 rounded-xl border border-brand-border/70 bg-gradient-to-b from-slate-50/80 to-white px-3 py-3 sm:grid-cols-7 sm:gap-3 sm:px-4" role="img" aria-label="Recorded flight hours for aircraft in hours">
            {fleetSummary.aircraftHours.map(({ id, hours }, index) => <div key={id} className="hq-stats-bar-slot flex min-w-0 flex-col items-center" style={{ animationDelay: `${index * 45}ms` }}><span className="shrink-0 text-[10px] font-semibold tabular-nums text-brand-muted">{hours.toFixed(1)}</span><div className="hq-hours-plot relative mt-1 w-full min-h-0 flex-1"><div className="hq-chart-bar hq-stats-bar absolute inset-x-0 bottom-0 rounded-t-md" style={{ height: `${Math.min(100, hours / 130 * 100)}%`, animationDelay: `${index * 55}ms` }} /></div><span className="mt-1 shrink-0 pb-1 text-[9px] font-medium text-brand-muted">{id}</span></div>)}
          </div> : <p className="mt-6 rounded-xl bg-brand-background p-4 text-sm text-brand-muted">No flight-hour records are available.</p>}
          <p className="mt-4 flex items-center gap-2 text-xs text-brand-muted"><Activity className="size-3.5 text-brand-secondary" aria-hidden="true" />Flight-hour counters · hours</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <AnalyticsBarChart title="Aircraft by platform" description="Aircraft records per platform type." data={aircraftByPlatform} dataKey="count" unit="" color="#167c96"/>
        <AnalyticsBarChart title="Average readiness by squadron" description="Mean recorded aircraft readiness within each squadron." data={readinessBySquadron.map((row) => ({ name: row.name, readiness: row.averageReadiness }))} dataKey="readiness" unit="%" domain={[0, 100]} color="#168b72"/>
        <AnalyticsBarChart title="Next-service date windows" description={`Aircraft counts grouped by recorded next-service date relative to ${HEADQUARTERS_DEMO_AS_OF_DATE}.`} data={serviceWindowDistribution} dataKey="count" unit="" color="#d39024"/>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <DistributionPanel title="Fleet by platform" eyebrow="Composition" rows={fleetSummary.byModel}/>
        <DistributionPanel title="Aircraft by squadron" eyebrow="Unit distribution" rows={fleetSummary.bySquadron} valueLabel="aircraft"/>
        <DistributionPanel title="Aircraft by base" eyebrow="Location distribution" rows={fleetSummary.byBase}/>
      </div>

    </section>
  );
}
