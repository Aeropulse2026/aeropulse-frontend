"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Radio, Sparkles } from "lucide-react";
import { demoSquadrons, getSquadronRecommendationCandidates } from "@/lib/demo-data/squadrons";

export function HeadquartersSquadronManagement() {
  const [role, setRole] = useState("Air defence");
  const [base, setBase] = useState("Any base");
  const [result, setResult] = useState(false);
  const candidates = useMemo(() => getSquadronRecommendationCandidates(demoSquadrons, role, base), [role, base]);

  return (
    <section id="squadrons" className="space-y-5" aria-labelledby="squadrons-heading">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.24em] text-brand-secondary">Command units</p>
        <h2 id="squadrons-heading" className="text-2xl font-semibold tracking-tight text-brand-primary-dark">Squadron management</h2>
        <p className="mt-2 text-sm text-brand-muted">Review unit strength, readiness, role, base, and maintenance context.</p>
      </div>

      <section className="hq-interactive-card relative overflow-hidden rounded-2xl border border-brand-secondary/25 bg-gradient-to-br from-white via-white to-cyan-50/70 p-5 shadow-sm sm:p-6" aria-labelledby="squadron-recommendation-title">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-14 size-48 rounded-full border border-brand-secondary/10" />
        <div className="flex items-start gap-3">
          <span className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-secondary-light text-brand-secondary shadow-sm ring-1 ring-brand-secondary/10"><Sparkles className="size-5" /></span>
          <div className="relative min-w-0 flex-1">
            <h3 id="squadron-recommendation-title" className="text-base font-semibold text-brand-primary-dark">Squadron recommendation</h3>
            <p className="mt-1 text-sm text-brand-muted">Rule-based ranking only · not an AI service or operational tasking recommendation.</p>
            <div className="mt-4 grid gap-3 rounded-xl border border-white/80 bg-white/75 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-3.5">
              <label className="text-xs font-medium text-brand-muted">Mission role<select value={role} onChange={(event) => { setRole(event.target.value); setResult(false); }} className="mt-1.5 block min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm">{[...new Set(demoSquadrons.map((squadron) => squadron.role))].map((value) => <option key={value}>{value}</option>)}</select></label>
              <label className="text-xs font-medium text-brand-muted">Preferred base<select value={base} onChange={(event) => { setBase(event.target.value); setResult(false); }} className="mt-1.5 block min-h-11 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"><option>Any base</option>{[...new Set(demoSquadrons.map((squadron) => squadron.base))].map((value) => <option key={value}>{value}</option>)}</select></label>
              <button type="button" onClick={() => setResult(true)} className="hq-action-button inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-primary-dark px-4 py-2.5 text-sm font-semibold text-white"><Sparkles className="size-4" aria-hidden="true" />Find best match</button>
            </div>
            {result && <div className="mt-4 rounded-xl border border-brand-secondary/20 bg-white/90 p-4 shadow-sm" aria-live="polite">{candidates[0] ? <><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-brand-primary-dark">Suggested alternative: {candidates[0].name}</strong><span className="rounded-full bg-brand-secondary-light px-3 py-1 text-xs font-semibold text-brand-secondary">Rule score {candidates[0].score}/100</span></div><p className="mt-2 text-sm text-brand-muted">{candidates[0].base} · {candidates[0].readiness}% readiness · {candidates[0].operational}/{candidates[0].assigned} operational · {candidates[0].maintenance} in maintenance</p><p className="mt-1 text-xs text-brand-muted">Score weights: readiness 45%, operational rate 25%, maintenance availability 20%, location 10%.</p></> : <p className="text-sm text-brand-muted">No matching squadron has available aircraft for this role and base filter.</p>}</div>}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Squadron profiles">
        {demoSquadrons.map((squadron) => {
          const readinessTone = squadron.readiness >= 90
            ? { bar: "bg-emerald-500", text: "text-emerald-700", surface: "from-emerald-50/80" }
            : squadron.readiness >= 80
              ? { bar: "bg-cyan-600", text: "text-cyan-800", surface: "from-cyan-50/80" }
              : { bar: "bg-amber-500", text: "text-amber-800", surface: "from-amber-50/80" };
          const statusTone = squadron.status === "Operational"
            ? "bg-emerald-50 text-emerald-800 ring-emerald-700/10"
            : squadron.status === "Standby"
              ? "bg-slate-100 text-slate-700 ring-slate-500/10"
              : "bg-amber-50 text-amber-900 ring-amber-700/10";

          return <article key={squadron.id} className={`hq-interactive-card group relative overflow-hidden rounded-2xl border border-brand-border bg-gradient-to-br ${readinessTone.surface} via-white to-white shadow-sm`}>
          <div aria-hidden="true" className={`pointer-events-none absolute -right-12 -top-14 size-44 rounded-full border ${readinessTone.text === "text-emerald-700" ? "border-emerald-700/10" : readinessTone.text === "text-cyan-800" ? "border-cyan-700/10" : "border-amber-700/10"}`} />
          <div className="relative p-5">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-xs font-bold tracking-widest text-brand-muted">{squadron.id} · {squadron.base}</p><h3 className="mt-2 text-lg font-semibold leading-tight text-brand-primary-dark">{squadron.name}</h3><p className="mt-1.5 text-sm text-brand-muted">{squadron.role} · {squadron.region}</p></div><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/90 text-brand-secondary shadow-sm ring-1 ring-brand-border/70"><Radio className="size-4" aria-hidden="true" /></span></div>
          <div className="mt-5" role="img" aria-label={`Readiness ${squadron.readiness} percent`}><div className="flex items-center justify-between gap-3 text-xs"><span className="font-medium text-brand-muted">Readiness</span><span className={`font-bold tabular-nums ${readinessTone.text}`}>{squadron.readiness}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80"><div className={`h-full rounded-full ${readinessTone.bar} transition-[width] duration-500`} style={{ width: `${squadron.readiness}%` }} /></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl border border-white/80 bg-white/75 p-3 shadow-sm"><span className="block text-xs text-brand-muted">Assigned / strength</span><b className="mt-1 block tabular-nums text-brand-primary-dark">{squadron.assigned} aircraft</b><span className="mt-1 block text-xs text-brand-muted">{squadron.strength} personnel</span></div><div className="rounded-xl border border-white/80 bg-white/75 p-3 shadow-sm"><span className="block text-xs text-brand-muted">Operational</span><b className="mt-1 block tabular-nums text-brand-primary-dark">{squadron.operational} aircraft</b><span className="mt-1 block text-xs text-brand-muted">of {squadron.assigned} assigned</span></div></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-border/80 pt-3 text-xs"><span className={`rounded-full px-2.5 py-1 font-semibold ring-1 ring-inset ${statusTone}`}>{squadron.status}</span><span className={`inline-flex items-center gap-1.5 font-medium ${squadron.maintenance ? "text-amber-800" : "text-brand-muted"}`}><span aria-hidden="true" className={`size-1.5 rounded-full ${squadron.maintenance ? "bg-amber-500" : "bg-slate-400"}`} />{squadron.maintenance} in maintenance</span><ArrowUpRight className="size-4 text-brand-muted/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></div>
          </div>
        </article>;
        })}
      </div>
    </section>
  );
}
