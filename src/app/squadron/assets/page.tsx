"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Search, Wrench } from "lucide-react";
import { filterSquadronInventory, getAvailableQuantity, getSquadronInventory, isLowStock } from "@/lib/demo-data/squadron/selectors";
import type { InventoryItem } from "@/lib/demo-data/squadron/types";

export default function SquadronAssetsPage() {
  const [category, setCategory] = useState("All categories");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const inventory = useMemo(() => getSquadronInventory(), []);
  const lowStockItems = inventory.filter(isLowStock);

  const items = useMemo(() => filterSquadronInventory(inventory, { query, category, lowStockOnly: showLowStockOnly }), [category, inventory, query, showLowStockOnly]);

  function toggleLowStockFilter() {
    const next = !showLowStockOnly;
    setShowLowStockOnly(next);
    setSelected(null);
  }

  const categories = ["Aircraft", "Controlled inventory", "Spare parts", "Operational equipment"];

  return (
    <main className="min-h-screen bg-brand-background px-4 py-7 sm:px-7 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-brand-secondary">Squadron assets</p>
          <h1 className="text-3xl font-semibold text-brand-primary-dark">Inventory &amp; serviceability</h1>
          <p className="mt-2 text-sm text-brand-muted">Assigned aircraft, controlled inventory, and spare parts.</p>
        </header>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((itemCategory) => (
            <button
              key={itemCategory}
              type="button"
              onClick={() => { setCategory(itemCategory); setSelected(null); }}
              aria-pressed={category === itemCategory}
              className={`rounded-2xl border p-4 text-left shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary active:translate-y-0 ${category === itemCategory ? "border-brand-secondary bg-brand-secondary-light" : "border-brand-border bg-white"}`}
            >
              <p className="text-sm text-brand-muted">{itemCategory}</p>
              <p className="mt-1 text-2xl font-semibold text-brand-primary-dark">
                {inventory.filter((item) => item.category === itemCategory).length}
                <span className="ml-2 text-xs font-normal">records</span>
              </p>
            </button>
          ))}
        </section>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-brand-border bg-white px-3 transition-[border-color,box-shadow] duration-200 focus-within:border-brand-secondary focus-within:ring-2 focus-within:ring-brand-secondary/20">
            <Search aria-hidden="true" className="size-4 text-brand-muted" />
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setSelected(null); }}
              aria-label="Search inventory"
              placeholder="Search inventory, ID, location…"
              className="w-full py-3 text-sm outline-none"
            />
          </label>
          <select
            value={category}
            onChange={(event) => { setCategory(event.target.value); setSelected(null); }}
            aria-label="Filter inventory category"
            className="h-12 w-full rounded-xl border border-brand-border bg-white py-3 pl-3 pr-8 text-sm leading-normal transition-[border-color,box-shadow] duration-200 focus-visible:border-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/20 sm:w-[205px] sm:shrink-0"
          >
            <option>All categories</option>
            {[...new Set(inventory.map((item) => item.category))].map((itemCategory) => (
              <option key={itemCategory}>{itemCategory}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_290px]">
          <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
            <div className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary" role="region" aria-label="Inventory records table" tabIndex={0}>
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-brand-muted">
                  <tr>
                    {["Item", "Category", "Quantity", "Reserved", "Serviceability", "Location"].map((heading) => (
                      <th key={heading} className="px-4 py-3">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className={`cursor-pointer border-t border-brand-border transition-colors duration-150 hover:bg-brand-background ${selected?.id === item.id ? isLowStock(item) ? "bg-rose-100/80" : "bg-brand-secondary-light/50" : isLowStock(item) ? "bg-rose-50/70" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => setSelected(item)} aria-label={`Show details for ${item.name}`} className="block min-h-10 text-left focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary">
                          <b className="block text-brand-primary-dark">{item.name}</b>
                          <span className="font-mono text-xs text-brand-muted">{item.id}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3 tabular-nums">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-3 tabular-nums">{item.reserved} {item.unit}</td>
                      <td className="px-4 py-3">{item.serviceability}</td>
                      <td className="px-4 py-3">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!items.length && <div className="p-8 text-center"><p className="text-sm text-brand-muted">No inventory records match your filters.</p><button type="button" onClick={() => { setQuery(""); setCategory("All categories"); setShowLowStockOnly(false); setSelected(null); }} className="mt-3 min-h-10 rounded-lg px-3 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary">Reset filters</button></div>}
              {showLowStockOnly && (
                <p className="border-t border-brand-border bg-amber-50/60 px-4 py-2 text-xs font-medium text-amber-900" aria-live="polite">
                  Showing {items.length} low-stock {items.length === 1 ? "item" : "items"}.
                </p>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <button
              type="button"
              onClick={toggleLowStockFilter}
              aria-pressed={showLowStockOnly}
              aria-label={showLowStockOnly ? "Clear low stock filter" : "Show low stock items"}
              className={`group w-full rounded-2xl border p-5 text-left transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 active:translate-y-0 ${showLowStockOnly ? "border-rose-300 bg-rose-100/80 shadow-md" : "border-rose-200 bg-rose-50"}`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-semibold text-rose-950">
                  <AlertTriangle aria-hidden="true" className="size-4 shrink-0 text-rose-700 transition-transform duration-200 group-hover:scale-110" />
                  Low stock alert
                </span>
                <ArrowRight aria-hidden="true" className={`size-4 shrink-0 text-rose-800 transition-transform duration-200 group-hover:translate-x-1 ${showLowStockOnly ? "rotate-180" : ""}`} />
              </span>
              <span className="mt-2 block text-sm text-rose-900">
                {lowStockItems.length} records have two or fewer unreserved units or sets.
              </span>
              <span className="mt-3 block text-xs font-semibold text-rose-800">
                {showLowStockOnly ? "Showing flagged items · click to clear" : "Click to view flagged items"}
              </span>
            </button>

            <section className="hq-interactive-card group relative overflow-hidden rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-[#0b1f33] via-[#102d47] to-[#0b243b] p-5 text-white shadow-[0_18px_38px_-24px_rgba(5,20,35,.72)] transition-[border-color,box-shadow,transform] duration-200 hover:border-cyan-200/40 hover:shadow-[0_22px_42px_-24px_rgba(5,20,35,.82)]">
              <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-cyan-300/10 blur-3xl transition-transform duration-300 group-hover:scale-110" />
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-300/10 text-cyan-200 transition-colors duration-200 group-hover:bg-cyan-300/15"><Wrench aria-hidden="true" className="size-4" /></span>
                <h2 className="font-semibold tracking-tight text-white">Item details</h2>
              </div>
              {selected ? (
                <div className="relative mt-4 space-y-2 text-sm">
                  <p className="font-semibold text-white">{selected.name}</p>
                  <p className="text-slate-300">{selected.id} · {selected.category}</p>
                  <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-slate-100">
                    <p className="flex justify-between gap-3"><span className="text-slate-300">On hand</span><strong className="tabular-nums">{selected.quantity}</strong></p>
                    <p className="flex justify-between gap-3"><span className="text-slate-300">Reserved</span><strong className="tabular-nums">{selected.reserved}</strong></p>
                    <p className="flex justify-between gap-3"><span className="text-slate-300">Recorded unreserved</span><strong className="tabular-nums text-cyan-200">{getAvailableQuantity(selected)}</strong></p>
                  </div>
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/10 pt-3 text-slate-200"><span>{selected.serviceability}</span><span className="text-cyan-300/70">·</span><span>{selected.location}</span></p>
                </div>
              ) : (
                <p className="relative mt-3 text-sm leading-6 text-slate-300">Select a row to review its record.</p>
              )}
            </section>
          </aside>
        </div>
        <p className="mt-3 text-xs text-brand-muted" aria-live="polite">Showing {items.length} of {inventory.length} inventory records.</p>

      </div>
    </main>
  );
}
