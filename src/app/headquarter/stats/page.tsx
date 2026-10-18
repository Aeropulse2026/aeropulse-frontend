import { HeadquartersAnalytics } from "@/components/headquarters-analytics";

export default function HeadquartersFleetStatisticsPage() {
  return (
    <main className="min-h-screen bg-brand-background px-4 py-7 text-slate-950 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[.24em] text-brand-secondary">Fleet analytics</p>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-primary-dark sm:text-4xl">Fleet statistics</h1>
          <p className="mt-2 text-sm text-brand-muted">Fleet-wide readiness, utilization, and recorded service-date analysis.</p>
        </header>
        <HeadquartersAnalytics />
      </div>
    </main>
  );
}
