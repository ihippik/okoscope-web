## Why

Application Detail exposes release and runtime-group aggregates but does not provide an application-wide view of the concrete runtime behavior observed across releases and Kubernetes scopes. The backend now publishes a versioned Runtime Inventory API, dependent filter facets, evidence-qualified release presence, and fixtures, so the frontend can provide this investigation workflow without deriving incomplete results from runtime-group pages.

## What Changes

- Add an Application → Runtime Inventory route with filter-aware summary cards for processes, destinations, domains, and syscalls.
- Add URL-addressable tabs, dependent release/cluster/namespace/workload/container/time filters, debounced identity search, and opaque cursor pagination.
- Add typed inventory rows that present semantic identity, observation bounds, occurrence totals, and bounded scope counts without inferring collection totals from a page.
- Add an inventory item detail route with independently paginated release evidence, Kubernetes sightings, contributing runtime groups, and raw occurrences.
- Present `observed`, `not_observed`, and `unknown` as evidence-qualified states and never reinterpret `not_observed` as absence or safety.
- Render every observed string inertly in lists, facets, details, tooltips, and copy previews.
- Add distinct loading, empty-first-page, empty-terminal-page, invalid-cursor, unauthorized, not-found, and server-error states.
- Refresh the pinned OpenAPI snapshot and generated TypeScript schema, and add fixture-driven component, URL/query, safety, accessibility, and browser tests.

## Capabilities

### New Capabilities

- `runtime-inventory-exploration`: Application-scoped summary, typed behavior browsing, server-driven facets, URL filters/search, cursor navigation, evidence detail, release-presence semantics, and inert rendering.

### Modified Capabilities

- `tenant-navigation`: Expose Runtime Inventory from Application Detail and preserve scoped breadcrumbs and deep-link navigation.
- `api-client-foundation`: Consume the refreshed generated Runtime Inventory contract with complete query identity and correlated, state-specific API failure handling.

## Impact

- Affects Application-level TanStack Router routes, URL search validation, TanStack Query keys/options, observability presentation components, shared API types, and Application Detail navigation.
- Refreshes `openapi/okoscope-v1.yaml` from `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml` and regenerates `src/shared/api/schema.d.ts`.
- Depends on the Runtime Inventory summary, list, facet, item, release, sighting, group, and occurrence endpoints and the backend fixture/handoff documents.
- Adds no backend mutation, client-side substitute for server filtering, credential persistence, global state manager, or inferred process/DNS/connection causality.
