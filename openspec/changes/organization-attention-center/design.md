## Context

The authenticated root currently loads only Organization identity and presents a single Project-navigation card. Operators must descend through the tenant hierarchy and interpret independent discovery, release-comparison, and notification screens before they can decide what to handle next. The Application overview also contains a disabled Recommendations placeholder.

The backend now implements two bounded generated-contract operations: `GET /api/v1/attention-summary` for complete tenant-wide triage and `GET /api/v1/projects/{project_id}/applications/{application_id}/attention-summary` for scoped guidance. Their responses contain server-calculated totals, deterministic ordering, typed operational priorities and reasons, exact facts, Project/Application/Release references, discriminated resource references, and snapshot timestamps. This removes the earlier need for inaccurate browser-side aggregation across cursor-paginated collections.

The frontend must preserve existing routes, tenant ownership checks, neutral evidence vocabulary, ephemeral bearer security, localization, and accessible responsive behavior. The backend is implemented locally but may not be deployed when frontend development begins, so generated-contract synchronization and fixtures are part of the change.

## Goals / Non-Goals

**Goals:**

- Make the Organization root a task-oriented command center that identifies the next useful investigation.
- Use server-authoritative complete totals and bounded ordered collections without frontend fan-out.
- Turn priority and recommendation reason codes into concise, explainable English and Russian presentation.
- Map typed resource references to existing ownership-safe routes.
- Activate Application recommendations and release guidance using the scoped summary while keeping established Application workflows independently usable.
- Provide truthful all-clear, unavailable-comparison, initial-error, and stale-refresh states.

**Non-Goals:**

- Calculating risk, anomaly, vulnerability, incident severity, or new ranking rules in the browser.
- Adding “since last visit” semantics, user checkpoints, custom date ranges, or client persistence.
- Building new discovery, Runtime Diff, notification, or destination detail routes.
- Loading all Projects, Applications, releases, or cursor pages to reproduce server aggregates.
- Adding charts, realtime streaming, automatic remediation, recommendation dismissal, assignment, or collaboration state.
- Changing existing route paths or accepting navigation URLs from the backend.

## Decisions

### Keep `/` as the Organization attention route

The authenticated root will continue loading Organization identity but will replace the introductory card with Requires attention. The selected `window` is validated route search state, defaulting to `24h`; `7d` is the only alternative currently accepted by the contract. Project browsing remains available in the primary header and as a secondary command-center action.

Alternative considered: add `/attention`. Rejected because the command center is the intended post-authentication destination and a second route would leave the low-value root in place or require an unnecessary redirect.

### Treat each summary response as one server snapshot

Organization cards and sections will consume one `OrganizationAttentionSummary`. The frontend will preserve API ordering for `priority_items` and `recommendations`, use exact totals, and never merge in independently fetched list pages. Query identity includes the normalized window and bounded constants but no local timestamps. A modest stale time avoids immediate duplicate requests; a background failure retains prior data and marks the snapshot stale.

Alternative considered: reuse existing Project/Application queries and aggregate with `useQueries`. Rejected because it introduces N+1 behavior, cannot produce complete totals without traversing cursors, and cannot guarantee global ordering or a common `generated_at`.

### Separate overview facts from investigation destinations

The Organization summary can truthfully display cross-tenant totals even where no single aggregate list route exists. Actions will be attached to concrete bounded items and recommendations whose resource references supply an investigation scope. Aggregate metric cards will link only when their destination represents the metric truthfully; otherwise they lead attention into the relevant section on the same page rather than a partial list.

Alternative considered: make every metric clickable to the first matching Application. Rejected because that implies the destination represents the complete Organization total.

### Use an exhaustive resource-reference routing adapter

A typed pure helper will map the OpenAPI discriminator variants:

- `project` → Project overview or its Notifications subsection when the action kind requires notification configuration;
- `application` → Application overview;
- `runtime_group` → existing scoped New discovery detail;
- `runtime_diff` → existing target release Runtime Diff route with `baseline` search state.

The action context, recommendation kind, and reason code select the most relevant known route for broad Project/Application references. Observed text, slugs, IDs, and backend facts are never concatenated into arbitrary hrefs. Unknown variants fail closed with readable facts and no action.

Alternative considered: have the API return frontend URLs. Rejected because it couples backend presentation to client routing and widens the unsafe-navigation boundary.

### Centralize presentation mappings instead of relying on legacy DOM translation

Attention priorities, item kinds, reason codes, recommendation kinds, metric labels, action labels, empty states, and explanatory evidence copy will be typed mappings backed by the localization catalog. Dynamic names, versions, counts, and timestamps remain inert values. Status presentation uses text, icon/shape, and border treatment so color is never the sole signal.

