import Link from "next/link";
import {
  Activity,
  FileBarChart,
  Plane,
  Radio,
  Settings,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const quickAccess = [
  { label: "Fleet overview", description: "View aircraft readiness", href: "/headquarter/fleet", icon: Plane, className: "bg-brand-primary-dark text-white" },
  { label: "Mission control", description: "Track active operations", href: "#missions", icon: Radio, className: "bg-brand-secondary-light text-brand-primary-dark" },
  { label: "Personnel", description: "Manage service records", href: "#personnel", icon: Users, className: "bg-amber-50 text-amber-950" },
  { label: "Reports", description: "Review command data", href: "#reports", icon: FileBarChart, className: "bg-slate-100 text-slate-800" },
];

const quickData = [
  { label: "Active aircraft", value: "24", change: "+3 this week", icon: Plane },
  { label: "Open missions", value: "08", change: "2 need attention", icon: Activity },
  { label: "Personnel online", value: "186", change: "92% availability", icon: Users },
];

function IndiaMap() {
  return (
    <svg viewBox="0 0 460 560" role="img" aria-label="Map of India" className="h-full w-full drop-shadow-2xl">
      <defs>
        <linearGradient id="india-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe4e1" />
          <stop offset="0.5" stopColor="#fff7ed" />
          <stop offset="1" stopColor="#f9a8a8" />
        </linearGradient>
      </defs>
      <path d="M183 28 224 18l22 31 36 8 16 30 41 15 5 36 34 24-18 28 21 34-34 16-3 37-33 16-9 42-30 18-17 42-22 9-15 44-28 20-23 49-25-11-14-38-22-20-8-48-28-33 8-29-24-30 13-29-8-34 26-29-4-28 22-29 11-42 27-10 19-26 33 1 5-31 25-22 12-35 25-1Z" fill="url(#india-fill)" stroke="#fff1f2" strokeWidth="7" strokeLinejoin="round" />
      <path d="M207 133c45 28 78 32 131 24M143 263c49-24 87-22 137 3 34 17 67 16 104-3M163 349c42-17 75-12 113 9 32 18 55 19 84 7" fill="none" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <circle cx="223" cy="232" r="8" fill="#b91c1c" stroke="#fff" strokeWidth="4" /><circle cx="285" cy="315" r="8" fill="#b91c1c" stroke="#fff" strokeWidth="4" /><circle cx="188" cy="395" r="8" fill="#b91c1c" stroke="#fff" strokeWidth="4" /><circle cx="321" cy="181" r="8" fill="#b91c1c" stroke="#fff" strokeWidth="4" />
      <path d="M221 232 280 179M285 315 350 272M188 395 119 431M321 181 382 129" stroke="#fff" strokeWidth="2" strokeDasharray="5 8" opacity="0.75" />
    </svg>
  );
}

export default function HeadquarterHomePage() {
  return (
    <main className="min-h-screen bg-brand-background text-slate-950">
      <div className="mx-auto max-w-[1440px] px-6 py-8 lg:px-12 lg:py-10">
        <header className="mb-8 flex items-end justify-between gap-5">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-brand-secondary">Headquarters dashboard</p><h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">Good morning, Commander.</h1><p className="mt-2 text-sm text-brand-muted">Here is the current operational picture across the network.</p></div>
          <div className="hidden items-center gap-2 text-xs text-brand-muted sm:flex"><span className="size-2 rounded-full bg-brand-success" />Updated just now</div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.8fr)]">
          <section className="relative min-h-[560px] overflow-hidden rounded-2xl bg-[#651b1f] p-7 text-white shadow-xl shadow-red-950/10 sm:p-10" aria-labelledby="operational-map-title">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_42%),linear-gradient(145deg,#7f1d1d,#450a0a)]" />
            <div className="relative z-10 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-red-100/75">Live operational map</p><h2 id="operational-map-title" className="mt-2 text-2xl font-semibold">India command network</h2></div><Badge className="border-white/20 bg-white/12 text-white hover:bg-white/20"><span className="mr-1.5 size-1.5 rounded-full bg-brand-success" />Live</Badge></div>
            <div className="relative mx-auto mt-2 h-[410px] max-w-[500px]"><IndiaMap /></div>
            <div className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-red-100/80"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-white" />Command hubs</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-red-300" />Active routes</span><span className="ml-auto flex items-center gap-2"><Radio className="size-3.5" />Network connected</span></div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">Shortcuts</p><h2 className="mt-1 text-xl font-semibold text-brand-primary-dark">Quick access</h2></div><Settings className="size-5 text-brand-muted" /></div><div className="grid grid-cols-2 gap-3">{quickAccess.map((item) => { const Icon = item.icon; return <Link key={item.label} href={item.href} className={`group rounded-xl p-4 transition-transform hover:-translate-y-0.5 ${item.className}`}><Icon className="size-5 opacity-80" /><p className="mt-5 text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs opacity-70">{item.description}</p></Link>; })}</div></section>
            <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-secondary">At a glance</p><h2 className="mt-1 text-xl font-semibold text-brand-primary-dark">Quick data</h2></div><div className="space-y-4">{quickData.map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-center gap-4 rounded-xl bg-brand-background p-3.5"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-secondary shadow-sm"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-xs text-brand-muted">{item.label}</p><p className="mt-0.5 text-2xl font-semibold leading-none text-brand-primary-dark">{item.value}</p></div><span className="text-right text-[11px] font-medium text-brand-secondary">{item.change}</span></div>; })}</div></section>
          </aside>
        </div>
      </div>
    </main>
  );
}
