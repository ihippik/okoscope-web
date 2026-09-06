## 1. OpenAPI Client Refresh

- [x] 1.1 Refresh the pinned OpenAPI input and generated client from the updated backend contract
- [x] 1.2 Verify generated `listRuntimeGroups` parameters include required project/application scope plus event kind, status, namespace, workload kind, workload name, `since`, cursor, and limit
- [x] 1.3 Verify generated `listReleases` supports cursor/limit and `getRuntimeDiff` supports optional `baseline_id` plus cursor/limit, then run generated-contract freshness/type checks
- [x] 1.4 Add compile-time/generated-client fixtures proving dynamic JSON remains safely typed and all successful response fields/query parameters are contract-derived with no frontend DTO or unsafe assertion

## 2. URL State and Query Architecture

- [x] 2.1 Implement pure validated search parsing and canonical serialization for Runtime Groups filters and cursor, including invalid-value handling and cursor reset on every filter change
- [x] 2.2 Implement validated search parsing for Releases cursor and Runtime Diff baseline/cursor, where omitted baseline preserves backend selection and changing baseline resets cursor
- [x] 2.3 Add generated-client query-option factories for runtime-group list/detail whose stable keys include project ID, application ID, group ID, normalized filters, and cursor as applicable
- [x] 2.4 Add generated-client query-option factories for release list/detail and Runtime Diff whose stable keys include project ID, application ID, target release ID, baseline release ID, and cursor as applicable
- [x] 2.5 Add unit tests for URL parsing/canonicalization, invalid search values, filter/baseline cursor reset, cursor preservation of other search state, and browser-history-compatible round trips
- [x] 2.6 Add unit tests proving every server-affecting parameter changes the corresponding query key and equivalent normalized inputs produce identical keys

## 3. Reusable Observability UI

- [x] 3.1 Implement or extend `PaginationControls`, `EmptyState`, and request-ID-aware `ApiErrorPanel` with keyboard operation, visible focus, retry, and narrow-viewport behavior
- [x] 3.2 Implement `RuntimeGroupStatusBadge`, `RuntimeDiffClassificationBadge`, and the documented clock-injectable recent-first-seen treatment with text/icon semantics in addition to color
- [x] 3.3 Implement `SemanticSummary` and `JsonDetailsViewer` with bounded initial depth/node rendering, long-value wrapping, literal text rendering, unknown-structure fallback, copy-original-JSON behavior, and accessible outcome announcements
- [x] 3.4 Implement presentation-only `RuntimeGroupList` and responsive card/table-row composition using generated runtime-group types
- [x] 3.5 Implement `OccurrenceTimeline` for representative/recent occurrences with observed time, node, pod, container, process command, and structured payload
- [x] 3.6 Implement presentation-only `ReleaseList` and `RuntimeDiffList`, mapping generated classifications to `NEW`, `DISAPPEARED`, and `UNCHANGED` and emphasizing `NEW` without reordering or recoloring as the sole cue

## 4. Runtime Groups Routes

- [x] 4.1 Add `/projects/:projectId/applications/:applicationId/runtime-groups` with validated search, generated-client loading, all required fields/filters, cursor navigation, and responsive breadcrumbs
- [x] 4.2 Add distinct Runtime Groups loading, filtered/unfiltered empty, request-ID error/retry, and paginated success states
- [x] 4.3 Add `/projects/:projectId/applications/:applicationId/runtime-groups/:groupId` with generated-client detail loading and direct-link breadcrumb reconstruction
- [x] 4.4 Enforce exact response `project_id` and `application_id` ownership before rendering Runtime Group Detail or occurrences, returning a scoped not-found/ownership state on mismatch
- [x] 4.5 Render Runtime Group evidence, representative event, recent occurrences, semantic summary, and payload using the reusable safe viewers

## 5. Releases and Runtime Diff Routes

- [x] 5.1 Add `/projects/:projectId/applications/:applicationId/releases` with generated-client loading, cursor URL state, version/deployed-time/description presentation, and Runtime Diff links only
- [x] 5.2 Add distinct Releases loading, empty, request-ID error/retry, and paginated success states without creation or editing controls
- [x] 5.3 Add `/projects/:projectId/applications/:applicationId/releases/:targetReleaseId/runtime-diff` with backend-default baseline behavior, selectable Application baseline, cursor URL state, and responsive breadcrumbs
- [x] 5.4 Validate release list items and Runtime Diff target/baseline ownership plus exact target route identity before rendering scoped response data
- [x] 5.5 Render target and baseline context, classification sections/evidence, group-detail links, and distinct no-baseline, empty-diff, loading, request-ID error/retry, and pagination states

## 6. Application Navigation and Accessibility

- [x] 6.1 Add `View runtime groups` and `View releases` router links to Application Detail and convert the Runtime groups aggregate into a link preserving the current Project/Application scope
- [x] 6.2 Complete semantic breadcrumbs, meaningful document titles, keyboard focus management, visible focus, and stable back/forward behavior across all new routes
- [x] 6.3 Verify all filters, selectors, links, copy controls, retries, and pagination are labeled and operable by keyboard at desktop and narrow viewport sizes

## 7. Component and Integration Tests

- [x] 7.1 Add component tests for Runtime Groups and Releases loading, empty, error/request-ID/retry, success, cursor pagination, and filter-change cursor reset states
- [x] 7.2 Add component tests for Runtime Group Detail success/evidence and Project/Application ownership mismatch withholding, including no transient foreign-data rendering
- [x] 7.3 Add `JsonDetailsViewer` tests for depth/size bounds, long wrapping, unknown structures, copy success/failure, and markup/script strings remaining inert
- [x] 7.4 Add Runtime Diff tests for backend-default and explicit baselines, target/baseline ownership, no baseline, empty diff, errors, pagination, all classifications, nullable counts, and group links
- [x] 7.5 Add keyboard-navigation and axe checks for every new route and reusable observability component at representative wide and narrow viewports

## 8. End-to-End and Release Verification

- [x] 8.1 Add a Playwright flow covering API connection and Organization → Project → Application → Runtime Groups → Runtime Group Detail navigation
- [x] 8.2 Extend the flow to return with filters/cursor preserved, open Releases and Runtime Diff, select a baseline, follow a group link, and traverse browser back/forward
- [x] 8.3 Add Playwright coverage for direct links/reloads, cursor pages, empty/no-baseline states, correlated API errors/retry, ownership mismatches, keyboard navigation, and narrow viewport layouts
- [x] 8.4 Run formatting, lint, TypeScript, unit/component, axe, Playwright, generated-contract freshness, production build, and relevant container smoke checks; record or resolve every failure before completion
