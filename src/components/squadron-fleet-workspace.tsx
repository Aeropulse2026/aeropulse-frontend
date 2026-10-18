"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { FleetBrowser } from "@/components/fleet-browser";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DEMO_AS_OF_DATE } from "@/lib/demo-data/squadron/data";
import { getSquadronAircraft, getSquadronAircraftById, getSquadronTasks } from "@/lib/demo-data/squadron/selectors";

export function SquadronFleetWorkspace() {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get("aircraft"));
  const aircraft = getSquadronAircraft();
  const selected = selectedId ? getSquadronAircraftById(selectedId) : undefined;
  const tasks = selected ? getSquadronTasks().filter((task) => task.aircraftId === selected.id) : [];
  const operationalCount = aircraft.filter((record) => record.status === "Operational").length;
  const averageReadiness = aircraft.length ? Math.round(aircraft.reduce((sum, record) => sum + record.readiness, 0) / aircraft.length) : null;
  const averageHours = aircraft.length ? aircraft.reduce((sum, record) => sum + record.hours, 0) / aircraft.length : null;
  const overdue = aircraft.filter((record) => record.nextMaintenance < DEMO_AS_OF_DATE).length;
  const dueSoon = aircraft.filter((record) => {
    const days = (Date.parse(record.nextMaintenance) - Date.parse(DEMO_AS_OF_DATE)) / 86_400_000;
    return days >= 0 && days <= 14;
  }).length;

  return <>
    <FleetBrowser aircraft={aircraft} title="Assigned fleet" eyebrow="Squadron fleet" description="Search the assigned fleet, review serviceability and readiness, and open an aircraft record without leaving this workspace." detailPrefix="/squadron/fleet" appearance="squadron" onAircraftSelect={setSelectedId}/>
    <section className="mx-auto mt-7 max-w-[1440px] px-4 pb-7 sm:px-6 lg:px-12" aria-labelledby="fleet-readiness-heading">
      <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-secondary">Fleet summary</p><h2 id="fleet-readiness-heading" className="mt-1 text-xl font-semibold text-brand-primary-dark">Readiness &amp; service schedule</h2></div><p className="text-xs text-brand-muted">Reference date: {DEMO_AS_OF_DATE}</p></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[
          ["Assigned", String(aircraft.length)], ["Operational share", aircraft.length ? `${Math.round(operationalCount / aircraft.length * 100)}%` : "—"], ["Average readiness", averageReadiness === null ? "—" : `${averageReadiness}%`], ["Average flight hours", averageHours === null ? "—" : `${averageHours.toFixed(1)} h`], ["Service due ≤14 days", String(dueSoon)],
        ].map(([label, value]) => <article key={label} className="rounded-xl border border-brand-border bg-brand-background p-4"><p className="text-sm text-brand-muted">{label}</p><p className="mt-1 text-2xl font-semibold tabular-nums text-brand-primary-dark">{value}</p></article>)}</div>
        <details className="mt-5 rounded-xl border border-brand-border p-4"><summary className="cursor-pointer font-semibold text-brand-primary-dark focus-visible:outline-2 focus-visible:outline-brand-secondary">Service schedule and aircraft records <span className="ml-2 text-xs font-normal text-brand-muted">{overdue} past date · {dueSoon} due within 14 days</span></summary>
          <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b border-brand-border text-xs text-brand-muted"><th scope="col" className="py-2 pr-3">Aircraft</th><th scope="col" className="py-2 pr-3">Type</th><th scope="col" className="py-2 pr-3">Status</th><th scope="col" className="py-2 pr-3">Readiness</th><th scope="col" className="py-2 pr-3">Flight hours</th><th scope="col" className="py-2 pr-3">Next service</th><th scope="col" className="py-2">Details</th></tr></thead><tbody className="divide-y divide-brand-border">{aircraft.map((record) => <tr key={record.id}><th scope="row" className="py-3 pr-3 font-medium text-brand-primary-dark">{record.id} · {record.name}</th><td className="py-3 pr-3">{record.model}</td><td className="py-3 pr-3">{record.status}</td><td className="py-3 pr-3 tabular-nums">{record.readiness}%</td><td className="py-3 pr-3 tabular-nums">{record.hours.toFixed(1)} h</td><td className="py-3 pr-3">{record.nextMaintenance}{record.nextMaintenance < DEMO_AS_OF_DATE ? " · Past date" : ""}</td><td className="py-3"><button type="button" onClick={() => setSelectedId(record.id)} className="min-h-10 rounded-lg px-2 font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-brand-secondary">Open</button></td></tr>)}</tbody></table></div>
        </details>
        <p className="mt-3 text-xs leading-5 text-brand-muted">Operational share is calculated from aircraft with Operational status. Service dates do not represent maintenance approvals or forecasts.</p>
      </div>
    </section>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
      {selected && <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-2xl border border-brand-border bg-white p-6 sm:p-8">
        <DialogHeader><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-secondary">Fleet record · {selected.id}</p><DialogTitle className="text-2xl font-semibold text-brand-primary-dark">{selected.name}</DialogTitle><DialogDescription>{selected.model} · {selected.role} · {selected.squadron}</DialogDescription></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-brand-background p-4"><p className="text-xs text-brand-muted">Recorded status</p><p className="mt-1 font-semibold text-brand-primary-dark">{selected.status}</p></div><div className="rounded-xl bg-brand-background p-4"><p className="text-xs text-brand-muted">Readiness indicator</p><p className="mt-1 font-semibold text-brand-primary-dark">{selected.readiness}%</p></div><div className="rounded-xl bg-brand-background p-4"><p className="text-xs text-brand-muted">Flight-hour counter</p><p className="mt-1 font-semibold text-brand-primary-dark">{selected.hours.toFixed(1)} h</p></div><div className="rounded-xl bg-brand-background p-4"><p className="text-xs text-brand-muted">Hours since maintenance</p><p className="mt-1 font-semibold text-brand-primary-dark">{selected.hoursSinceMaintenance.toFixed(1)} h</p></div></div>
        <div className="rounded-xl border border-brand-border p-4"><h3 className="font-semibold text-brand-primary-dark">Service record</h3><p className="mt-2 text-sm text-brand-muted">Last recorded service: {selected.lastMaintenance ?? "Not available"}</p><p className="mt-1 text-sm text-brand-muted">Next scheduled service: {selected.nextMaintenance ?? "Not available"}</p><p className="mt-2 text-sm leading-6 text-slate-700">{selected.description}</p></div>
        <section><h3 className="font-semibold text-brand-primary-dark">Linked maintenance records</h3>{tasks.length ? <ul className="mt-2 space-y-2">{tasks.map((task) => <li key={task.id} className="rounded-xl border border-brand-border p-3"><div className="flex flex-wrap justify-between gap-2"><span className="font-medium text-brand-primary-dark">{task.component}</span><span className="text-sm text-brand-muted">{task.status.replace("_", " ")}</span></div><p className="mt-1 text-sm text-brand-muted">{task.status === "completed" ? `Completed ${task.completedAt ?? "date not recorded"}` : `Scheduled ${task.scheduledFor}`} · {task.priority} priority · evidence {task.evidence}</p></li>)}</ul> : <p className="mt-2 text-sm text-brand-muted">No linked maintenance records.</p>}</section>
        <p className="text-xs text-brand-muted">Reference date {DEMO_AS_OF_DATE}.</p>
      </DialogContent>}
    </Dialog>
  </>;
}
