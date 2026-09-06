## Why

Okoscope now discovers Kubernetes releases automatically, but the Web UI still presents every Release as a single manually declared deployment and hides the revision and episode evidence behind it. Operators need an evidence-accurate view that distinguishes immutable image identity, Kubernetes revisions, and repeated deployment episodes without overstating rollout intent, traffic allocation, or rollback certainty.

## What Changes

- Show whether each immutable Release is `manual` or `observed` while preserving the existing legacy manual Release experience.
- For observed Releases, show image identity plus revision and active-episode counts.
- Add cursor-paginated deployment episode history with state, transition kind, lifecycle timestamps, Ready Pod counts, and `ready_pod_share`.
- Represent simultaneous revisions as concurrent observations and explicitly state that Ready Pod share is neither traffic share nor proof of canary or A/B deployment intent.
- Label returns to an older immutable Release as `rollback candidate`, not as a confirmed rollback.
- Display the backend-provided `baseline_selection_source` in Runtime Diff while retaining explicit baseline selection.
- Synchronize the committed OpenAPI contract from the backend and regenerate contract-derived TypeScript API types.
- Add automated coverage for manual and observed Releases, concurrent revisions, rollback candidates, and nullable or empty Kubernetes metadata.

## Capabilities

### New Capabilities

- `deployment-episode-visibility`: Application-scoped presentation and pagination of observed Kubernetes deployment episodes with evidence-qualified transition and readiness semantics.

### Modified Capabilities

- `release-runtime-comparison`: Extend Release browsing with source and immutable image identity metadata, and explain backend baseline selection without removing explicit operator selection.

## Impact

- Updates the committed `openapi/okoscope-v1.yaml` snapshot and generated `src/shared/api/schema.d.ts` from the current backend contract.
- Affects Release and Runtime Diff routes, observability query keys and requests, presentation components, API type exports, and component/query tests.
- Adds use of `GET /api/v1/projects/{project_id}/applications/{application_id}/releases/{release_id}/episodes` with opaque cursor pagination.
- Does not add frontend inference, enrichment, or rollout business logic; source, identity, episode classification, concurrency, rollback candidacy, readiness, and baseline-selection provenance remain backend-owned.
