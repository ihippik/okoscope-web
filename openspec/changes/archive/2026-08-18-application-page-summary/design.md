## Context

The React 19/Vite frontend already uses TanStack Router and Query, a generated OpenAPI schema, URL-parsed observability filters, scoped ownership checks, correlated API errors, cursor navigation, and inert React rendering for runtime summaries and occurrence payloads. Application Detail currently links only to Runtime Groups and Releases.

The updated backend contract adds Application-scoped Runtime Inventory summary, list, dependent facet, item detail, and four evidence collection operations. The handoff requires filter-aware summary cards, four behavior kinds, independently paginated evidence, evidence-qualified release wording, opaque cursors, and inert treatment of every observed string. The frontend's pinned OpenAPI snapshot and generated schema predate these operations.

## Goals / Non-Goals

**Goals:**

- Provide a deep-linkable Application Runtime Inventory investigation workflow whose summary, list, facets, and detail queries remain in the exact route and filter scope.
- Reuse generated transport types and existing observability, formatting, accessibility, and correlated-error foundations.
- Keep potentially executable or markup-like observed values inert in every presentation and copy surface.
- Distinguish initial empty results, empty terminal cursor pages, invalid cursors, authorization loss, missing scope, server failures, and background refresh failures.

**Non-Goals:**

- Mutating runtime inventory, releases, runtime groups, or occurrences.
- Inferring behavior totals from a cursor page or implementing client-side filtering over fetched pages.
- Claiming causality between processes, DNS observations, and network destinations.
- Persisting credentials, preloading all evidence, or introducing an application-wide client state store.
- Modifying the backend contract or fixtures from this repository.

## Decisions

### Refresh and generate the contract before feature implementation

Copy the supplied backend OpenAPI document into the pinned frontend snapshot, regenerate `schema.d.ts`, and expose only aliases derived from generated component and operation types. Query builders call the documented summary, list, facet, detail, and evidence operations; no local transport DTOs, `any`, or client-derived substitutes are permitted.

Continuing against the stale snapshot was rejected because it would require untyped paths and would prevent compile-time coverage of new filters and evidence shapes.

### Use URL search as the canonical inventory collection state

The collection route validates and canonicalizes `kind`, `release_id`, `cluster_id`, `namespace`, `workload_kind`, `workload_name`, `container_name`, `observed_from`, `observed_to`, `search`, and `cursor`. Empty or malformed values normalize away. Filter, kind, time, or committed-search changes replace the collection cursor; cursor navigation preserves every other input. The search control keeps short-lived local text only for debounce and commits at most 200 characters to the URL with replace navigation.

A local filter store was rejected because it would make reload, sharing, back/forward, and query identity nondeterministic.

### Keep summary and facets in the same normalized scope as the list

Summary receives every supported list filter except `kind` and cursor so all four cards describe the same active cross-kind scope. A card activates its corresponding kind without changing the other filters.

Cluster, namespace, workload-kind, workload-name, and container controls use the dependent facet operation. Each facet request includes the active kind and every normalized scope filter except that facet's own current value, plus its own debounced `facet_search` and opaque facet cursor. Release options reuse the existing Application Releases operation because release is not a Runtime Inventory facet. Selected values remain visible even while options reload or no longer occur in the newly dependent option page.

Static option lists and client-side distinct-value extraction were rejected because they cannot represent values outside the current list page and would make counts inaccurate.

### Prefer a nested detail route over client-only drawer state

Use an item route beneath Runtime Inventory with an evidence-tab search value and one cursor for the active evidence collection. This gives item and evidence state stable deep links, reload behavior, breadcrumbs, mobile layout, and browser history. Wide layouts may present the detail as a side-panel composition, but correctness does not depend on retaining an in-memory background page.

The item response is checked against route Project/Application/item IDs before any content or evidence navigation is rendered. Evidence paths returned by the server are accepted only when they exactly match the expected relative path for the current encoded scope and evidence kind; otherwise the UI reports an invalid response. Evidence collections load on activation and are never all preloaded.

