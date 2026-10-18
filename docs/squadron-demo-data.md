# Squadron Leader demonstration data

## Coverage and source

The three Squadron Leader page routes are `/squadron` (Overview), `/squadron/fleet` (Fleet Overview), and `/squadron/assets` (Assets). They use local fictional demonstration records and do not make backend requests. The readiness/utilization report and searchable maintenance review queue are expandable sections on `/squadron`. Aircraft details open in an accessible dialog within `/squadron/fleet`. The old `/squadron/maintenance` and `/squadron/fleet/:id` paths redirect to those in-page experiences. The independent Squadron aircraft, identity, tasks, stock, and selectors live in `src/lib/demo-data/squadron/`. The shared `src/lib/demo-data/aircraft.ts` fixture remains separate.

The Squadron pages select the local demo source directly in their route/data access imports. There is no environment switch because the Squadron pages currently have no live API integration to toggle; adding one would imply an API-backed Squadron mode that does not exist. The `SQUADRON_DATA_PROVENANCE` label is the shared provenance text. Pages show a restrained demo label or explanatory sentence and the dashboard, details, maintenance, inventory, and reports surface it explicitly.

## Updating records

- Add aircraft to `demoSquadronAircraft` using the existing `AircraftRecord` shape and the correct fictional `squadronId`.
- Add maintenance records to `demoMaintenanceTasks` and use an existing aircraft ID. `requiredPartId`, when present, must match a stock record ID. A completed record should include a valid `completedAt` date at or after its scheduled date.
- Add stock records to `demoInventory`; keep `reserved <= quantity`, include units, and set a reorder point only where the interface needs it. Zero stock is represented by both on-hand and reserved quantities set to zero.
- Extend `getSquadronSummary` or selectors rather than repeating totals or filtering rules inside JSX. Summary values are computed from the selected aircraft and task records.
- Keep selectors pure; the page may filter returned arrays without mutating the canonical fixtures.

The integrity tests in `src/lib/command-network/command-network.test.mjs` check IDs, relationships, dates, aggregate values, search, low-stock calculation, and selector non-mutation. Run them with `npm test` from the frontend directory.

## Interaction boundaries

Fleet search/status filters, aircraft detail dialogs, maintenance search/status filters, inventory search/category/low-stock filters, and expandable dashboard sections are read-only interactions over local fixtures. The inventory detail panel reports recorded unreserved quantity only; it does not reserve or change stock. Maintenance tasks are review records, not persisted work orders. Approval, work-order creation, booking, completion, upload, and stock update actions are unavailable in this preview and are not simulated. Refresh resets page-local filters/selections.

## API separation

The command-network API adapter is retained for reference but is not used by Squadron pages or by the standalone's default map mode. If an operator explicitly enables the optional API map mode, the adapter keeps unconfigured, empty, unauthorized, and error states distinct and does not fall back to these fixtures. These local records are fictional demonstrations, not verified operational records.
