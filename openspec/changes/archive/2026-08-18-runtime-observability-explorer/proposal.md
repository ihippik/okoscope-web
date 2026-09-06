## Why

Application detail exposes runtime and release aggregates but leaves operators unable to inspect the underlying runtime behavior or compare behavior between releases. This change adds the primary investigation workflow while preserving tenant scoping, deep-link reliability, contract-derived type safety, and accessible navigation.

## What Changes

- Add an Application-scoped, cursor-paginated Runtime Groups route with event, workload, status, time, and recency presentation plus URL-synchronized filtering.
- Add Runtime Group Detail with representative and recent occurrences, route ownership validation, and safe structured rendering for semantic summaries and payloads.
- Extend Application Detail with accessible links to Runtime Groups and Releases, including a linked runtime-group aggregate.
- Add an Application-scoped, cursor-paginated Releases route and release-to-release Runtime Diff route with URL-selected baseline, classifications, group-detail links, and complete loading, empty, error, retry, and pagination states.
- Add reusable observability presentation, pagination, empty-state, and correlated API-error components without introducing global client state.
- Add unit, component, accessibility, and Playwright coverage for URL state, query identity, ownership enforcement, pagination, JSON safety, diff classification, and navigation history.
- Regenerate the client from the updated OpenAPI contract and keep all requests and successful responses contract-derived without local DTOs or unsafe assertions.

## Capabilities

### New Capabilities

- `runtime-group-exploration`: Application-scoped runtime-group discovery, URL filtering, incremental browsing, detail inspection, ownership enforcement, occurrence presentation, and safe JSON rendering.
- `release-runtime-comparison`: Application-scoped release browsing and baseline-aware runtime behavior comparison, including classifications, pagination, and links back to runtime groups.

### Modified Capabilities

- `tenant-navigation`: Extend Application navigation and breadcrumbs with accessible, responsive deep links to Runtime Groups and Releases while preserving browser history behavior.

## Impact

- Affects TanStack Router routes beneath Application Detail, TanStack Query hooks and keys, generated OpenAPI client usage, URL-search validation, observability presentation components, and Vitest/Playwright/axe coverage.
- Depends on `GET /api/v1/runtime-groups`, `GET /api/v1/runtime-groups/{group_id}`, Application-scoped Releases endpoints, and Runtime Diff from `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml`.
- The updated OpenAPI contract now exposes Runtime Groups filters (`event_kind`, `status`, `namespace`, `workload_kind`, `workload_name`, `since`), cursor/limit pagination for Runtime Groups and Releases, and optional `baseline_id` plus cursor/limit for Runtime Diff. The frontend client snapshot and generated types must be refreshed before feature code uses them.
- No backend mutation, release creation/editing, global state manager, or browser credential persistence is introduced.
