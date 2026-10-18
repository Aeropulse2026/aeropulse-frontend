"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check,
  LayoutGrid,
  Plane,
  Wrench,
  Clock3,
  type LucideIcon,
} from "lucide-react";

import { SkewedCardCarousel } from "@/components/skewed-card-carousel";
import { filterAircraftRecords, type AircraftRecord, type AircraftStatusFilter } from "@/lib/demo-data/aircraft";

type FleetBrowserProps = {
  aircraft: AircraftRecord[];
  title?: string;
  eyebrow?: string;
  description?: string;
  embedded?: boolean;
  detailPrefix: string;
  appearance?: "standard" | "squadron";
  onAircraftSelect?: (id: string) => void;
};

const statusOptions: Array<{ label: AircraftStatusFilter; icon: LucideIcon; color: "blue" | "green" | "amber" | "red" }> = [
  { label: "All status", icon: LayoutGrid, color: "blue" },
  { label: "Operational", icon: Plane, color: "green" },
  { label: "Maintenance", icon: Wrench, color: "amber" },
  { label: "Standby", icon: Clock3, color: "red" },
] as const;

const iconColors = {
  blue: "bg-sky-50 text-sky-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-rose-50 text-rose-600",
};

const subscribeToPortalAvailability = () => () => {};
const getPortalAvailability = () => true;
const getServerPortalAvailability = () => false;