An unaddressable drawer was rejected because four independent collections, error states, reloads, and focus restoration would be substantially less predictable.

### Partition queries by every server-affecting input

Stable query keys include resource kind, Project ID, Application ID, item ID where applicable, normalized filters, committed search, facet name/search, evidence kind, and opaque cursor. Scope-changing navigation replaces rather than concatenates list data. Each page requests a fixed limit no greater than 200; the implementation uses a smaller shared default unless a view has a documented reason otherwise.

UUID-shaped cursors remain strings. The UI never decodes them, derives offsets, or assumes ordering. Backward movement relies on browser history or a route-local history of previously visited opaque cursors, not cursor arithmetic.

### Render typed identity and evidence through inert primitives

Inventory identity rendering is discriminated by `inventory_kind`: executable for process; command/family/address/port for destination; command/name/query type for domain; and command/syscall for syscall. Observed strings are emitted only as React text children or form values. DNS names, IP addresses, commands, workload values, and URL-like strings never become links, HTML, Markdown, or event handlers.

The existing bounded JSON/details presentation may render occurrence payloads, but it must retain text-node rendering and safe original-value copy behavior. Copy previews are plain text and never injected into DOM as markup. Native or React-controlled tooltip content follows the same rule.

### Make release state wording evidence-qualified

Map `observed`, `not_observed`, and `unknown` to distinct labels and explanations. `not_observed` explicitly says the item was not seen in available attributed evidence and never says absent, removed, or safe. Every release row shows `release_evidence_count`; occurrence count and first/last bounds render only when supplied.

Color is supplementary to text and icon semantics. No conclusions are derived by comparing page rows or nullable occurrence values.

### Model collection and transport states explicitly

Initial pending UI uses stable loading layouts. An empty first page shows a filter-aware empty state; an empty page reached with a cursor shows a terminal-page state with a way back. HTTP 401 follows the existing credential-clearing flow, 404 produces scoped navigation, and other normalized failures retain retry and request ID.

An HTTP 400 identified by the backend's invalid-cursor error code produces a dedicated invalid-cursor state that clears only the affected cursor while preserving scope. Until the code is contractually enumerated, recognition remains a centralized comparison against the documented runtime error value and is fixture-tested; unrelated 400 responses remain parameter errors.

## Risks / Trade-offs

- [The backend error schema does not enumerate an invalid-cursor code] → Centralize the code mapping, cover it with the supplied error fixture when available, and do not classify every HTTP 400 as cursor failure.
- [Prepared fixtures do not yet include every detail, facet, and error response] → Import supplied fixtures where present and add generated-type-checked frontend builders only for missing states, documenting the fixture gap.
- [Dependent facets can issue many requests while filters change] → Debounce facet search, rely on query cancellation/cache identity, and fetch option pages only for opened controls.
- [A selected facet value can disappear from dependent options] → Preserve and display the selected URL value until the operator explicitly clears or replaces it.
- [Observed payloads can be large or deeply nested] → Reuse bounded recursive rendering and avoid eager expansion or preloading occurrence pages.
- [Generated numeric `int64` values can exceed JavaScript safe integer precision] → Display contract values without derived aggregation and escalate serialization requirements if exact larger values are expected.

## Migration Plan

1. Refresh the pinned OpenAPI snapshot and generated TypeScript schema and verify contract freshness.
2. Add inventory URL schemas, query factories, and safe presentation primitives with unit tests.
3. Add the collection route, summary, facets, typed tabs/list, and Application Detail navigation.
4. Add item detail and lazy evidence tabs with ownership and evidence-link validation.
5. Complete fixture-driven component, accessibility, and Playwright coverage, then run the repository check suite.

The change is frontend-only and has no persistent-data migration. Rollback restores the previous frontend image; the backend endpoints can remain deployed unused.

## Open Questions

- What exact backend `error` value is guaranteed for an expired or scope-mismatched cursor?
- Will the backend fixture be expanded with facet, item, sighting, group, occurrence, and structured error examples, or should frontend-only type-checked builders remain the acceptance source for those states?
