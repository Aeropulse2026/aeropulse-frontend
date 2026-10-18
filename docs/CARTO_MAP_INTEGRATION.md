# Headquarters map

## Data and map structure

`src/components/india-command-map.tsx` loads MapLibre after mount, keeps one map instance, adds the local marker fixtures, and cleans up map resources on unmount. The container has responsive heights and resize handling. The MapLibre worker is served by the standalone app at `/maplibre-worker`.

The default standalone map mode is `demo`. Location markers and selected-location summaries come from `src/lib/command-network/demo-command-network.ts`; filters and selection use the adapter in the same directory. Marker records are fictional locations and are not inferred from aircraft-to-base text or physical aircraft positions. The retained API adapter is optional and is not called in default demo mode.

## CARTO proxy and credential

The map uses the CARTO Positron style through the app's server route at `src/app/api/carto/proxy/route.ts`. The route validates allowed CARTO resource hosts and paths, rewrites style, sprite, glyph, and tile resources to same-origin proxy URLs, and does not return the credential to the browser. Keep `CARTO_BASEMAP_API_KEY` server-only; never use a `NEXT_PUBLIC_` name or put the key in source, URLs, browser logs, or screenshots.

To configure a basemap key, add it to the local server environment (for example, `.env.local`, which is ignored by `.gitignore`):

```dotenv
CARTO_BASEMAP_API_KEY=your-issued-key
```

The map requires outbound HTTPS access to the configured CARTO hosts. Without a valid key or network access, the map displays its local error and retry UI; the rest of the app and its local data continue to work. The visible map attribution credits OpenStreetMap and CARTO and should remain unobscured.

## Local verification

1. Run `npm ci` and `npm run dev` (or build and start as described in the root README).
2. Open Headquarters and select a local marker to inspect its fixture details.
3. Search or toggle location categories, use reset/fit controls, and confirm the marker count follows visible locations.
4. Without `CARTO_BASEMAP_API_KEY`, confirm the map-specific unavailable state appears and the rest of the dashboard remains usable. With a valid key and network access, confirm the CARTO basemap and attribution render.
5. `npm test` covers proxy URL validation and map fixture/summary consistency. Automated browser tests are not included.
