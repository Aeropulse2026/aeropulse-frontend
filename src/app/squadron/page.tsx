"use client";
import Link from "next/link";
import { ArrowUpRight, Plane, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoSquadron } from "@/lib/demo-data/squadron/data";
import { getSquadronAircraft, getSquadronSummary } from "@/lib/demo-data/squadron/selectors";
import { SquadronReportsPanel } from "@/components/squadron-reports-panel";
import { SquadronMaintenancePanel } from "@/components/squadron-maintenance-panel";

const tiles = [
  { href: "/squadron/fleet", title: "Fleet Overview", text: "Aircraft readiness, serviceability, and linked maintenance", icon: Plane },
  { href: "/squadron/assets", title: "Assets", text: "Controlled inventory, spare parts, and stock", icon: Wrench },
];

export default function SquadronHomePage() {
  const aircraft = getSquadronAircraft();
  const summary = getSquadronSummary();
  const statusData = [
    { status: "Operational", aircraft: summary.operational },
    { status: "Maintenance", aircraft: summary.inMaintenance },
    { status: "Standby", aircraft: summary.unavailable },
  ];

  return <main className="min-h-screen bg-brand-background px-4 py-7 sm:px-7 lg:px-12"><div className="mx-auto max-w-[1440px]">
    <header className="mb-6"><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-secondary">Squadron operations</p><h1 className="mt-2 text-3xl font-semibold text-brand-primary-dark sm:text-4xl">{demoSquadron.name} readiness</h1><p className="mt-2 text-sm text-brand-muted">{demoSquadron.base} · {demoSquadron.role}</p></header>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Assigned aircraft", value: summary.totalAircraft }, { label: "Operational", value: summary.operational },
      { label: "In maintenance", value: summary.inMaintenance }, { label: "Unavailable / standby", value: summary.unavailable },
      { label: "Average readiness", value: summary.readiness === null ? "—" : `${summary.readiness}%` },
      { label: "Average flight hours", value: aircraft.length ? `${(aircraft.reduce((sum, item) => sum + item.hours, 0) / aircraft.length).toFixed(1)} h` : "—" },
      { label: "Open task records", value: summary.pendingTasks },
    ].map((item) => <article key={item.label} className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm"><p className="text-sm text-brand-muted">{item.label}</p><p className="mt-2 text-3xl font-semibold text-brand-primary-dark">{item.value}</p></article>)}</section>
    <section className="mt-5 grid gap-4 xl:grid-cols-2"><article className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"><h2 className="font-semibold text-brand-primary-dark">Assigned fleet status</h2><p className="mt-1 text-sm text-brand-muted">Aircraft counts by recorded status</p><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 640, height: 240 }}><BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/><XAxis dataKey="status" tickLine={false}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="aircraft" name="Aircraft" fill="#167c96" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></article><article className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"><h2 className="font-semibold text-brand-primary-dark">Aircraft readiness</h2><div className="mt-4 space-y-4">{aircraft.map((item) => <div key={item.id}><div className="flex justify-between gap-3 text-sm"><span className="font-medium text-brand-primary-dark">{item.id} · {item.name}</span><span className="tabular-nums text-brand-muted">{item.readiness}%</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-secondary" style={{ width: `${item.readiness}%` }}/></div></div>)}</div></article></section>
    <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_.85fr]"><article className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"><h2 className="font-semibold text-brand-primary-dark">Squadron workspaces</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{tiles.map(({ href, title, text, icon: Icon }) => <Link key={href} href={href} className="group rounded-xl bg-brand-background p-4 hover:bg-brand-secondary-light"><div className="flex justify-between"><Icon className="size-5 text-brand-secondary"/><ArrowUpRight className="size-4 text-brand-muted"/></div><p className="mt-4 font-semibold text-brand-primary-dark">{title}</p><p className="mt-1 text-xs text-brand-muted">{text}</p></Link>)}</div></article><aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold text-amber-950">Review attention items</h2><p className="mt-2 text-sm text-amber-900">{summary.reviewTasks} task records have an urgent or review priority, or incomplete evidence. Verify all details against authorized records.</p><a href="#maintenance" onClick={(event) => { event.preventDefault(); window.location.hash = "maintenance"; }} className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-brand-secondary">Review maintenance queue →</a></aside></section>
    <SquadronMaintenancePanel />
    <SquadronReportsPanel />
  </div></main>;
}
