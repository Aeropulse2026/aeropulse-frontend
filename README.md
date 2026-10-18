# VAYUNETRA standalone frontend

VAYUNETRA is an AeroPulse command-interface demonstration. This directory contains a standalone Next.js frontend with local, fictional records for Headquarters and Squadron Leader workflows. It does not require the original AeroPulse backend, ML service, database, Redis, or Celery.

## Included experience

The existing pages and route structure are preserved:

| Section | Routes |
| --- | --- |
| Entry | `/` (redirects to `/login`), `/login` |
| Headquarters | `/headquarter`, `/headquarter/fleet`, `/headquarter/fleet-overview`, `/headquarter/fleet/[id]`, `/headquarter/squadrons`, `/headquarter/assets`, `/headquarter/stats` |
| Squadron Leader | `/squadron`, `/squadron/fleet`, `/squadron/assets` |

The frontend includes shared navigation and section switching, aircraft detail and fleet views, inventory and maintenance summaries, filtering controls, charts, the fleet carousel, the responsive Headquarters network map, and local preview-role handling.

## Technology

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4
- MapLibre GL JS with a same-origin worker route
- Recharts, Motion, GSAP, Lucide icons, and the existing shadcn-based UI primitives
- npm and the checked-in `package-lock.json`

## Project layout

```text
src/app/                 App Router pages and local server routes
src/components/          Shared and section-specific UI
src/hooks/               Frontend hooks
src/lib/demo-data/       Canonical typed demonstration records and selectors
src/lib/command-network/ Map data types, adapter, and optional API adapter
src/lib/carto/           CARTO resource URL validation and rewriting
public/                  Logos, illustrations, and other static assets
docs/                    Frontend implementation notes
```

## Demonstration data

The standalone runs in local preview mode by default in development and production. The local login lets you choose Headquarters or Squadron Leader; the app's own `/api/demo-session` route stores that preview role in an HTTP-only cookie. This is a local role preview, not backend authentication.

Canonical records live under `src/lib/demo-data/`:

- `aircraft.ts` defines shared aircraft records and the common aircraft search/status selector.
- `headquarters.ts` defines airbase records and derives Headquarters fleet and airbase summaries.
- `squadrons.ts` contains squadron recommendation records.
- `squadron/data.ts` contains the Squadron identity, aircraft, maintenance tasks, inventory records, and fixed reference date.
- `squadron/selectors.ts` derives counts, available quantities, low-stock flags, search results, and filters from those records.
- `command-network/demo-command-network.ts` provides map locations and map summary records; the adapter applies map filters and selection.

To add a demonstration aircraft or inventory item, update the relevant canonical fixture and keep identifiers unique. Add or update references in the maintenance, squadron, airbase, or map records as needed. Keep derived counts in selectors rather than hardcoding copies into pages. Run `npm test`, TypeScript, and lint after changing fixtures. These values are fictional demonstrations, not verified operational records.

The optional `src/lib/command-network/api.ts` adapter remains in the source but is not called in the default standalone demo mode. No backend URL is required. The map uses its local location fixtures in demo mode and does not infer aircraft positions from squadron/base text.

## Map and environment

The India command map uses the existing MapLibre implementation and local marker fixtures. CARTO supplies the basemap style and resources through the standalone app's server-side `/api/carto/proxy` route. The server route validates permitted CARTO hosts and rewrites map resources to remain same-origin. The CARTO key is read only on the server and must never be placed in a `NEXT_PUBLIC_` variable.

Copy `.env.example` to `.env.local` when you want to explicitly set the demonstration mode or configure the basemap:

```bash
cp .env.example .env.local
```

Environment variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_AEROPULSE_DEMO_MODE` | Defaults to local preview mode. Set `false` only if integrating a separate authentication system. |
| `NEXT_PUBLIC_AEROPULSE_MAP_MODE` | Defaults to `demo`; local map markers are used. `api` enables the retained optional API adapter. |
| `CARTO_BASEMAP_API_KEY` | Optional server-only credential for CARTO basemap resources. Keep it out of browser-visible variables and source control. |

Without a valid CARTO key or network access, the map displays its map-specific error and retry state; other pages and local demonstration data remain usable. The basemap requires access to CARTO's configured map resource hosts. Attribution for OpenStreetMap and CARTO is included on the map.

## Install and run

Requirements: Node.js compatible with Next.js 16 and npm.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The entry route redirects to `/login`; choose a preview role and enter its section. No backend process is needed.

For an optimized production run:

```bash
npm run build
npm run start
```

The default demo-mode behavior also applies to production builds. If you set `NEXT_PUBLIC_AEROPULSE_DEMO_MODE=false`, the app will require an authentication integration that is not included in this standalone demonstration.

## Checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` runs the repository's command-network and demo-data integrity checks. There is no browser automation suite bundled with this project.

## Demonstration-only behavior and limitations

- Search, filters, charts, carousel navigation, record selection, and summaries operate on local fixture records.
- Preview-role switching is local to this Next.js app and does not grant backend permissions.
- Write-like backend operations are not represented as persisted successes. No backend work-order, inventory reservation, approval, upload, or aircraft update is performed.
- Fleet and map records are fictional demonstration data. The UI does not claim live tracking or verified operational status.
- The basemap is an external CARTO resource and needs network access plus a server-side key. Local records and the rest of the application remain independent of it.
- The API adapter is retained for compatibility, but configuring API mode can contact the URL supplied by `NEXT_PUBLIC_API_BASE_URL`; leave map mode as `demo` for a backend-independent presentation.
