# Indian Aviation Demo Data

**Classification:** `SYNTHETIC — NON-OPERATIONAL` for all scheduling and operational values.  
**Fixture:** [`dev/indian_aviation_demo/scenario.json`](../dev/indian_aviation_demo/scenario.json)

## Identity references and provenance

The fixture carries repository source pointers to public AAI pages/PDFs for three Indian aviation locations and Government of India Press Information Bureau (PIB) pages for three aircraft types:

| Stable demo ID | Name currently carried by the fixture | Location | Source pointer | Verification state |
| --- | --- | --- | --- | --- |
| `IN-DEMO-HINDON` | Hindan Air Force Station (Hindon civil enclave) | Ghaziabad, Uttar Pradesh | [AAI Hindon page](https://www.aai.aero/en/airports/hindon) | Awaiting direct source verification; exact spelling and civil-enclave relationship must be checked. |
| `IN-DEMO-AMBALA` | Indian Air Force Station Ambala | Ambala, Haryana | [AAI airport details PDF](https://www.aai.aero/sites/default/files/DETAILS-UNSERVED-AS-ON22NOV16.pdf) | Awaiting direct source verification; exact official station name must be checked. |
| `IN-DEMO-PUNE` | Pune (Lohegaon) civil enclave / airfield | Lohegaon, Pune, Maharashtra | [AAI Pune page](https://www.aai.aero/en/node/2685) | Awaiting direct source verification; exact public name/location must be checked. |

Coordinates are absent for every base. These are candidate public identity references, not claims of military readiness, access, capacity, or service availability. The links above already existed in the project fixture; no pages were fetched during this work, so the repository does not contain source captures proving the displayed names. Verify the identity against those sources before treating it as confirmed.

Aircraft type references are `Light Combat Aircraft (LCA) Tejas Mk1`, `C-295MW`, and `Hindustan Turbo Trainer-40 (HTT-40)`, with PIB source pointers in the JSON fixture. The reference records are types only; `AP-901`–`AP-905` are fictional demo assets, not real aircraft or tail numbers. Their type links are explicitly synthetic mappings and do not assert real fleet assignment, basing, or maintenance compatibility. The `AP-100`/`AP-200`/`AP-300` values remain ML fixture categories used to preserve the existing inference contract.

The part names are generic demo categories such as “hydraulic system service kit”, “engine bearing service set”, and “avionics cooling service module”. No manufacturer part numbers, official nomenclature, or airframe compatibility are claimed. The project does not contain reliable public evidence for those details. They remain synthetic catalogue entries.

## Synthetic operations

Every operational value in the fixture is invented for deterministic demonstration and must not be presented as real:

- Three fictional fleets, five fictional aircraft assets, and their home-base/type mappings.
- Base-specific stock and reservations; the values are not inventory reports.
- Fleet-to-base flight hours; these are not routes, dispatch estimates, or aircraft performance claims.
- One competing-fleet occupancy interval and the search horizon.
- The pending work order, its part quantity, seven telemetry observations, and optional artifact-backed predictions.
- Completed/planned maintenance examples, completion timestamps, and the 180-day illustrative interval and 30-day “due soon” threshold.

The illustrative maintenance policy is not an approved aviation standard. `unknown` is returned if there is no explicitly completed timestamp or valid interval. Work-order creation time and planned timestamps are not treated as completion history. Due status is calculated separately from ML failure risk.

The scheduler fixture demonstrates that Ambala lacks the required part quantity, Hindon has a synthetic occupancy conflict for early windows, and Pune has a feasible 72 elapsed-hour candidate with its synthetic stock/travel evidence. The reducer ranks only eligible candidates by supplied flight hours, then start time and stable base ID. Missing/incomplete evidence yields `insufficient_data`. It returns at most three candidates and creates no booking, reservation, approval, or maintenance execution.

Run the isolated scheduler tests from the integrated project root:

```sh
python3 -B -m unittest discover -s dev/maintenance_slot_prototype -p 'test_*.py' -v
python3 -B -m unittest dev.indian_aviation_demo.test_scenario -v
```

The prototype remains pure Python and disconnected from Django. Its evidence snapshots are fabricated test scaffolding, not verified source freshness claims.

## Integrated schema

The existing canonical records are reused:

- `fleet.Aircraft`, `AircraftComponent`, and `InventoryPart` remain the aircraft, component, and part catalogue.
- `fleet.TelemetryImport`, `TelemetryRecord`, and `Prediction` remain the telemetry and ML output entities. The seed labels its import manifest synthetic and does not alter the inference contract or model artifacts.
- `fleet.WorkOrder` remains the human-reviewed work task; the seeded example stays pending and has no approval timestamp.
- `maintenance.MaintenanceTask` and `maintenance.AssetPart` remain existing APIs/models; neither is repurposed as a fabricated completed event.

The additive `demo_data` app supplies demo-only relationships missing from the existing schema: public airbase identity references, type references, demo fleets and aircraft assignment, base-specific synthetic stock, synthetic travel hours, synthetic occupancy intervals, multi-part work-order quantities, and explicit synthetic maintenance-history events. `DemoFleetAircraft.public_type_reference` links the fictional asset to a public aircraft type reference but is labeled a synthetic mapping. No equivalent production airbase/fleet/location model existed, and these models are not connected to production APIs or scheduling. The ML `Prediction` model is reused; no second prediction entity is introduced.

`DemoMaintenanceRecord` stores an explicit status, completion timestamp, optional work-order link, maintenance type, and illustrative interval. Only rows explicitly marked completed with a completion timestamp count as completion history. This demo history model is not an approved operational maintenance log.

## Fresh isolated database setup

The standard settings are unchanged. The demo settings select SQLite only under `backend/data/demo/`. Two demo database files already existed during inspection and are intentionally not overwritten. Choose a new filename that does not already exist:

```sh
cd /home/chirag/projects/Aeropulse/Aeropulse-Integrated
AEROPULSE_DEMO_DATABASE=/home/chirag/projects/Aeropulse/Aeropulse-Integrated/backend/data/demo/indian_aviation_demo_local.sqlite3 \
  python3 backend/manage.py initialize_indian_demo --settings=config.demo_settings
```

This command applies the checked-in Django migrations to the new file and seeds the deterministic fixture. It refuses an existing file, any path outside `backend/data/demo/`, and `backend/db.sqlite3`; rerunning against the same filename therefore stops without modifying it. To initialize again, choose another unused filename. It is a manual command and does not run at application startup. Do not use hosted database credentials with it. The demo settings are explicit; normal application commands continue using `config.settings` and their existing configuration.

An instance was initialized at [`backend/data/demo/indian_aviation_demo.sqlite3`](../backend/data/demo/indian_aviation_demo.sqlite3) during this task. It contains three airbase references, five synthetic assets, three synthetic parts, five fleet assignments, nine base-stock rows, five maintenance-history examples (four completed and one planned), five work orders, and seven telemetry rows. It has **zero prediction rows** because `--with-inference` was not requested. The other two demo database files already present in the project were not opened or changed.

To use the demo database for another management command, pass `--settings=config.demo_settings` and set `AEROPULSE_DEMO_DATABASE` to the initialized path. To return to existing behavior, omit both and use the normal `config.settings`. Do not apply migrations to an existing database as part of demo setup.

`--with-inference` is optional and requires explicit paths to the already-present model artifacts via `AEROPULSE_XGBOOST_ARTIFACT` and `AEROPULSE_ANOMALY_ARTIFACT`; it uses only the synthetic telemetry fixture. Without that flag, the seed stores telemetry and leaves predictions absent. Neither path automatically approves or books maintenance.

## Limitations

This dataset is useful for UI, relationship, and deterministic rule demonstrations only. Airbase names still require source-page verification; aircraft-type-to-asset links, part categories/compatibility, fleets, stock, routes/hours, occupancy, telemetry, work orders, maintenance history, and due policy are synthetic. No actual operational availability or aircraft maintenance behavior has been validated. Human review remains required for any future decision workflow.
