"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, Plane, ShieldCheck, Wrench } from "lucide-react";
import type { AircraftRecord } from "@/lib/demo-data/aircraft";

type Props = { cards: AircraftRecord[]; ariaLabel?: string; detailPrefix: string };

export function SkewedCardCarousel({ cards, ariaLabel = "Aircraft carousel", detailPrefix }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const next = useCallback((delta: number) => setActiveIndex((i) => (i + delta + cards.length) % cards.length), [cards.length]);
  if (!cards.length) return <div className="rounded-3xl border border-brand-border bg-white p-12 text-center text-brand-muted">No aircraft match these filters.</div>;
  const moveByPointer = (end: number) => { if (startX.current !== null && Math.abs(end - startX.current) > 45) next(end < startX.current ? 1 : -1); startX.current = null; };

  return <section aria-label={ariaLabel} className="w-full" tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowLeft") next(-1); if (e.key === "ArrowRight") next(1); }} onPointerDown={(e) => { startX.current = e.clientX; }} onPointerUp={(e) => moveByPointer(e.clientX)} onPointerCancel={() => { startX.current = null; }}>
    <div className="relative overflow-hidden rounded-[30px] border border-white bg-[radial-gradient(circle_at_50%_100%,rgba(22,124,150,.16),transparent_55%),linear-gradient(135deg,#eaf1f6,#f8fafc)] p-4 shadow-inner shadow-white/80 sm:p-7">
      <div className="grid min-h-[500px] grid-cols-1 items-center gap-4 md:grid-cols-[.78fr_1.2fr_.78fr] md:gap-2 lg:gap-5">
        {[-1, 0, 1].map((offset) => {
          const index = (activeIndex + offset + cards.length) % cards.length, card = cards[index], selected = offset === 0;
          const color = card.status === "Operational" ? "#059669" : card.status === "Maintenance" ? "#dc2626" : "#d97706";
          return <article key={`${card.id}-${offset}`} aria-hidden={!selected && undefined} className={`relative flex min-h-[460px] flex-col overflow-hidden rounded-[26px] border bg-white/75 shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-500 ${selected ? "z-10 scale-100 border-2 border-sky-400" : "hidden scale-[.91] opacity-75 md:flex"}`}>
            <div className="h-1.5" style={{background:card.accent}} />
            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <div className="flex justify-between gap-4"><div><p className="font-mono text-xs font-bold tracking-widest text-slate-500">{card.id} / {card.squadron}</p><h3 className="mt-2 text-2xl font-bold text-brand-primary-dark">{card.name}</h3><p className="mt-1 text-sm text-brand-muted">{card.model} · {card.role}</p></div><Plane className="size-6 shrink-0" style={{color:card.accent}} /></div>
              <div className="relative my-5 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e6f5f8] via-white to-[#d9e2ec]"><div className="absolute size-36 rounded-full border border-dashed border-brand-secondary/20"/><div className="absolute size-24 rounded-full border border-dashed border-brand-secondary/25"/><div className="absolute h-px w-4/5 rotate-[-25deg] bg-brand-secondary/20"/><Plane className="relative z-10 size-20 -rotate-12" strokeWidth={1.25} style={{color:card.accent}}/><span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-widest text-slate-400">AIRFRAME · {card.id}</span></div>
              <p className="text-sm leading-6 text-slate-600">{card.description}</p>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"><span className="inline-flex items-center gap-2 text-sm font-semibold" style={{color}}>{card.status === "Operational" ? <ShieldCheck className="size-4"/> : <AlertTriangle className="size-4"/>}{card.status}</span><span className="text-xs text-brand-muted">{card.base}</span></div>
              <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wider text-brand-muted">Readiness</p><p className="mt-1 text-2xl font-bold text-brand-primary-dark">{card.readiness}%</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wider text-brand-muted">Flight hours</p><p className="mt-1 flex items-center gap-1 text-2xl font-bold text-brand-primary-dark"><Clock3 className="size-4 text-brand-secondary"/>{card.hours}h</p></div></div>
              <div className="mt-auto flex items-center justify-between border-t border-brand-border pt-4"><span className="inline-flex items-center gap-1 text-xs text-brand-muted"><Wrench className="size-3.5"/>{card.hoursSinceMaintenance} h since service</span><Link draggable={false} href={`${detailPrefix}/${card.id}`} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-brand-secondary">Explore more <ArrowUpRight className="size-4"/></Link></div>
            </div>
          </article>;
        })}
      </div>
      <button type="button" onClick={() => next(-1)} aria-label="Previous aircraft" className="absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white/90 text-brand-primary-dark shadow-lg sm:left-3"><ChevronLeft/></button>
      <button type="button" onClick={() => next(1)} aria-label="Next aircraft" className="absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white/90 text-brand-primary-dark shadow-lg sm:right-3"><ChevronRight/></button>
    </div>
    <div className="mt-5 flex justify-center gap-2">{cards.map((card,i)=><button key={card.id} type="button" onClick={()=>setActiveIndex(i)} aria-label={`Select ${card.name}`} aria-current={i===activeIndex} className={`h-2.5 rounded-full transition-all ${i===activeIndex?"w-8 bg-brand-secondary":"w-2.5 bg-slate-300"}`}/>)}</div>
  </section>;
}
