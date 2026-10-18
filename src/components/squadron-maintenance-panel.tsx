"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { DEMO_AS_OF_DATE } from "@/lib/demo-data/squadron/data";
import { filterSquadronTasks, getSquadronAircraftById, getSquadronTasks, isTaskPastScheduledDate } from "@/lib/demo-data/squadron/selectors";

export function SquadronMaintenancePanel() {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All tasks");
  const allTasks = getSquadronTasks();
  const tasks = filterSquadronTasks(allTasks, query, status);
  const openCount = allTasks.filter((task) => task.status === "pending" || task.status === "in_progress").length;
  const reviewCount = allTasks.filter((task) => task.priority !== "routine" || task.evidence === "incomplete").length;

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash !== "#maintenance" || !detailsRef.current) return;
      detailsRef.current.open = true;
      detailsRef.current.scrollIntoView({ block: "start" });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return <details ref={detailsRef} id="maintenance" open className="mt-5 scroll-mt-5 rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
    <summary className="cursor-pointer list-none font-semibold text-brand-primary-dark focus-visible:outline-2 focus-visible:outline-brand-secondary">Maintenance review queue <span className="ml-2 text-xs font-normal text-brand-muted">{openCount} open · toggle details</span></summary>
    <div className="pt-4">
      <p className="text-sm text-brand-muted">Date flags use reference date {DEMO_AS_OF_DATE}. Priorities require authorized review.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><article className="rounded-xl border border-brand-border bg-brand-background p-4"><p className="text-sm text-brand-muted">Open task records</p><p className="mt-1 text-2xl font-semibold text-brand-primary-dark">{openCount}</p></article><article className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm text-amber-900">Needs review or evidence</p><p className="mt-1 text-2xl font-semibold text-amber-950">{reviewCount}</p></article></div>
      <section className="mt-4 rounded-xl border border-brand-secondary/20 bg-brand-background p-4"><h3 className="font-semibold text-brand-primary-dark">Actions unavailable</h3><p className="mt-1 text-sm text-brand-muted">This view does not approve tasks, create work orders, reserve parts, or record maintenance completion.</p></section>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row"><label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-brand-border bg-white px-3"><Search aria-hidden="true" className="size-4 text-brand-muted"/><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search maintenance tasks" placeholder="Search task, aircraft, component…" className="w-full py-2 text-sm outline-none"/></label><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter maintenance task status" className="min-h-11 rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"><option>All tasks</option><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select></div>
      <div className="mt-4 space-y-3">{tasks.map((task) => { const aircraft = getSquadronAircraftById(task.aircraftId); const pastScheduledDate = isTaskPastScheduledDate(task); return <article key={task.id} className="rounded-xl border border-brand-border p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><p className="font-mono text-xs text-brand-muted">{task.id} · {task.aircraftId} · {task.status.replace("_", " ")}</p><h4 className="mt-1 font-semibold text-brand-primary-dark">{task.component}</h4><p className="mt-1 text-sm text-brand-muted">{task.action}</p>{aircraft && <Link href={`/squadron/fleet?aircraft=${encodeURIComponent(aircraft.id)}`} className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary">{aircraft.name} · {aircraft.status} →</Link>}</div><div className="shrink-0 text-sm sm:text-right"><p className={`font-semibold ${task.priority === "urgent" ? "text-rose-700" : task.priority === "review" ? "text-amber-800" : "text-brand-secondary"}`}>{task.priority} priority</p><p className={`mt-1 ${pastScheduledDate ? "font-semibold text-rose-700" : "text-slate-700"}`}>{task.status === "completed" ? `Completed: ${task.completedAt ?? "date not recorded"}` : `Scheduled: ${task.scheduledFor}${pastScheduledDate ? " · Past scheduled date" : ""}`}</p><p className={`mt-1 text-xs ${task.evidence === "incomplete" ? "text-amber-800" : "text-brand-muted"}`}>Evidence: {task.evidence}</p></div></div></article>; })}{!tasks.length && <div className="rounded-xl border border-dashed border-brand-border p-8 text-center"><p className="text-sm text-brand-muted">No maintenance tasks match your search and status filter.</p><button type="button" onClick={() => { setQuery(""); setStatus("All tasks"); }} className="mt-3 min-h-10 rounded-lg px-3 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary">Reset filters</button></div>}</div>
    </div>
  </details>;
}
