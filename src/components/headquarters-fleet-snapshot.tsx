import { Clock3, Gauge, Plane, Wrench } from "lucide-react";
import { demoAircraft } from "@/lib/demo-data/aircraft";
import { getHeadquartersFleetSummary } from "@/lib/demo-data/headquarters";

const summary = getHeadquartersFleetSummary(demoAircraft);
const metrics = [
  { label: "Network aircraft", value: summary.total, detail: "Fleet records", icon: Plane },
  { label: "Operational", value: summary.operational, detail: "Recorded status", icon: Gauge },
  { label: "In maintenance", value: summary.inMaintenance, detail: "Recorded status", icon: Wrench },
  { label: "Average flight hours", value: summary.averageFlightHours === null ? "—" : `${summary.averageFlightHours.toFixed(1)} h`, detail: "Recorded counters", icon: Clock3 },
];

export function HeadquartersFleetSnapshot() {
  return (
    <section aria-label="Network fleet snapshot" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, detail, icon: Icon }) => (
        <article key={label} className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-brand-muted">{label}</p>
            <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-secondary" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-brand-primary-dark">{value}</p>
          <p className="mt-1 text-xs text-brand-muted">{detail}</p>
        </article>
      ))}
    </section>
  );
}
