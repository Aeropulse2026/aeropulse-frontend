"use client";

import { useMemo, useState } from "react";
import { Radio, Sparkles } from "lucide-react";
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

      <section className="hq-interactive-card rounded-2xl border border-brand-secondary/20 bg-white p-5 shadow-sm" aria-labelledby="squadron-recommendation-title">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-light text-brand-secondary"><Sparkles className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <h3 id="squadron-recommendation-title" className="font-semibold text-brand-primary-dark">Squadron recommendation</h3>
            <p className="mt-1 text-sm text-brand-muted">Rule-based ranking only · not an AI service or operational tasking recommendation.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="text-xs text-brand-muted">Mission role<select value={role} onChange={(event) => { setRole(event.target.value); setResult(false); }} className="mt-1 block min-h-10 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-slate-800">{[...new Set(demoSquadrons.map((squadron) => squadron.role))].map((value) => <option key={value}>{value}</option>)}</select></label>
              <label className="text-xs text-brand-muted">Preferred base<select value={base} onChange={(event) => { setBase(event.target.value); setResult(false); }} className="mt-1 block min-h-10 w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-slate-800"><option>Any base</option>{[...new Set(demoSquadrons.map((squadron) => squadron.base))].map((value) => <option key={value}>{value}</option>)}</select></label>
              <button type="button" onClick={() => setResult(true)} className="hq-action-button min-h-10 rounded-lg bg-brand-primary-dark px-4 py-2.5 text-sm font-semibold text-white">Find best match</button>
            </div>
            {result && <div className="mt-4 rounded-xl border border-brand-secondary/20 bg-brand-background p-4" aria-live="polite">{candidates[0] ? <><strong className="text-brand-primary-dark">Suggested alternative: {candidates[0].name}</strong><p className="mt-1 text-sm text-brand-muted">{candidates[0].base} · {candidates[0].readiness}% readiness · {candidates[0].operational}/{candidates[0].assigned} operational · {candidates[0].maintenance} in maintenance · rule score {candidates[0].score}/100.</p><p className="mt-1 text-xs text-brand-muted">Score weights: readiness 45%, operational rate 25%, maintenance availability 20%, location 10%.</p></> : <p>No matching squadron has available aircraft for this role and base filter.</p>}</div>}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Squadron profiles">
        {demoSquadrons.map((squadron) => <article key={squadron.id} className="hq-interactive-card rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold tracking-widest text-brand-muted">{squadron.id} · {squadron.base}</p><h3 className="mt-2 text-lg font-semibold text-brand-primary-dark">{squadron.name}</h3><p className="mt-1 text-sm text-brand-muted">{squadron.role} · {squadron.region}</p></div><Radio className="size-5 text-brand-secondary" aria-hidden="true" /></div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${squadron.readiness}%` }} /></div><p className="mt-1 text-right text-xs font-semibold text-emerald-700">{squadron.readiness}% readiness</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div className="rounded-lg bg-brand-background p-3"><span className="block text-xs text-brand-muted">Assigned / strength</span><b>{squadron.assigned} aircraft</b><span className="mt-1 block text-xs text-brand-muted">Strength: {squadron.strength} personnel</span></div><div className="rounded-lg bg-brand-background p-3"><span className="block text-xs text-brand-muted">Operational</span><b>{squadron.operational} aircraft</b></div></div>
          <div className="mt-3 flex justify-between gap-3 border-t border-brand-border pt-3 text-xs"><span className="text-brand-muted">{squadron.status}</span><span className="font-medium text-amber-800">{squadron.maintenance} in maintenance</span></div>
        </article>)}
      </div>
    </section>
  );
}
