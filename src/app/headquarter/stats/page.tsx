const readiness = [
  { name: "Operational", value: 67, color: "bg-emerald-500" },
  { name: "Standby", value: 21, color: "bg-amber-400" },
  { name: "Maintenance", value: 12, color: "bg-rose-500" },
]

const weeklyHours = [39, 52, 45, 68, 57, 74, 62]

export default function HeadquartersStatsPage() {
  return (
    <main className="min-h-screen bg-brand-background px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-brand-secondary">Headquarters / Analytics</p><h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">Fleet statistics</h1><p className="mt-2 text-sm text-brand-muted">Illustrative charts for the development preview.</p></header>
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm" aria-labelledby="readiness-title">
            <h2 id="readiness-title" className="text-lg font-semibold text-brand-primary-dark">Sample readiness distribution</h2>
            <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-100" role="img" aria-label="Demo distribution: 67 percent operational, 21 percent standby, 12 percent maintenance">
              {readiness.map((item) => <div key={item.name} className={item.color} style={{ width: `${item.value}%` }} />)}
            </div>
            <ul className="mt-5 space-y-3">{readiness.map((item) => <li key={item.name} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-brand-muted"><span className={`size-2.5 rounded-full ${item.color}`} />{item.name}</span><strong className="text-brand-primary-dark">{item.value}% · demo</strong></li>)}</ul>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm" aria-labelledby="hours-title">
            <h2 id="hours-title" className="text-lg font-semibold text-brand-primary-dark">Illustrative weekly flight hours</h2>
            <div className="mt-6 flex h-44 items-end gap-3" role="img" aria-label="Demo flight hours across seven days">
              {weeklyHours.map((hours, index) => <div key={`${index}-${hours}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] text-brand-muted">{hours}</span><div className="w-full rounded-t-md bg-brand-secondary" style={{ height: `${hours / 80 * 100}%` }} /><span className="text-[10px] text-brand-muted">D{index + 1}</span></div>)}
            </div>
          </section>
        </div>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">Every value on this page is synthetic and for interface preview only.</p>
      </div>
    </main>
  )
}