export function FleetBrowser({
  aircraft,
  title = "Fleet overview",
  eyebrow = "",
  description = "Browse serviceability, maintenance windows, and fleet profiles.",
  embedded = false,
  detailPrefix,
  appearance = "standard",
  onAircraftSelect,
}: FleetBrowserProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AircraftStatusFilter>("All status");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMenuPosition, setDropdownMenuPosition] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isSquadron = appearance === "squadron";
  const PageContainer = embedded ? "section" : "main";
  const portalReady = useSyncExternalStore(subscribeToPortalAvailability, getPortalAvailability, getServerPortalAvailability);

  const updateDropdownMenuPosition = useCallback(() => {
    const trigger = dropdownTriggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const edge = 12;
    const gap = 8;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const availableBelow = Math.max(0, window.innerHeight - rect.bottom - gap - edge);
    const availableAbove = Math.max(0, rect.top - gap - edge);
    const placeBelow = availableBelow >= 220 || availableBelow >= availableAbove;
    const availableHeight = placeBelow ? availableBelow : availableAbove;
    const maxHeight = Math.max(120, Math.min(280, availableHeight));
    const width = Math.min(rect.width, window.innerWidth - edge * 2);
    const left = Math.max(scrollX + edge, Math.min(rect.left + scrollX, scrollX + window.innerWidth - width - edge));
    const top = placeBelow
      ? scrollY + Math.min(rect.bottom + gap, window.innerHeight - edge - maxHeight)
      : scrollY + Math.max(edge, rect.top - gap - maxHeight);

    setDropdownMenuPosition({ top, left, width, maxHeight });
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedMenu = dropdownMenuRef.current?.contains(target);
      if (!clickedTrigger && !clickedMenu) {
        setDropdownOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && dropdownOpen) {
        setDropdownOpen(false);
        dropdownTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const selectedIndex = statusOptions.findIndex((option) => option.label === status);
    optionRefs.current[selectedIndex]?.focus();
  }, [dropdownOpen, status]);

  useLayoutEffect(() => {
    if (!dropdownOpen) return;

    updateDropdownMenuPosition();
    window.addEventListener("resize", updateDropdownMenuPosition);
    window.addEventListener("scroll", updateDropdownMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateDropdownMenuPosition);
      window.removeEventListener("scroll", updateDropdownMenuPosition, true);
    };
  }, [dropdownOpen, updateDropdownMenuPosition]);

  const counts = useMemo(
    () => ({
      "All status": aircraft.length,
      Operational: aircraft.filter(
        (a) => a.status === "Operational"
      ).length,
      Maintenance: aircraft.filter(
        (a) => a.status === "Maintenance"
      ).length,
      Standby: aircraft.filter((a) => a.status === "Standby").length,
    }),
    [aircraft]
  );

  const filtered = useMemo(() => {
    return filterAircraftRecords(aircraft, query, status);
  }, [aircraft, query, status]);

  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % statusOptions.length;
    if (event.key === "ArrowUp") nextIndex = (index - 1 + statusOptions.length) % statusOptions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = statusOptions.length - 1;
    if (nextIndex !== null) {
      event.preventDefault();
      optionRefs.current[nextIndex]?.focus();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setDropdownOpen(false);
      dropdownTriggerRef.current?.focus();
    }
  }

  const statistics = [
    {
      label: "Operational",
      count: counts.Operational,
      color: "text-emerald-700",
    },
    {
      label: "Maintenance",
      count: counts.Maintenance,
      color: "text-amber-700",
    },
    {
      label: "Unavailable",
      count: counts.Standby,
      color: "text-amber-700",
    },
  ];

  return (
    <PageContainer
      id={embedded ? "aircraft" : undefined}
      className={`${isSquadron
          ? "squadron-fleet-page"
          : "bg-brand-background text-slate-950"
        } ${embedded ? "" : "min-h-screen px-4 py-7 sm:px-6 lg:px-12"}`}
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Page heading */}
        <header className="mb-6">
          {eyebrow && <p
            className={`${isSquadron
                ? "fleet-eyebrow"
                : "text-brand-secondary"
              } mb-2 text-[11px] font-bold uppercase tracking-[.24em]`}
          >
            {eyebrow}
          </p>}

          <h1
            className={`${isSquadron ? "" : "text-brand-primary-dark"
              } text-3xl font-semibold tracking-tight sm:text-4xl`}
          >
            {title}
          </h1>

          <p
            className={`${isSquadron
                ? "fleet-description"
                : "text-brand-muted"
              } mt-2 text-sm`}
          >
            {description}
          </p>
        </header>

        {/* Statistics */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {statistics.map((item) => (
            <div
              key={item.label}
              className={`${isSquadron
                  ? "fleet-stat-card rounded-2xl border px-5 py-4"
                  : "hq-interactive-card rounded-2xl border border-brand-border bg-white px-5 py-4 shadow-sm"
                } transition-shadow duration-200 hover:shadow-md`}
            >
              <p
                className={`${isSquadron
                    ? "fleet-stat-label"
                    : "text-brand-muted"
                  } text-sm`}
              >
                {item.label}
              </p>

              <p
                className={`${isSquadron ? "fleet-stat-value" : ""
                  } mt-1 text-3xl font-semibold ${item.color}`}
              >
                {item.count}
                <span
                  className={`${isSquadron
                      ? "fleet-stat-suffix"
                      : "text-brand-muted"
                    } ml-2 text-sm font-normal`}
                >
                  aircraft
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Search and status controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search field: one border, no outer focus ring */}
          <div
            className={`flex h-[54px] min-w-0 flex-1 items-center gap-3 rounded-full border px-4 sm:px-5 transition-colors duration-200 ${isSquadron
                ? "fleet-search-control"
                : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
              }`}
          >
            <Search
              aria-hidden="true"
              className={`size-5 shrink-0 ${isSquadron
                  ? "fleet-search-icon"
                  : "text-sky-800"
                }`}
            />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search aircraft, ID, squadron..."
              aria-label="Search aircraft"
              className="!m-0 h-full w-full min-w-0 !border-0 !bg-transparent !p-0 text-sm text-slate-800 !outline-none !ring-0 !shadow-none placeholder:text-slate-400 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none sm:text-base"
              style={{
                outline: "none",
                boxShadow: "none",
                border: "none",
              }}
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 rounded-full px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* Custom dropdown */}
          <div
            ref={dropdownRef}
            className="relative z-50 w-full sm:w-[225px] sm:shrink-0"
          >
            <button
              ref={dropdownTriggerRef}
              type="button"
              aria-label="Filter aircraft status"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              aria-controls="fleet-status-options"
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && !dropdownOpen) {
                  event.preventDefault();
                  setDropdownOpen(true);
                }
              }}
              onClick={() => setDropdownOpen((previous) => !previous)}
              className={`flex h-[54px] w-full items-center justify-between gap-3 rounded-[22px] border px-5 transition-colors duration-200 ${isSquadron
                  ? "fleet-filter-select"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300"
                } ${dropdownOpen
                  ? "border-sky-300"
                  : ""
                }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <SlidersHorizontal
                  className="size-5 shrink-0 text-sky-800"
                />
                <span className="truncate text-sm font-semibold">
                  {status}
                </span>
              </span>

              <ChevronDown
                className={`pointer-events-none size-5 shrink-0 text-slate-700 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Floating menu */}
            {portalReady && createPortal(<div
              ref={dropdownMenuRef}
              role="listbox"
              id="fleet-status-options"
              aria-label="Aircraft status options"
              aria-hidden={!dropdownOpen}
              style={dropdownMenuPosition ? {
                top: dropdownMenuPosition.top,
                left: dropdownMenuPosition.left,
                width: dropdownMenuPosition.width,
                maxHeight: dropdownMenuPosition.maxHeight,
              } : undefined}
              className={`absolute z-[1000] min-w-0 overflow-y-auto origin-top rounded-[23px] border border-slate-100 bg-white p-2 shadow-[0_18px_48px_rgba(20,45,75,0.16)] transition-all duration-200 ${dropdownOpen && dropdownMenuPosition
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-2 scale-[0.98] opacity-0"
                }`}
            >
              {statusOptions.map((option, index) => {
                const Icon = option.icon;
                const selected = status === option.label;
                const count =
                  counts[option.label as keyof typeof counts];

                return (
                  <button
                    key={option.label}
                    ref={(element) => { optionRefs.current[index] = element; }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    onKeyDown={(event) => handleOptionKeyDown(event, index)}
                    onClick={() => {
                      setStatus(option.label);
                      setDropdownOpen(false);
                      dropdownTriggerRef.current?.focus();
                    }}
                    className={`flex min-h-[49px] w-full items-center gap-3 rounded-[15px] px-3 py-2 text-left transition-colors duration-150 ${selected
                        ? "bg-sky-50"
                        : "hover:bg-slate-50"
                      }`}
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconColors[option.color]}`}
                    >
                      <Icon
                        className="size-[19px]"
                        strokeWidth={2.2}
                      />
                    </span>

                    <span className="min-w-0 flex-1 whitespace-nowrap text-sm font-medium text-slate-800">
                      {option.label}
                    </span>

                    {option.label !== "All status" && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-600">
                        {String(count).padStart(2, "0")}
                      </span>
                    )}

                    {selected && (
                      <Check
                        className="size-5 shrink-0 text-sky-600"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                );
              })}
            </div>, document.body)}
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p
            className={`text-sm ${isSquadron
                ? "fleet-description"
                : "text-brand-muted"
              }`}
          >
            {status === "All status" ? "All aircraft" : status}
          </p>

          <p className="text-xs font-medium text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filtered.length}
            </span>{" "}
            of {aircraft.length} aircraft
          </p>
        </div>

        {/* Existing carousel */}
        {filtered.length > 0 ? (
          <SkewedCardCarousel
            cards={filtered}
            ariaLabel={`${title} carousel`}
            detailPrefix={detailPrefix}
            appearance={appearance}
            onSelectAircraft={onAircraftSelect}
          />
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-brand-border bg-white px-5 py-12 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="size-6 text-slate-400" />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No aircraft found
            </h2>

            <p className="mt-2 max-w-sm text-sm text-brand-muted">
              No aircraft match your search and status filter.
              Try a different search term or status.
            </p>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("All status");
                setDropdownOpen(false);
              }}
              className="mt-5 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