Alternative considered: add English literals and let the legacy MutationObserver translate them. Rejected because a new central surface needs compile-time locale coverage, stable accessible names, and deterministic tests.

### Use a focused two-level Organization command center

The landing screen uses only complete summary metrics followed by one server-ordered list of concrete recommendations. Each recommendation states what happened, identifies its Project/Application scope, and links to the existing detailed investigation. Priority items, changed-Application comparisons, and notification-problem records are not repeated as separate long sections on the landing screen; their totals remain visible and their relevant details are reached through recommendations. Native headings, lists, links, buttons, `time`, and definition structures provide accessibility without introducing a dashboard/chart library.

### Keep Application attention independently recoverable

Application identity and established actions continue to use their current queries. The scoped attention query renders in a separate region, replaces the disabled Recommendations placeholder, and may add a compact release-comparison summary. Its loading or failure does not block Process, Network, discovery, release, or worker navigation. Returned Project/Application references are checked against route parameters before rendering.

Alternative considered: replace the entire Application overview response with Application attention data. Rejected because the summary does not contain every established Application and worker field and would make an additive feature a new availability dependency.

Following user review, the Application attention region uses the same focused hierarchy as the Organization landing screen: compact totals followed by recommendations. Priority items and the release-comparison card are not repeated there because the existing Application navigation and recommendation actions already provide access to those investigations.

The Application overview exposes Requires attention as the fourth primary workflow card alongside activity, discoveries, and releases. Attention content lives on the stable nested `/attention` route instead of extending the overview vertically. Its metrics explicitly distinguish discoveries from behavior changes after the latest release, and each recommendation identifies the affected scope and concrete investigation action.

The scoped attention route also shows evidence-qualified observed actions for the same snapshot bounds. File deletion uses the complete inventory summary filtered by `operation=delete`. Internet traffic is confirmed only when a public IP appears in the bounded top outbound-destination distribution; absence is worded as not confirmed in the main destinations rather than as no internet traffic.

New inbound ports use runtime groups first observed within the snapshot bounds and explicitly disclose when the returned page is bounded. Activity growth uses the largest positive occurrence delta already supplied by the bounded release comparison, without inventing a frontend risk threshold. Observed-action cards use a green-to-red volume scale with fixed count thresholds; color communicates volume only and never security severity.

### Use shared presentation components without over-generalizing pages

Pure helpers and small components will be shared for priority badges, fact formatting, recommendation actions, release comparison, and resource mapping. Organization and Application containers retain distinct information hierarchy and request-state behavior rather than being configured through one large polymorphic dashboard component.

## Risks / Trade-offs

- [Backend is implemented but not deployed] → Generate against the local canonical OpenAPI file, use contract-shaped fixtures in component tests, and verify against a local backend before deployment; production remains gated by the existing compatibility flow.
- [A summary action can have a broad Project resource] → Resolve destinations from typed action context and test every kind/reason/resource combination; fail closed when no truthful route exists.
- [Operational priority may be read as security severity] → Use “priority for review” language, keep explanations adjacent, and ban risk/incident/vulnerability claims in copy assertions.
- [Organization totals and bounded lists differ in size] → Label lists as priority/highlight subsets and keep complete totals visually distinct from returned item counts.
- [Background data becomes stale] → Display `generated_at`, retain last successful data only with an explicit stale warning, and provide manual retry.
- [The root becomes information dense] → Use progressive sections, dominant next actions, bounded lists, and responsive semantic order rather than rendering every fact in every card.
- [Application overview gains another request] → Load it independently, keep established content available, use stable query caching, and avoid duplicate Organization queries.
- [Legacy localization can mutate attention content unexpectedly] → Add typed catalog entries and extend localization guard tests around the new components.

## Migration Plan

1. Regenerate the frontend OpenAPI declarations from the local backend contract and confirm both attention operations and discriminated response types are present.
2. Add typed attention query keys, query options, URL normalization, resource-routing helpers, and fixtures with unit coverage.
3. Build localized shared attention presentation primitives and the Organization command-center sections.
4. Replace the authenticated root content while retaining Organization loading and Project navigation.
5. Add the independently recoverable Application attention region and remove the disabled Coming soon placeholder.
6. Verify English and Russian copy, keyboard operation, wide/narrow layouts, API failure/stale behavior, deep links, and production build checks.
7. Run the Web UI against the local backend before coordinated deployment. Deploy the backend contract/implementation before or with the frontend image. Roll back the frontend to the prior root and disabled Application placeholder if the endpoint is unavailable; no data migration is involved.

## Open Questions

- Should the root window selection use buttons or a compact native select after narrow-viewport testing?
- Should healthy/all-clear snapshots show recommendations only when the backend supplies them, or suppress the entire recommendation region in favor of Project navigation?
