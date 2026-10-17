# AeroPulse frontend implementation status

## Current workspace

- Framework: Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4.
- Package manager files: `bun.lock` and `package-lock.json` are present. Neither was changed.
- Existing UI: login, Headquarters dashboard, fleet carousel, and airbase profile cards.
- Git root: `C:/aeropulse-frontend`; branch: `main`; working tree was clean before this work.
- This is a frontend-only repository. No backend source, API contract, handover documentation, or API base URL was supplied.

## Route and module conventions

Keep URL composition in `src/app/` and feature-owned UI/data logic in `src/features/`.

| Area | Route | Owner |
| --- | --- | --- |
| Authentication | `/login` | `src/features/auth/` |
| Headquarters overview | `/headquarter` | `src/features/headquarters/` |
| Headquarters fleet | `/headquarter/fleet` | `src/features/headquarters/` |
| Headquarters assets | `/headquarter/assets` (existing route currently uses `/assest`) | `src/features/headquarters/` |
| Squadron overview | `/squadron` | `src/features/squadron/` |
| Squadron fleet | `/squadron/fleet` | `src/features/squadron/` |
| Squadron assets | `/squadron/assets` | `src/features/squadron/` |

Shared primitives belong in `src/components/ui/`, shell primitives in `src/components/layout/`, API transport in `src/lib/api/`, and session/role types in `src/lib/auth/`. Feature modules must consume shared services and must not import each other's page components.

## Backend integration boundary

The browser-selected role is a login hint only. It must never authorize a route. A production session must come from the backend and include a verified role. The server-side session boundary should use secure, HTTP-only cookies and should validate authorization on protected data requests. Frontend route checks are only a navigation aid.

No endpoint path or payload has been assumed because the backend contract is absent. Before wiring authentication and operational pages, provide the backend login/session/logout contract, role values, endpoint schemas and permission rules. Likewise, fleet, airbase, telemetry, maintenance, inventory, and prediction views must render from the corresponding API response or an explicitly enabled, visibly labeled demo fixture.

The ML outputs are advisory. The existing project brief says current ML artifacts are not approved for production; do not present them as safety determinations.

## Current limitations

- Development runs in an explicit, visibly labeled preview by default. Set `NEXT_PUBLIC_AEROPULSE_DEMO_MODE=true` to enable the preview in other environments.
- Demo role selection only opens a sample interface; it is not authentication. The preview cookie is only for role-specific navigation and must not be used as a production security boundary.
- Real sign-in is unavailable until a backend is connected; production without demo mode reports this and does not create a fake session.
- Forgot-password is unavailable until the backend exposes recovery.
- Existing Headquarters fixture content is illustrative/demo content, not live operational data.
- Backend verified role authorization, live data, and operational actions remain unimplemented pending contracts and integration work.

## Dashboard and fleet preview upgrade

- The app has three isolated route modules: `/login`, `/headquarter/*`, and `/squadron/*`. HQ and Squadron Leader each render their own navigation and session controls. A role mismatch returns to Login; module detail links require an explicit module-local destination.
- Headquarters `/headquarter` now displays a locally bundled, simplified DataMeet India Survey of India boundary (CC BY 4.0), selectable command/base markers, and a location detail panel. Marker positions and all unit statistics are illustrative. The boundary is for geographic illustration, not operational navigation; source caveats and attribution are displayed with the map.
- Headquarters `/headquarter/fleet` and Squadron Leader `/squadron/fleet` use the shared `SkewedCardCarousel` and `FleetBrowser`. Search, status filters, previous/next buttons, keyboard arrows, pointer/touch swipes, and aircraft detail links are implemented. The aircraft visual is a stylized SVG icon/diagram because no authorized aircraft image assets were supplied.
- Headquarters `/headquarter/squadrons` shows ten synthetic squadrons, assigned/operational aircraft, personnel strength, readiness, role, base, and maintenance counts. Its recommendation panel uses disclosed rule weights and is not an AI service or operational tasking decision.
- Squadron Leader `/squadron` includes responsive readiness, flight-hour, utilization, and maintenance sample charts, plus shortcut links, activity, and attention panels. `/squadron/maintenance` exposes transparent rule flags; `/squadron/reports` provides a demo roll-up.
- Squadron Leader `/squadron/assets` has category summaries, searchable/filterable inventory records, row selection/details, reserved quantities, and low-stock alerts. Controlled stock uses generic synthetic labels only.
- Shared synthetic aircraft/squadron data lives under `src/lib/demo-data/`. The GeoJSON boundary is simplified from DataMeet's `Country/india-soi.geojson` distribution and has visual-only use; its source warns that boundary data may contain errors. See [DataMeet maps](https://github.com/datameet/maps) for source and license context.

## Verification

- `npm run lint` passes.
- `npx tsc --noEmit` passes.
- `npm run build` passes. Recharts charts use an initial server-render size, then resize responsively in the browser.

## Running the current preview

Run `npm run dev`, open `http://localhost:3000/login`, choose Headquarters or Squadron Leader, then select **Enter preview**. Development mode enables this preview automatically. For a production build, set `NEXT_PUBLIC_AEROPULSE_DEMO_MODE=true` only when intentionally serving the demo interface. The demo cookie and preview values are local development scaffolding, not an authentication system.

`npm run lint` and `npm run build` both pass. The role landing pages, logout, role mismatch redirect, and unauthenticated deep-link redirect were checked in the local browser.
