import { Activity, BarChart3, Clock3 } from "lucide-react";

const readiness = [
  { name: "Operational", value: 67, color: "bg-emerald-500", text: "text-emerald-700" },
  { name: "Standby", value: 21, color: "bg-amber-400", text: "text-amber-700" },
  { name: "Maintenance", value: 12, color: "bg-amber-600", text: "text-amber-800" },
]

const weeklyHours = [39, 52, 45, 68, 57, 74, 62]

export default function HeadquartersStatsPage() {
  return (
    <main className="hq-statistics-page min-h-screen bg-brand-background px-5 py-8 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="hq-stats-header mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-secondary">Headquarters / Analytics</p>
            <span className="rounded-full border border-brand-secondary/20 bg-brand-secondary-light/70 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-brand-secondary">DEMO ANALYTICS</span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">Fleet statistics</h1>
          <p className="mt-2 text-sm text-brand-muted">Illustrative charts for the development preview.</p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="hq-interactive-card hq-statistics-panel group rounded-2xl border border-brand-border bg-white p-6 shadow-sm" aria-labelledby="readiness-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">Fleet status</p>
                <h2 id="readiness-title" className="mt-1 text-lg font-semibold text-brand-primary-dark">Sample readiness distribution</h2>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-secondary/15 bg-brand-secondary-light/70 text-brand-secondary transition-transform duration-200 group-hover:scale-105"><BarChart3 className="size-5" aria-hidden="true" /></span>
            </div>
            <div className="hq-readiness-track mt-7 flex h-5 overflow-hidden rounded-full bg-slate-100 p-0.5" role="img" aria-label="Demo distribution: 67 percent operational, 21 percent standby, 12 percent maintenance">
              {readiness.map((item, index) => <div key={item.name} className={`hq-chart-segment ${item.color} ${index === 0 ? "rounded-l-full" : ""} ${index === readiness.length - 1 ? "rounded-r-full" : ""}`} style={{ width: `${item.value}%`, animationDelay: `${index * 75}ms` }} />)}
            </div>
            <ul className="mt-6 space-y-3.5">
              {readiness.map((item, index) => <li key={item.name} className="hq-stats-row flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm" style={{ animationDelay: `${index * 60}ms` }}><span className="flex items-center gap-2.5 text-brand-muted"><span className={`size-2.5 rounded-full ring-4 ring-white ${item.color}`} />{item.name}</span><strong className={`tabular-nums ${item.text}`}>{item.value}% <span className="text-xs font-medium text-brand-muted">· demo</span></strong></li>)}
            </ul>
          </section>

          <section className="hq-interactive-card hq-statistics-panel group rounded-2xl border border-brand-border bg-white p-6 shadow-sm" aria-labelledby="hours-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">Utilization</p>
                <h2 id="hours-title" className="mt-1 text-lg font-semibold text-brand-primary-dark">Illustrative weekly flight hours</h2>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-secondary/15 bg-brand-secondary-light/70 text-brand-secondary transition-transform duration-200 group-hover:scale-105"><Clock3 className="size-5" aria-hidden="true" /></span>
            </div>
            <div className="hq-hours-chart mt-6 grid h-52 grid-cols-7 gap-2 rounded-xl border border-brand-border/70 bg-gradient-to-b from-slate-50/80 to-white px-3 py-3 sm:gap-3 sm:px-4" role="img" aria-label="Demo flight hours across seven days">
              {weeklyHours.map((hours, index) => <div key={`${index}-${hours}`} className="hq-stats-bar-slot flex min-w-0 flex-col items-center" style={{ animationDelay: `${index * 45}ms` }}><span className="shrink-0 text-[10px] font-semibold tabular-nums text-brand-muted">{hours}</span><div className="hq-hours-plot relative mt-1 w-full min-h-0 flex-1"><div className="hq-chart-bar hq-stats-bar absolute inset-x-0 bottom-0 rounded-t-md" style={{ height: `${hours / 80 * 100}%`, animationDelay: `${index * 55}ms` }} /></div><span className="mt-1 shrink-0 pb-1 text-[10px] font-medium text-brand-muted">D{index + 1}</span></div>)}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-brand-muted"><Activity className="size-3.5 text-brand-secondary" aria-hidden="true" />Sample hours · illustrative demo values</p>
          </section>
        </div>
      </div>
    </main>
  )
}
