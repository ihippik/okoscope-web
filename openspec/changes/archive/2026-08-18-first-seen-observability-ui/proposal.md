## Why

The current Runtime Groups UI can locate and inspect aggregated runtime behavior, but it does not complete the first-seen response workflow: operators cannot review bounded occurrence history, understand notification delivery, or move a group through its lifecycle. Backend API v1 at commit `76ff32fe913ccce4a4392262b286df75dae013c6` and database migration 6 now expose the contract needed to deliver that workflow safely in the frontend.

## What Changes

- Refresh the checked-in OpenAPI contract and generated TypeScript client, retaining contract-derived successful response types and raising the compatibility requirement to database migration 6.
- Expand Runtime Groups URL filters with event kind, lifecycle status, release, first-seen range, and last-seen criteria; preserve filters and cursor state through detail navigation and browser Back.
- Present first-seen and last-seen timestamps, occurrence count, lifecycle status, and a factual recent-first-seen treatment without introducing risk scoring or severity.
- Expand Runtime Group Detail with first-seen metadata, representative event, semantic summary, Kubernetes and release attribution, lifecycle metadata, and a human-readable first-seen notification summary.
- Add bounded, cursor-paginated occurrence browsing with operational attribution and complete loading, empty, error, and pagination states.
- Add status-aware acknowledge, resolve, and reopen actions with resolve confirmation, duplicate-submission prevention, correlated safe errors, and TanStack Query invalidation.
- Add accessible, responsive UI states and automated contract, unit, component, integration, Playwright, and axe coverage for the end-to-end first-seen workflow.
- Keep credentials and signing secrets out of the UI; do not add webhook configuration, risk scoring, enforcement, authentication changes, browser credential persistence, or backend changes.

## Capabilities

### New Capabilities

- `runtime-group-lifecycle`: Status-aware acknowledge, resolve, and reopen controls, confirmation and mutation behavior, cache invalidation, and safe correlated failures.
- `runtime-occurrence-exploration`: Bounded cursor-paginated occurrence inspection with runtime, Kubernetes, and release context and complete interaction states.
- `first-seen-notification-visibility`: Human-readable presentation of all first-seen notification states without conflating delivery state with risk or severity.

### Modified Capabilities

- `api-client-foundation`: Refresh the API v1 contract and generated client and require build compatibility with database migration 6.
- `runtime-group-exploration`: Extend URL-backed discovery filters, navigation restoration, group summary fields, detail metadata, attribution, and recent-first-seen presentation.

## Impact

- Affects the checked-in OpenAPI snapshot, generated TypeScript client, build-info compatibility gate, Runtime Groups routes and search validation, Runtime Group Detail, TanStack Query hooks/keys/mutations, shared status and error presentation, and responsive/accessibility behavior.
- Consumes `GET /api/v1/runtime-groups/{group_id}/occurrences` plus the acknowledge, resolve, and reopen endpoints from `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml`; no backend contract is authored by the frontend.
- Extends Vitest/component/contract/integration coverage, the full Playwright lifecycle journey, browser-history and deep-link checks, axe checks, and container smoke only if the refreshed compatibility fixture requires it.
- Production fixture identifiers are documentation/manual-smoke inputs only and must not be embedded in production code.
