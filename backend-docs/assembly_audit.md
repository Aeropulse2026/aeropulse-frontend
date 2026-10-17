# Assembly baseline and integrity record

## Source baseline

Assembly source paths:

- Backend: `/home/chirag/projects/Aeropulse/Aeropulse-BE/aeropulse-backend`
- Organized ML: `/home/chirag/projects/Aeropulse/Aeropulse-AI`
- Integrated copy: `/home/chirag/projects/Aeropulse/Aeropulse-Integrated`

The workspace/ML Git checkout was on `main`, commit `b056254853d593f05235ac10d0518ab0f5732b9f`, remote `origin` pointing to the configured AeroPulse AI repository. The backend nested checkout was on `main`, commit `2ff6b2b1eb53d8b6de959e9543b961ad6eeb7ff2`, remote `origin` pointing to the configured backend repository. The source worktrees already contained local changes. In particular, former ML root-layout paths appeared deleted and `Aeropulse-AI/` appeared untracked; this is the intentional organization and was preserved. No Git publication or history-changing command was run.

## Artifact hashes

| Artifact | Source SHA-256 | Integrated SHA-256 | Result |
|---|---|---|---|
| `models/production/aeropulse_xgboost_v1.1.0.joblib` | `5f135a5a48303528e41550f8a48dbd686d5982fc23fac0976106b699f8e8863c` | `5f135a5a48303528e41550f8a48dbd686d5982fc23fac0976106b699f8e8863c` | Match |
| `models/production/aeropulse_xgboost_v1.0.0.joblib` (retained legacy compatibility test artifact) | `b47276872855661494e79ad0e50aaa38791a936e59fb855e8399c465929ba646` | `b47276872855661494e79ad0e50aaa38791a936e59fb855e8399c465929ba646` | Match |
| `models/candidate/isolation_forest_v1.1.0.joblib` | `d9a1242f7281f113bd153f9b4c141a55dca430ca83343bc58993b4aff721930c` | `d9a1242f7281f113bd153f9b4c141a55dca430ca83343bc58993b4aff721930c` | Match |

The copied metadata continues to declare `approved_for_production: false`.

## Assembly selection

Included backend project/apps, migrations, tests, scripts, Bruno API collection, relevant docs, and `data/fabricated/` because the backend README and upload request collection refer to that sample fixture. Included ML source, package metadata, YAML configuration, schemas, examples, tests, scripts, and Markdown docs. Included the two current adapter artifacts and the v1.0 XGBoost artifact required by the retained legacy compatibility test. `ml/models` is a relative symlink to the top-level artifact directory, so there is one copy of each model.

Excluded source `.git` directories, databases, media uploads, virtual environments, Python/test caches, build output, egg-info, the 144 MB generated ML evaluation feature table, other generated ML datasets, and generated evaluation/coverage reports. ML tests now build their deterministic feature fixture under a temporary directory using the existing generator and feature builder. The retained ML metadata includes a checksum for an optional Logistic Regression candidate that is not included, plus a reference to an omitted historical evaluation report; neither is used by backend inference. No original source file was moved or removed.
