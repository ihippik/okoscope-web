## 1. Contract and fixtures

- [x] 1.1 Refresh the pinned OpenAPI snapshot from the supplied backend contract and regenerate `src/shared/api/schema.d.ts`.
- [x] 1.2 Add generated aliases and compile-time contract fixtures for inventory kinds, summary, list, facets, detail, release presence, sightings, groups, occurrences, and operation query parameters.
- [x] 1.3 Import the prepared runtime-inventory fixture into frontend tests and add generated-type-checked builders only for facet, detail, evidence, and error cases missing from the backend fixture.
- [x] 1.4 Verify contract freshness, generation, and TypeScript compilation before adding production consumers.

## 2. URL state and query boundary

- [x] 2.1 Implement canonical parsing for inventory kind, release, cluster, namespace, workload kind/name, container, observation bounds, search, and opaque list cursor.
- [x] 2.2 Implement canonical parsing for item evidence selection and its active opaque cursor, including helpers that reset only affected cursors when scope changes.
- [x] 2.3 Add stable query-key factories containing every Project, Application, item, normalized filter, search, facet, evidence-kind, and cursor input while excluding credentials.
- [x] 2.4 Add bounded query options for filter-aware summary and kind-specific inventory pages.
- [x] 2.5 Add bounded dependent facet query options that omit the requested facet's own selected value and include facet search/cursor.
- [x] 2.6 Add item-detail and lazy active-evidence query options with scoped path construction and AbortSignal support.
- [x] 2.7 Centralize invalid-cursor recognition and cursor-only recovery while preserving unrelated HTTP 400 parameter failures and correlated request IDs.
- [x] 2.8 Unit-test URL normalization, cursor reset/preservation, request paths, query identity, dependent facet scope, bounds, and invalid-cursor classification.

## 3. Safe inventory presentation

- [x] 3.1 Implement filter-aware four-kind summary cards with zero fallback for omitted kinds and no totals derived from list pages.
- [x] 3.2 Implement accessible Processes, Destinations, Domains, and Syscalls tabs/cards that preserve scope and reset list cursor.
- [x] 3.3 Implement discriminated typed identity rendering for process, destination, domain, and syscall items using React text nodes only.
- [x] 3.4 Implement responsive inventory rows/cards with observation bounds, occurrence total, and all bounded scope counts.
- [x] 3.5 Implement server-driven searchable facet controls for cluster, namespace, workload kind/name, and container, preserving selected values across dependent reloads.
- [x] 3.6 Implement release selection from the existing Application Releases query, observation-window controls, active-filter summary, clear actions, and debounced 200-character identity search.
- [x] 3.7 Implement list loading, first-page empty, terminal-page empty, invalid-cursor, unauthorized, not-found, server/network, stale-refresh, and success presentations.
- [x] 3.8 Add component and accessibility tests proving prepared markup-like values remain inert in identities, filters, options, tooltips, and copied previews.

## 4. Runtime Inventory routes

- [x] 4.1 Add the Application-scoped Runtime Inventory collection file route with validated URL search, scoped breadcrumbs, document title, summary, filters, tabs, and list composition.
- [x] 4.2 Add Runtime Inventory navigation to Application Detail with keyboard-visible focus and responsive action layout.
- [x] 4.3 Implement opaque next-page navigation that preserves active scope and distinguishes an empty terminal page without deriving previous cursors.
- [x] 4.4 Verify direct load, reload, sharing, browser back/forward, kind/filter transitions, and narrow-viewport behavior for the collection route.

## 5. Item detail and evidence

- [x] 5.1 Add an addressable nested inventory item route with validated evidence-tab and cursor search state, breadcrumbs, title, and navigation back to the scoped collection.
- [x] 5.2 Enforce Project/Application/item ownership before rendering any successful item response.
- [x] 5.3 Validate returned releases, sightings, groups, and occurrences evidence paths against exact expected relative paths before requesting them.
- [x] 5.4 Implement independently paginated Releases, Sightings, Groups, and Occurrences evidence views that fetch only the active tab.
- [x] 5.5 Implement evidence-qualified `observed`, `not_observed`, and `unknown` presentation with release evidence count and optional occurrence bounds.
- [x] 5.6 Reuse bounded inert payload rendering for raw occurrences and inert text rendering for every sighting, group, release-adjacent, node, Pod, workload, namespace, and container value.
- [x] 5.7 Implement detail/evidence loading, empty, terminal-page, invalid-cursor, unauthorized, not-found/ownership, unsafe-link, server/network, stale-refresh, and success states.
- [x] 5.8 Add component and accessibility tests for ownership rejection, evidence-link rejection, lazy tab loading, independent cursors, all release states, empty pages, and inert fixture strings.

## 6. End-to-end verification

- [x] 6.1 Extend Playwright fixtures and routes for summary, list, facets, item detail, each evidence collection, terminal pages, and normalized failures.
- [x] 6.2 Add browser coverage for Application → Runtime Inventory navigation, filter/search sharing, dependent facets, four kinds, cursor history, direct item links, and evidence tabs.
- [x] 6.3 Add browser security assertions that unsafe fixture strings create no elements, links, handlers, navigation, or script execution across collection and detail surfaces.
- [x] 6.4 Run formatting, lint, typecheck, generated-contract freshness, Vitest, production build, Playwright, and accessibility checks and document any backend fixture or invalid-cursor contract gap.
