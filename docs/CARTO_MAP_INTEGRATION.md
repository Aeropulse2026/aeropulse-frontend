# CARTO India Map Integration

## Architecture and data flow

`IndiaCommandMap` is a client component in the Headquarters dashboard. It loads MapLibre GL JS only after mount, creates one map instance, attaches markers and controls, and removes markers, popups, observers, event handlers, and the map on cleanup. MapLibre's stylesheet is imported by `src/app/globals.css`.

The live data adapter calls the verified `GET /api/fleet/overview` endpoint and normalizes its five aggregate fields. The map does **not** convert fleet aircraft, squadron records, or text base names into coordinates. In API mode the basemap is centered on India and the overview shows backend values; the location layer remains empty until the backend supplies an authorized location contract with coordinates. A failed request never substitutes sample metrics.

The former SVG implementation remains in `src/components/legacy-india-command-map.tsx`. Its sample locations and counts are also kept, separately typed with `source: "demo"`, in `src/lib/command-network/demo-command-network.ts`. They render only in demo mode and are labelled synthetic in the map, panel, and summary. The retained positions are illustrative positions from the previous frontend demo, not backend geodata and not statements of current deployments.

## Verified backend contracts

The authoritative handoff is [`backend-docs/FRONTEND_INTEGRATION_GUIDE.md`](../backend-docs/FRONTEND_INTEGRATION_GUIDE.md). I cross-checked its routes and fields against the integrated backend's `backend/router.py`, `fleet/views.py`, `fleet/serializers.py`, `fleet/models.py`, `squadron/serializers.py`, and `maintenance/serializers.py` in the documented integrated repository.

| Endpoint | Fields used here | Notes |
| --- | --- | --- |
| `GET /api/fleet/overview` | `aircraft_total`, `mission_ready`, `at_risk`, `average_health_score`, `pending_work_orders` | The only endpoint consumed by this map. Values remain nullable if missing or malformed. |

The verified API has no airbase/facility collection with coordinates and no aircraft list. `Aircraft.base` and squadron `base` are text fields. `GET /api/fleet/aircraft/{aircraft_id}/risk` is available only for a known aircraft ID; it does not include facility context or create a location relationship. Inventory is global rather than base-specific. Maintenance records likewise do not establish a verified facility location. Therefore this map does not display facility, fleet, inventory, maintenance, or ML markers/metrics as if they belonged to a location. See [`AIRBASE_PARTS_MAINTENANCE_AUDIT.md`](../backend-docs/AIRBASE_PARTS_MAINTENANCE_AUDIT.md), [`DATABASE_AUDIT_REPORT.md`](../backend-docs/DATABASE_AUDIT_REPORT.md), and [`INDIAN_AVIATION_DEMO_DATA.md`](../backend-docs/INDIAN_AVIATION_DEMO_DATA.md) for schema and provenance limitations.

No pagination is configured for the verified list endpoints. The current overview is a single object. Runtime normalization handles non-2xx responses, unauthorized responses, invalid JSON, malformed values, null health score, and an empty fleet as separate UI states.

## Data modes

- **Development default:** the current frontend preview enables the synthetic map to preserve the existing demo experience. `NEXT_PUBLIC_AEROPULSE_MAP_MODE=api` forces API mode even when the demo login preview is enabled.
- **API mode:** set `NEXT_PUBLIC_AEROPULSE_MAP_MODE=api` and `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api`. `NEXT_PUBLIC_API_BASE_URL` is a URL, not a credential. Statistics come only from `/fleet/overview`; missing configuration, loading, empty, unauthorized, network, and API errors are shown distinctly.
- **Explicit demo mode:** `NEXT_PUBLIC_AEROPULSE_MAP_MODE=demo` enables synthetic positions and figures. Production use of the demo requires intentionally enabling it. No API failure can switch the component into demo mode.
- A user-triggered refresh reloads overview data. Successful responses show their local fetch time. The client does not send cookies or tokens. Current backend documentation and source show `AllowAny` as the global permission class for these reads; this is a backend security limitation, not proof of authorization. The existing frontend role preview cookie is not backend authentication.

