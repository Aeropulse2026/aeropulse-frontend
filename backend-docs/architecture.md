# Integrated architecture

## Ownership and call flow

The Django backend owns request handling, authentication and authorization, database access, existing business rules, and API compatibility. The `aeropulse_ml` package owns its schemas, feature/inference contract, scoring, explainability, and advisory recommendations. `fleet.feature_service` constructs point-in-time candidates from persisted telemetry; `fleet.ml_inference` validates inputs/outputs, loads artifacts, and maps supported results to the existing `Prediction` model.

The local ML package dependency is pinned to the in-repository `ml/` project in `backend/pyproject.toml` and `backend/uv.lock`. The `ml/models` relative symlink points to the one top-level `models/` store for ML project-relative tests and utilities. Required YAML files are included in the built ML wheel. Model paths are explicit environment settings populated portably by `scripts/use-local-artifacts.sh`.

For the controlled demonstration, `import_synthetic_ml_bundle` calls the local generator, validates the complete generated content and source rows, then writes the synthetic import, aircraft/components, telemetry, and predictions inside a database transaction. Scoring uses only records at or before each observation. The adapter's model bundles are lazily loaded from explicit artifact paths and cached per process under locks. Inference is serialized within a process. Prediction persistence uses a fingerprint of component, model version, and canonical input as a unique idempotency key.

## Ordinary telemetry upload

The existing public upload route, serializer, response fields, and callback timing remain unchanged. Ordinary uploaded files are retained and inspected for structure/readiness; CSV text is not converted into telemetry rows and does not invoke model inference. An unsigned uploaded manifest is not trusted as provenance. This separation prevents a filename or caller-provided hash from unlocking the synthetic-only feature mapping.

## Prediction and maintenance behavior

Only output fields with matching existing semantics are persisted: model version, anomaly score, failure-risk score, maintenance-due score, parts-risk score, health score, priority score, and the existing list-shaped rule explanation field. The risk API retains its established response shape. Other ML output remains available to the adapter result but is not persisted or exposed by changing that contract. Recommendations are advisory; human approval remains authoritative.

## Migrations and local data

The backend includes additive migrations for prediction idempotency and controlled synthetic provenance/daily telemetry fields. The integrated test suite uses an in-memory SQLite test database. Apply migrations manually only to a selected local database after review; this project performs no hosted migration or deployment.

## Trust and limits

The controlled command generates its bundle in-process in a new temporary directory and verifies manifest schema, expected file inventory, hashes, digest, rows, and public ML input validation. This verifies byte consistency and reproducibility, not cryptographic authenticity. The dataset is fabricated synthetic data and makes no claim to model actual aircraft sensors. Model metadata remains `approved_for_production: false`.
