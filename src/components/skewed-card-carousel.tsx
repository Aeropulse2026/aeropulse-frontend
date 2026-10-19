
"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, Plane, ShieldCheck, Wrench } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { AircraftRecord } from "@/lib/demo-data/aircraft";
import { getAircraftIllustration } from "@/lib/aircraft-illustrations";

type Props = { cards: AircraftRecord[]; ariaLabel?: string; detailPrefix: string; appearance?: "standard" | "squadron"; onSelectAircraft?: (id: string) => void };

export function SkewedCardCarousel({ cards, ariaLabel = "Aircraft carousel", detailPrefix, appearance = "standard", onSelectAircraft }: Props) {
  const isSquadron = appearance === "squadron";
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const startX = useRef<number | null>(null);
  const next = useCallback((delta: number) => {
    if (cards.length < 2) return;
    setActiveIndex((i) => (i + delta + cards.length) % cards.length);
  }, [cards.length]);
  const select = useCallback((index: number) => {
    const forward = (index - activeIndex + cards.length) % cards.length;
    const backward = (activeIndex - index + cards.length) % cards.length;
    if (forward === 0) return;
    next(forward <= backward ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex, cards.length, next]);
  if (!cards.length) return <div className="rounded-3xl border border-brand-border bg-white p-12 text-center text-brand-muted">No aircraft match these filters.</div>;
  const moveByPointer = (end: number) => { if (startX.current !== null && Math.abs(end - startX.current) > 45) next(end < startX.current ? 1 : -1); startX.current = null; };

  return <section aria-label={ariaLabel} className={`aircraft-carousel w-full ${isSquadron ? "aircraft-carousel--squadron" : ""}`} tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowLeft") next(-1); if (e.key === "ArrowRight") next(1); }} onPointerDown={(e) => { startX.current = e.clientX; }} onPointerUp={(e) => moveByPointer(e.clientX)} onPointerCancel={() => { startX.current = null; }}>
    <div className={`relative overflow-hidden rounded-[30px] border p-4 shadow-inner sm:p-7 ${isSquadron ? "aircraft-carousel-frame" : "border-white bg-[radial-gradient(circle_at_50%_100%,rgba(22,124,150,.16),transparent_55%),linear-gradient(135deg,#eaf1f6,#f8fafc)] shadow-white/80"}`}>
      <div className="aircraft-carousel-track grid min-h-[500px] grid-cols-1 items-center gap-4 md:grid-cols-[.78fr_1.2fr_.78fr] md:gap-2 lg:gap-5">
        {[-1, 0, 1].map((offset) => {
          const index = (activeIndex + offset + cards.length) % cards.length, card = cards[index], selected = offset === 0;
          const color = card.status === "Operational" ? "var(--aero-success)" : card.status === "Maintenance" ? "var(--aero-warning)" : "var(--aero-disabled)";
          const illustration = getAircraftIllustration(card.model);
          const stateClass = selected
            ? isSquadron ? "aircraft-carousel-card--active z-10 scale-100" : "z-10 scale-100 border-2 border-brand-secondary"
            : isSquadron ? "aircraft-carousel-card--side scale-[.92] opacity-70 md:flex" : "hidden scale-[.91] opacity-75 md:flex";
          const surfaceClass = isSquadron ? "bg-white" : "bg-white/75 shadow-xl shadow-slate-900/10 backdrop-blur-xl";
          return <motion.article key={cards.length < 3 ? `${card.id}-${offset}` : card.id} layout="position" transition={{ layout: { duration: reduceMotion ? 0 : 0.52, ease: [0.22, 0.72, 0.2, 1] } }} aria-hidden={!selected || undefined} inert={!selected} data-position={selected ? "active" : offset < 0 ? "previous" : "next"} className={`aircraft-carousel-card relative flex min-h-[460px] flex-col overflow-hidden rounded-[26px] border ${surfaceClass} ${stateClass}`}>
            <div className="h-1.5" style={{background:color}} />
            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <div className="flex justify-between gap-4"><div><p className="font-mono text-xs font-bold tracking-widest text-slate-500">{card.id} / {card.squadron}</p><h3 className="mt-2 text-2xl font-bold text-brand-primary-dark">{card.name}</h3><p className="mt-1 text-sm text-brand-muted">{card.model} · {card.role}</p></div><Plane className="size-6 shrink-0" style={{color}} /></div>
              <div className={`relative my-5 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e6f5f8] via-white to-[#d9e2ec] ${isSquadron ? "aircraft-illustration" : ""}`}><div className="absolute size-36 rounded-full border border-dashed border-brand-secondary/20"/><div className="absolute size-24 rounded-full border border-dashed border-brand-secondary/25"/><div className="absolute h-px w-4/5 rotate-[-25deg] bg-brand-secondary/20"/>{illustration ? <Image src={illustration} alt="" aria-hidden="true" width={1536} height={1024} sizes="(min-width: 1024px) 420px, 80vw" className="relative z-10 h-full w-full scale-[1.12] object-contain drop-shadow-[0_10px_12px_rgba(19,52,76,0.2)]" priority={selected}/> : <Plane className="relative z-10 size-20 -rotate-12" strokeWidth={1.25} style={{color}}/>}<span className="absolute bottom-3 right-4 z-20 font-mono text-[10px] tracking-widest text-slate-400">AIRFRAME · {card.id}</span></div>
              <p className="text-sm leading-6 text-slate-600">{card.description}</p>
              <div className={`${isSquadron ? `aircraft-status aircraft-status--${card.status.toLowerCase()}` : "bg-slate-50"} mt-4 flex items-center justify-between rounded-xl px-3 py-2.5`}><span className="inline-flex items-center gap-2 text-sm font-semibold" style={{color}}>{card.status === "Operational" ? <ShieldCheck className="size-4"/> : <AlertTriangle className="size-4"/>}{card.status}</span><span className="text-xs text-brand-muted">{card.base}</span></div>
              <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wider text-brand-muted">Readiness</p><p className="mt-1 text-2xl font-bold text-brand-primary-dark">{card.readiness}%</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] uppercase tracking-wider text-brand-muted">Flight hours</p><p className="mt-1 flex items-center gap-1 text-2xl font-bold text-brand-primary-dark"><Clock3 className="size-4 text-brand-secondary"/>{card.hours}h</p></div></div>
              <div className="mt-auto flex items-center justify-between border-t border-brand-border pt-4"><span className="inline-flex items-center gap-1 text-xs text-brand-muted"><Wrench className="size-3.5"/>{card.hoursSinceMaintenance} h since service</span>{onSelectAircraft ? <button type="button" onClick={() => onSelectAircraft(card.id)} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-brand-secondary">View details <ArrowUpRight className="size-4"/></button> : <Link draggable={false} href={`${detailPrefix}/${card.id}`} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-brand-secondary">Explore more <ArrowUpRight className="size-4"/></Link>}</div>
            </div>
          </motion.article>;
        })}
      </div>
      <button type="button" onClick={() => next(-1)} aria-label="Previous aircraft" className={`aircraft-carousel-control absolute left-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full sm:left-3 ${isSquadron ? "" : "border border-brand-border bg-white/90 text-brand-primary-dark shadow-lg"}`}><ChevronLeft/></button>
      <button type="button" onClick={() => next(1)} aria-label="Next aircraft" className={`aircraft-carousel-control absolute right-2 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full sm:right-3 ${isSquadron ? "" : "border border-brand-border bg-white/90 text-brand-primary-dark shadow-lg"}`}><ChevronRight/></button>
    </div>
    <div className="mt-5 flex justify-center gap-2">{cards.map((card, i) => <button key={card.id} type="button" onClick={() => select(i)} aria-label={`Select ${card.name}`} aria-current={i === activeIndex} className={`aircraft-carousel-indicator h-2.5 rounded-full transition-all ${isSquadron ? `${i === activeIndex ? "is-active w-8" : "w-2.5"}` : `${i === activeIndex ? "w-8 bg-brand-secondary" : "w-2.5 bg-slate-300"}`}`} />)}</div>
  </section>;
}