For local API requests, configure Django CORS for the exact browser origin (for example, `http://localhost:3000`) as described by the backend guide. These map requests are read-only GETs, so they do not require CSRF tokens. Do not enable unsafe write flows through this map. The backend's CORS and permission policy must be tightened by the backend/security owner before production use; this frontend does not weaken or emulate those controls.

## CARTO Positron, API key, and attribution

The configured style is CARTO Positron:

`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`

The style endpoint was verified as a JSON resource and CARTO currently documents MapLibre vector styles, a CARTO-issued key, service quotas, and attribution. Current terms require a valid CARTO-issued basemap key; requesting a key also accepts CARTO's basemap terms. Do not rely on unkeyed tiles. Request a key from [CARTO Basemaps API keys](https://www.carto.com/basemaps/apikey/) and confirm that the intended hackathon/deployment use fits CARTO's current terms and quota. CARTO currently states monthly free-tier limits of 5 million requests for non-commercial use and 1 million for commercial use; these terms can change.

To avoid embedding the key in source or exposing it in `NEXT_PUBLIC_*`, the same-origin Next route `src/app/api/carto/proxy/route.ts` fetches CARTO resources with the server-only `CARTO_BASEMAP_API_KEY`. It permits only CARTO's style, font, TileJSON, and verified `tiles-a` through `tiles-d` vector-tile hosts and paths, rewrites resource URLs through the proxy, strips echoed key parameters, preserves MapLibre glyph and tile placeholders, and rejects redirects and other hosts. Configure the key in the Next server environment (or an untracked local `.env.local`):

```dotenv
CARTO_BASEMAP_API_KEY=your-issued-key
```

Never commit the actual key. The CARTO key is used by the frontend server, so browser Referer restrictions will not match these upstream requests; coordinate a suitable egress-IP restriction with CARTO if the deployment has stable egress. Add a hosting-layer rate limit to `/api/carto/proxy` and monitor CARTO usage. Requests have a 15-second upstream timeout. The deployment must allow outbound HTTPS to `basemaps.cartocdn.com`, `tiles.basemaps.cartocdn.com`, and the verified `tiles-a` through `tiles-d` hosts.

MapLibre's visible attribution control includes `© OpenStreetMap contributors` linked to OpenStreetMap copyright and `© CARTO` linked to CARTO attribution. Keep it visible and do not hide it behind a menu or low-contrast overlay. The previous DataMeet boundary is retained only by the legacy SVG component; the CARTO implementation does not load or upload that boundary.

## Run and verify locally

1. Install dependencies with the repository's npm lockfile: `npm install`.
2. Start the Django backend as described in its integration guide, on an isolated local database and with synthetic/non-operational data only.
3. Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_AEROPULSE_MAP_MODE=api`; set `CARTO_BASEMAP_API_KEY` server-side.
4. Start this frontend with `npm run dev`, then open the Headquarters page. Verify the same-origin CARTO proxy returns the style, attribution is visible, `/api/fleet/overview` returns the expected fields, and no location markers appear in API mode.
5. For the synthetic view, set `NEXT_PUBLIC_AEROPULSE_MAP_MODE=demo` (or use the existing development preview default). Confirm every marker and value is labelled synthetic.
6. Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

The source tree reviewed for this integration contained no frontend test framework. The focused tests use the installed TypeScript compiler's `transpileModule` API to place the adapter in a temporary directory, then run assertions with Node's built-in `assert` module. A successful local build cannot verify a live CARTO key, browser CORS policy, or the availability/content of a running backend.

## Known gaps and next steps

The backend needs a reviewed, permission-scoped location API with stable IDs, category, validated longitude/latitude, source/provenance and update time before live markers can be shown. It also needs explicit relationships if fleet, asset, maintenance, inventory, or prediction details are to be associated with a facility. Do not infer these joins from matching text. The current map does not show ML scores because the risk route is aircraft-specific and the overview contains no ML fields. Existing backend docs report optional authentication, `AllowAny` permissions, uninitialized local data, and synthetic-only operational fixtures; those remain material limitations.

The CARTO key must be requested/configured manually. The map's actual CARTO tile load could not be verified without an issued key. No live backend API integration was claimed during this implementation; API contract handling is implemented and unit-tested, but a reachable authorized backend was not available for end-to-end verification.
