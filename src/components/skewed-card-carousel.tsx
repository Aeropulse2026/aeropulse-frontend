
"use client";

import { useState } from "react";
import {
  Plane,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Clock3,
} from "lucide-react";

export type SkewedCarouselCard = {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
  meta: string;
  detail: string;
  accent: string;
  tone: string;
  status: string;
  readiness: number;
};

type Props = {
  cards: SkewedCarouselCard[];
  ariaLabel?: string;
};

function HealthRing({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div
      className="relative flex size-14 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${value * 3.6}deg, #e8edf4 0deg)`,
      }}
    >
      <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-white/40 text-sm font-bold text-slate-800 backdrop-blur-xl">
        {value}
      </div>
    </div>
  );
}

function RadarGraphic({ accent }: { accent: string }) {
  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden">
      {[52, 88, 124, 160].map((size) => (
        <div
          key={size}
          className="absolute rounded-full border border-dashed"
          style={{
            width: size,
            height: size,
            borderColor: `${accent}55`,
          }}
        />
      ))}

      <div
        className="absolute h-px w-4/5 rotate-[-43deg]"
        style={{ backgroundColor: `${accent}aa` }}
      />

      <Plane
        className="relative z-10 size-10"
        color={accent}
        fill={accent}
        strokeWidth={1.5}
      />
    </div>
  );
}

function AircraftCard({
  card,
  active,
}: {
  card: SkewedCarouselCard;
  active: boolean;
}) {
  const status = card.status.toLowerCase();

  const isAog =
    status.includes("aog") ||
    status.includes("maintenance");

  const isFault =
    status.includes("fault") ||
    status.includes("standby");

  const statusColor = isAog
    ? "#ef4444"
    : isFault
      ? "#f59e0b"
      : "#059669";

  const statusLabel = isAog
    ? "AOG"
    : isFault
      ? status.includes("fault")
        ? "Predicted Fault"
        : "On Standby"
      : "Operational";

  const StatusIcon = isAog
    ? AlertCircle
    : isFault
      ? AlertTriangle
      : ShieldCheck;

  return (
    <article
      className={[
        "relative min-w-0 flex-col overflow-hidden rounded-[28px]",
        "border bg-white/30 shadow-[0_22px_52px_rgba(15,23,42,0.13)] backdrop-blur-2xl transition-all duration-500",
        active
          ? "z-20 flex border-2 bg-white/45 shadow-[0_24px_58px_rgba(14,165,233,0.22)]"
          : "z-10 hidden border-white/50 md:flex",
      ].join(" ")}
      style={{
        borderColor: active ? "#38bdf8" : "rgba(255,255,255,0.55)",
        transform: active
          ? "scale(1)"
          : "scale(0.96) skewX(-3deg)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: card.accent }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.48),rgba(255,255,255,0.10)_32%,transparent_58%,rgba(255,255,255,0.14))]" />

      <div className="flex flex-1 flex-col p-5 pt-7 sm:p-6 sm:pt-8">
        {/* Aircraft identification */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold tracking-wider text-slate-500 sm:text-xs">
              {card.eyebrow}
            </p>

            <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {card.title}
            </h3>
          </div>

          <Plane
            className="size-6 shrink-0"
            style={{ color: card.accent }}
          />
        </div>

        <p className="mt-3 min-h-[60px] text-sm leading-5 text-slate-500">
          {card.description}
        </p>

        {/* Status badge */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-full bg-white/25 px-3 py-2.5 ring-1 ring-white/50 backdrop-blur-lg">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide sm:text-[10px]"
            style={{
              color: statusColor,
              borderColor: `${statusColor}40`,
              backgroundColor: `${statusColor}0d`,
            }}
          >
            <StatusIcon size={13} />
            {statusLabel}
          </span>

          <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
            {card.title === "Sentinel 12"
              ? "Surveillance Base"
              : card.eyebrow.split("/")[0].trim()}
          </span>
        </div>

        {/* Health score */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                Overall health score
              </p>

              <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                {card.readiness}
                <span className="ml-0.5 text-base">%</span>
              </p>
            </div>

            <HealthRing
              value={card.readiness}
              color={statusColor}
            />
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/35">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${card.readiness}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>
        </div>

        {/* Radar graphic */}
        <div className="mt-4 flex-1">
          <RadarGraphic accent={card.accent} />
        </div>

        {/* Flight metrics */}
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/50 pt-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock3 size={14} />
            <span>{card.meta}:</span>
            <strong className="text-slate-900">
              {card.detail}
            </strong>
          </div>
        </div>
      </div>

      {active && (
        <div
          className="absolute bottom-0 left-0 h-1 w-full"
          style={{ backgroundColor: card.accent }}
        />
      )}
    </article>
  );
}

export function SkewedCardCarousel({
  cards,
  ariaLabel = "Aircraft carousel",
}: Props) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(2, Math.max(0, cards.length - 1))
  );

  if (!cards.length) return null;

  const previous = () => {
    setActiveIndex(
      (current) => (current - 1 + cards.length) % cards.length
    );
  };

  const next = () => {
    setActiveIndex(
      (current) => (current + 1) % cards.length
    );
  };

  const visibleCards = [-1, 0, 1].map((offset) => {
    const index =
      (activeIndex + offset + cards.length) % cards.length;

    return {
      card: cards[index],
      active: offset === 0,
    };
  });

  return (
    <section aria-label={ariaLabel} className="w-full">
      <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.62),transparent_36%),radial-gradient(circle_at_86%_88%,rgba(167,139,250,0.55),transparent_44%),radial-gradient(circle_at_52%_48%,rgba(255,255,255,0.78),transparent_50%),rgba(203,213,225,0.62)] px-3 py-4 shadow-inner shadow-white/60 backdrop-blur-sm sm:px-5 sm:py-6">
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-2 lg:gap-4">
          {visibleCards.map(({ card, active }) => (
            <AircraftCard
              key={card.id}
              card={card}
              active={active}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={previous}
          aria-label="Previous aircraft"
          className="absolute left-2 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/70 text-slate-800 shadow-lg shadow-slate-500/15 backdrop-blur-md transition hover:scale-105 sm:left-[-16px] sm:size-12"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next aircraft"
          className="absolute right-2 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/70 text-slate-800 shadow-lg shadow-slate-500/15 backdrop-blur-md transition hover:scale-105 sm:right-[-16px] sm:size-12"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {cards.map((card, index) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Select ${card.title}`}
            aria-current={
              index === activeIndex ? "true" : undefined
            }
            className={[
              "h-2.5 rounded-full transition-all duration-300",
              index === activeIndex
                ? "w-9 bg-cyan-700"
                : "w-2.5 bg-slate-300 hover:bg-slate-400",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
