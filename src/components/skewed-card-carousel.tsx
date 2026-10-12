"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Plane, Radio } from "lucide-react";
import { motion, type PanInfo, useReducedMotion } from "framer-motion";

export type SkewedCarouselCard = {
  id: string;
  title: string;
  description: string;
  image?: string;
  eyebrow?: string;
  meta?: string;
  detail?: string;
  accent?: string;
  tone?: string;
  onClick?: () => void;
};

type SkewedCardCarouselProps = { cards: SkewedCarouselCard[]; initialIndex?: number; ariaLabel?: string };

export function SkewedCardCarousel({ cards, initialIndex = 0, ariaLabel = "Card carousel" }: SkewedCardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.min(initialIndex, Math.max(cards.length - 1, 0)));
  const [cardStep, setCardStep] = useState(260);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateCardStep = () => setCardStep(window.innerWidth <= 768 ? 218 : Math.max(205, Math.min(300, window.innerWidth * 0.28)));
    updateCardStep();
    window.addEventListener("resize", updateCardStep);
    return () => window.removeEventListener("resize", updateCardStep);
  }, []);

  const goTo = useCallback((index: number) => { if (cards.length) setActiveIndex((index + cards.length) % cards.length); }, [cards.length]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrevious = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) { if (event.key === "ArrowRight") { event.preventDefault(); goNext(); } if (event.key === "ArrowLeft") { event.preventDefault(); goPrevious(); } }

  if (!cards.length) return null;

  return (
    <section className="skewed-carousel" aria-label={ariaLabel}>
      <div className="skewed-carousel-stage" tabIndex={0} role="region" onKeyDown={handleKeyDown}>
        {cards.map((card, index) => {
          let offset = index - activeIndex;
          if (offset > cards.length / 2) offset -= cards.length;
          if (offset < -cards.length / 2) offset += cards.length;
          const isActive = offset === 0;
          return (
            <motion.article key={card.id} className={`skewed-carousel-card ${isActive ? "is-active" : ""}`} style={{ "--card-accent": card.accent ?? "#d9f3f7", zIndex: cards.length - Math.abs(offset) } as React.CSSProperties} animate={{ x: offset * cardStep, scale: isActive ? 1 : 0.965, opacity: isActive ? 1 : 0.82, filter: isActive ? "saturate(1.08)" : "saturate(.7)" }} transition={prefersReducedMotion ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 25, mass: 0.8 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.22} onDragEnd={(_, info: PanInfo) => { if (Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 400) info.offset.x < 0 ? goNext() : goPrevious(); }} onTap={() => { if (!isActive) goTo(index); else card.onClick?.(); }} aria-current={isActive ? "true" : undefined}>
              <div className={`skewed-carousel-card-inner ${card.tone ?? "bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-secondary"}`}>
                {card.image && <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${card.image})` }} />}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.1),transparent_42%,rgba(0,0,0,.2))]" />
                <div className="relative flex h-full flex-col justify-between px-8 py-7 text-white sm:px-10">
                  <div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">{card.eyebrow ?? "Aeropulse fleet"}</p><h3 className="mt-2 text-3xl font-semibold tracking-tight">{card.title}</h3></div><span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[var(--card-accent)]"><Plane className="size-5" /></span></div>
                  <div><p className="max-w-[270px] text-sm leading-6 text-white/80">{card.description}</p><div className="mt-6 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.18em] text-white/55">{card.meta ?? "Status"}</p><p className="mt-1 text-sm font-semibold text-[var(--card-accent)]">{card.detail ?? "Operational"}</p></div><span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65"><Radio className="size-3.5" />Telemetry live</span></div></div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
      <div className="mt-7 flex items-center justify-between gap-4"><div className="flex items-center gap-2" aria-label={`Showing card ${activeIndex + 1} of ${cards.length}`}>{cards.map((card, index) => <button key={card.id} type="button" aria-label={`Go to ${card.title}`} aria-current={index === activeIndex} onClick={() => goTo(index)} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-brand-secondary" : "w-2 bg-brand-border hover:bg-brand-secondary/50"}`} />)}</div><div className="flex items-center gap-2"><button type="button" aria-label="Previous card" onClick={goPrevious} className="flex size-9 items-center justify-center rounded-full border border-brand-border bg-white text-brand-primary-dark transition-colors hover:bg-brand-secondary-light"><ArrowLeft className="size-4" /></button><button type="button" aria-label="Next card" onClick={goNext} className="flex size-9 items-center justify-center rounded-full border border-brand-border bg-white text-brand-primary-dark transition-colors hover:bg-brand-secondary-light"><ArrowRight className="size-4" /></button></div></div>
      <p className="mt-3 flex items-center gap-1 text-xs text-brand-muted"><ArrowUpRight className="size-3.5" />Drag or swipe to browse the fleet</p>
    </section>
  );
}
