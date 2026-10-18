# Standalone frontend status

This documentation applies only to this standalone frontend directory. It has no Git repository metadata and does not depend on the source workspace or its backend/ML projects. Setup and commands are maintained in the root [README](../README.md).

## Current application

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- Local preview mode is enabled by default for development and production. The preview role cookie is local navigation state, not authentication or authorization for an external service.
- Headquarters and Squadron Leader records are supplied by the typed fixtures under `src/lib/demo-data/` and `src/lib/command-network/demo-command-network.ts`.
- The optional command-network API adapter is retained, but the default map mode uses local demonstration records and does not call the original backend.
- CARTO basemap assets use the app's same-origin server proxy. The CARTO credential is server-only and optional; without a usable key, only the map shows its retryable error state.
- Write-like operational actions are not persisted or simulated as successful.

## Existing page routes

| Area | Routes |
| --- | --- |
| Entry | `/` (redirects to `/login`), `/login` |
| Headquarters | `/headquarter`, `/headquarter/fleet`, `/headquarter/fleet-overview`, `/headquarter/fleet/[id]`, `/headquarter/squadrons`, `/headquarter/assets`, `/headquarter/stats` |
| Squadron Leader | `/squadron`, `/squadron/fleet`, `/squadron/assets` |

The older Squadron maintenance, reports, and aircraft detail paths redirect to their consolidated in-page destinations. Route redirects are configured in `next.config.ts`.

## Checks

From this directory, run `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`. The test script covers fixture integrity, selectors, source/error distinctions, map data, section destinations, and proxy URL behavior. Browser tests are not included.
