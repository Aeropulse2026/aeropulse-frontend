"use client";

import { useEffect, useRef } from "react";
import { getSquadronAircraft, getSquadronSummary, getSquadronTasks, getSquadronInventory, isLowStock } from "@/lib/demo-data/squadron/selectors";

export function SquadronReportsPanel() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summary = getSquadronSummary();
  const aircraft = getSquadronAircraft();
  const tasks = getSquadronTasks();
  const lowStock = getSquadronInventory().filter(isLowStock).length;

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash !== "#reports" || !detailsRef.current) return;
      detailsRef.current.open = true;
      detailsRef.current.scrollIntoView({ block: "start" });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <details ref={detailsRef} id="reports" open className="mt-5 scroll-mt-5 rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none font-semibold text-brand-primary-dark focus-visible:outline-2 focus-visible:outline-brand-secondary">Readiness & utilization snapshot <span className="ml-2 text-xs font-normal text-brand-muted">Toggle report details</span></summary>
      <div className="pt-4">
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
          ["Assigned aircraft", String(summary.totalAircraft)],
          ["Average readiness", summary.readiness === null ? "Unavailable" : `${summary.readiness}%`],
          ["Open maintenance tasks", String(summary.pendingTasks)],
          ["Low stock records", String(lowStock)],
        ].map(([label, value]) => <article key={label} className="rounded-xl border border-brand-border bg-brand-background p-4"><p className="text-sm text-brand-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-brand-primary-dark">{value}</p></article>)}</div>

        <section className="mt-4 rounded-xl border border-brand-border p-4" aria-labelledby="report-readiness-heading">
          <h3 id="report-readiness-heading" className="font-semibold text-brand-primary-dark">Aircraft readiness records</h3>
          <div className="mt-4 space-y-3">{aircraft.map((item) => <div key={item.id}><div className="flex flex-wrap justify-between gap-2 text-sm"><span>{item.id} · {item.name} · {item.status}</span><span className="tabular-nums">{item.readiness}%</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-brand-secondary" style={{ width: `${item.readiness}%` }} /></div></div>)}</div>
        </section>

        <section className="mt-4 rounded-xl border border-brand-border p-4" aria-labelledby="report-maintenance-heading">
          <h3 id="report-maintenance-heading" className="font-semibold text-brand-primary-dark">Maintenance task records</h3>
          <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b border-brand-border text-xs text-brand-muted"><th scope="col" className="py-2 pr-3">Task</th><th scope="col" className="py-2 pr-3">Aircraft / component</th><th scope="col" className="py-2 pr-3">Status</th><th scope="col" className="py-2">Date</th></tr></thead><tbody className="divide-y divide-brand-border">{tasks.map((task) => <tr key={task.id}><th scope="row" className="py-3 pr-3 font-medium text-brand-primary-dark">{task.id}</th><td className="py-3 pr-3">{task.aircraftId} · {task.component}</td><td className="py-3 pr-3 text-brand-muted">{task.status.replace("_", " ")}</td><td className="py-3 text-brand-muted">{task.status === "completed" ? task.completedAt ?? "Date not recorded" : task.scheduledFor}</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </details>
  );
}
