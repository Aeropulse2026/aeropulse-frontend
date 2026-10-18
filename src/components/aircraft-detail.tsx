"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Plane } from "lucide-react";
import { demoAircraft } from "@/lib/demo-data/aircraft";
import {
  getSquadronAircraftById,
  getSquadronTasks,
} from "@/lib/demo-data/squadron/selectors";

export function AircraftDetail({ backHref }: { backHref: string }) {
  const params = useParams<{ id: string }>();
  const isSquadron = backHref.startsWith("/squadron");
  const aircraft = isSquadron
    ? getSquadronAircraftById(params.id)
    : demoAircraft.find((item) => item.id === params.id);

  if (!aircraft) {
    return (
      <main className="min-h-screen bg-brand-background p-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          <h1 className="text-2xl font-semibold">Aircraft record not found</h1>
          <Link className="mt-4 inline-block text-brand-secondary" href={backHref}>
            Return to fleet
          </Link>
        </div>
      </main>
    );
  }

  const tasks = isSquadron
    ? getSquadronTasks().filter((task) => task.aircraftId === aircraft.id)
    : [];
  const details = [
    ["Squadron", aircraft.squadron],
    ["Base", aircraft.base],
    ["Status", aircraft.status],
    ["Readiness", `${aircraft.readiness}%`],
    ["Flight hours", `${aircraft.hours} h`],
    ["Hours since maintenance", `${aircraft.hoursSinceMaintenance} h`],
    ["Last scheduled maintenance", aircraft.lastMaintenance],
    ["Next scheduled maintenance", aircraft.nextMaintenance],
  ];

  return (
    <main className="min-h-screen bg-brand-background px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={backHref}
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
        >
          <ArrowLeft className="size-4" />
          Back to fleet
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-brand-border bg-white shadow-sm">
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark p-8 text-white sm:p-12">
            <p className="font-mono text-sm tracking-widest text-white/70">{aircraft.id}</p>
            <h1 className="mt-3 text-4xl font-bold">{aircraft.name}</h1>
            <p className="mt-2 text-white/75">{aircraft.model} · {aircraft.role}</p>
            {isSquadron && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
                {aircraft.description}
              </p>
            )}
            <Plane className="mt-8 size-24 text-cyan-200" strokeWidth={1} />
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-brand-background p-4">
                <p className="text-xs text-brand-muted">{label}</p>
                <p className="mt-1 font-semibold text-brand-primary-dark">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {isSquadron && (
          <>
            <section className="mt-5 rounded-2xl border border-brand-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-brand-primary-dark">Linked maintenance tasks</h2>
                <Link
                  href="/squadron#maintenance"
                  className="inline-flex min-h-10 items-center text-sm font-semibold text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
                >
                  Open queue →
                </Link>
              </div>
              {tasks.length ? (
                <ul className="mt-3 divide-y divide-brand-border">
                  {tasks.map((task) => (
                    <li key={task.id} className="py-3">
                      <p className="font-medium text-brand-primary-dark">
                        {task.component} · {task.status.replace("_", " ")}
                      </p>
                      <p className="mt-1 text-sm text-brand-muted">
                        {task.id} · {task.status === "completed"
                          ? `Completed ${task.completedAt ?? "date not recorded"}`
                          : `Scheduled ${task.scheduledFor}`} · {task.priority} priority
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-brand-muted">
                  No task records are linked to this aircraft.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
