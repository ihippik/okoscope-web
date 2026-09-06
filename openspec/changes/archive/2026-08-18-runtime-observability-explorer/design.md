## Context

The React 19/Vite frontend already provides contract generation, a shared API boundary, TanStack Router/Query, tenant routes through Application Detail, correlated errors, cursor navigation, accessible states, and production delivery. Application Detail exposes release and runtime-group counts but no investigation path.

The updated backend OpenAPI 3.1 contract defines runtime-group list/detail, release list/detail, and runtime diff response models. Runtime Groups accepts required tenant scope plus `event_kind`, `status`, `namespace`, `workload_kind`, `workload_name`, `since`, cursor, and limit; Releases accepts cursor and limit; Runtime Diff accepts optional `baseline_id`, cursor, and limit. The frontend remains generated-client-only and does not invent DTOs or widen generated types.

## Goals / Non-Goals

**Goals:**

- Provide Application → Runtime Groups → Runtime Group Detail and Application → Releases → Runtime Diff workflows.
- Keep every collection/filter selection URL-addressable and every server query fully scoped and type-safe.
- Reject Runtime Group, Release, or Diff data that does not belong to the Project/Application route context.
- Render dynamic JSON safely and accessibly while retaining useful copy and fallback behavior.
- Reuse focused observability UI without introducing application-wide client state.

**Non-Goals:**

- Creating, editing, or deleting releases or runtime data.
- Modifying or publishing the backend OpenAPI contract from this repository.
- Implementing frontend-only filtering or pagination as a substitute for missing backend parameters.
- Persisting credentials or adding a global state manager.
- Replacing existing tenant navigation, API error normalization, or design-system foundations.

## Decisions

### Regenerate and verify the generated contract before feature work

Before feature implementation, refresh the pinned OpenAPI input and generated client and verify that Runtime Groups exposes all requested filters, Releases exposes cursor/limit, and Runtime Diff exposes optional `baseline_id`. All feature requests use those generated operations; no local DTO, manually assembled request, `any`, or unjustified assertion is acceptable.

Implementing only currently supported requests was rejected because it would make URL controls misleading. Client-side filtering was rejected because it cannot filter unseen cursor pages and would give incorrect totals/results.

### Organize the feature around routes, query options, URL parsers, and presentation

Route components validate path/search inputs and compose the page. Feature query-option factories call only generated operations. Pure URL modules parse and normalize filters/cursors. Presentation components receive generated response types or narrow primitives and contain no fetching.

Reusable UI includes `RuntimeGroupList`, a responsive card/row presentation, `RuntimeGroupStatusBadge`, `SemanticSummary`, `JsonDetailsViewer`, `OccurrenceTimeline`, `ReleaseList`, `RuntimeDiffList`, `RuntimeDiffClassificationBadge`, `PaginationControls`, `EmptyState`, and `ApiErrorPanel`. Existing shared equivalents are extended rather than duplicated.

Route-local component fetching and a global store were rejected: they weaken cache reuse and URL determinism while adding no useful client-owned state.

### Make URL search the source of collection state

The Runtime Groups search schema contains event kind, status, namespace, workload kind, workload name, observation period, and opaque cursor. Releases contains cursor. Runtime Diff contains optional baseline release ID and cursor. Parsers accept only supported values/shapes, normalize empty values away, and produce canonical search objects.

Filter updates use router navigation and omit cursor, while cursor navigation preserves every active filter or baseline. Browser back/forward restores the exact parsed search state. The backend-selected baseline is represented by absence of the baseline parameter; the UI only writes a value after explicit selection.

### Include every server-affecting input in query identity

Stable query keys include resource kind plus `projectId`, `applicationId`, and, as applicable, `groupId`, normalized filters, cursor, `targetReleaseId`, and `baselineReleaseId`. Objects are constructed in a fixed shape/order by query-option factories. Credentials remain excluded and existing credential-bound cache clearing remains authoritative.

### Enforce ownership before rendering nested resource data

Runtime Group Detail compares response `project_id` and `application_id` with both URL IDs before rendering any group or occurrence data. Release list items and Runtime Diff `target`/non-null `baseline` receive the same route-scope validation; the target ID must also equal `targetReleaseId`. A mismatch produces a scoped not-found/ownership error with navigation to the nearest valid parent and never briefly renders foreign data.

Relying solely on backend authorization was rejected because the group-detail endpoint is globally addressed and route context can still be stale or malformed.

### Render JSON as data, with bounded recursive presentation

`JsonDetailsViewer` accepts the generated dynamic JSON value, never interprets strings as markup, and renders through React text nodes. It limits initial expansion depth and total visible structure, wraps long keys/values, distinguishes arrays/objects/primitives, and shows an explicit fallback for unsupported or excessively complex structures. Copy serializes the original value with `JSON.stringify`, uses the Clipboard API from a labeled keyboard-operable button, and announces success/failure.

`SemanticSummary` uses the same safe primitive for structured summaries, with a compact summary mode and access to details. Syntax-highlighting libraries and `dangerouslySetInnerHTML` were rejected because the required behavior is small and safe native rendering avoids an injection surface and dependency weight.

### Treat recency and diff classification as presentation over contract values

Recently first-seen groups are identified by a documented, testable UI threshold applied to `first_seen_at` relative to the current clock; styling includes text/icon semantics rather than color alone. Runtime Diff maps generated lowercase enum values to uppercase user labels `NEW`, `DISAPPEARED`, and `UNCHANGED`, orders/emphasizes `NEW` without mutating the backend page, and displays nullable baseline/target counts explicitly.

### Preserve responsive and accessible navigation semantics

Application actions and count links are real router links. Breadcrumbs reconstruct from scoped queries on reload. Lists use semantic links/buttons with visible focus, and compact cards replace dense rows on narrow viewports without changing reading or tab order. Loading layouts do not masquerade as empty results; API failures use the shared request-ID-aware retry panel.

## Risks / Trade-offs

- [The frontend's pinned OpenAPI snapshot or generated client is stale] → Refresh both from the updated source contract and require freshness/type checks before feature work.
- [A backend-selected baseline is not identifiable when null] → Show a no-baseline state and do not synthesize a comparison.
- [Opaque cursors cannot support arbitrary backward jumps] → Preserve URL/history navigation and offer only transitions supported by known current/next cursor state.
- [Large or deeply nested JSON can freeze or overwhelm the page] → Bound initial expansion and rendered nodes/depth while copying from the original value on demand.
- [Clock-based “recent” styling makes snapshots unstable] → Inject/freeze the clock in tests and centralize the threshold.
- [64-bit occurrence counts can exceed precise JavaScript arithmetic] → Display generated values without derived arithmetic and escalate contract serialization if precision requirements demand it.

## Migration Plan

1. Refresh the frontend OpenAPI snapshot/generated client from the updated backend contract and pass freshness/type checks.
2. Add URL schemas and query-option factories, followed by reusable observability presentation.
3. Add Runtime Groups/detail routes and ownership gates, then Releases/Diff routes.
4. Add Application navigation and complete unit, component, axe, and Playwright coverage.
5. Deploy as a frontend-only release after compatibility and production smoke checks. Rollback restores the prior frontend image; this change has no persistent-data migration.

## Open Questions

- What duration defines “recently first observed” for product semantics, and should it eventually be backend-configurable?
