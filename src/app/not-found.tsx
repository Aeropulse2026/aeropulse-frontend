import Link from "next/link";
import { ArrowLeft, Compass, Plane, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-primary-dark px-6 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(22,124,150,0.34),transparent_35%),linear-gradient(145deg,#0b1f33_0%,#123d69_55%,#071827_100%)]" />
      <div className="absolute -right-20 top-20 size-72 rounded-full border border-brand-secondary-light/15" />
      <div className="absolute -right-6 top-34 size-56 rounded-full border border-brand-secondary-light/10" />
      <div className="absolute left-0 top-1/3 h-px w-2/5 bg-gradient-to-r from-transparent via-brand-secondary-light/40 to-transparent" />
      <div className="absolute bottom-1/4 right-0 h-px w-1/3 rotate-[-18deg] bg-gradient-to-r from-transparent via-brand-secondary-light/35 to-transparent" />

      <section className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-brand-secondary-light/25 bg-white/10 text-brand-secondary-light shadow-2xl shadow-black/20 backdrop-blur-sm">
          <Compass className="size-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-secondary-light">Aeropulse navigation</p>
        <div className="relative mt-5">
          <h1 className="text-[7rem] font-bold leading-none tracking-[-0.08em] text-white/95 sm:text-[10rem]">404</h1>
          <Plane className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] text-brand-secondary-light/75 sm:size-28" strokeWidth={1.1} />
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">This route has left the flight plan.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-300">The page you’re looking for could not be located. It may have moved, or the coordinates may be incorrect.</p>
        <Link href="/" className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-secondary px-5 text-sm font-semibold text-white shadow-lg shadow-brand-secondary/20 transition-colors hover:bg-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary-light">
          <ArrowLeft className="size-4" />
          Return to base
        </Link>
        <div className="mt-14 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400"><Radio className="size-3.5 text-brand-success" />Systems operational</div>
      </section>
    </main>
  );
}
