## Context

The frontend currently mirrors backend concepts: Runtime Groups, Runtime Inventory, Runtime Diff, inventory kinds, occurrences, and evidence. The generated API already supplies the data needed for a task-oriented experience, but its collection model has four independent kinds (`process`, `destination`, `domain`, `syscall`) and cursor-paginated endpoints that cannot be safely merged into one globally ordered client-side collection.

The change crosses Application navigation, observability routes, localization, accessibility, and tests. Existing URLs and OpenAPI-derived queries are already stable and ownership-safe, so the redesign must preserve those contracts while changing the visible information architecture.

## Goals / Non-Goals

**Goals:**

- Explain Okoscope’s value on the Application overview in terms of processes, network activity, and release changes.
- Make Processes and Network the two primary activity areas.
- Use plain, contextual Russian and English terminology throughout list, detail, loading, empty, error, breadcrumb, and document-title surfaces.
- Keep current routes, query parameters, API calls, pagination semantics, security boundaries, and accessibility guarantees.
- Keep technical evidence available without making it the default user journey.

**Non-Goals:**

- Changing the OpenAPI schema, collector, persistence model, or backend aggregation.
- Producing a single globally sorted list across destinations and domains.
- Inferring unique network actions by adding destination and domain counts.
- Claiming complete incoming/outgoing connection coverage when the connection payload has no direction field.
- Treating discoveries as incidents, vulnerabilities, or risk findings.
- Renaming internal TypeScript types, generated operations, route paths, or query parameter values solely to match UI copy.

## Decisions

### Use a presentation vocabulary above the API vocabulary

The UI will map internal concepts to user concepts at the rendering/localization boundary. `runtime-inventory` becomes Application Activity, `process` becomes Process launches, `runtime-groups` becomes New discoveries, and `runtime-diff` becomes Changes after release. Internal identifiers remain unchanged to avoid an unnecessary API and routing migration.

Alternative considered: rename routes and API concepts end to end. Rejected because it adds compatibility work without improving the visible experience.

### Make Processes and Network the primary navigation model

Application Activity will provide two primary choices. Processes uses the existing `kind=process` list. Network is a presentation container with separate Connections (`kind=destination`) and Domains (`kind=domain`) views. Each view keeps independent server pagination and does not merge cursor pages.

Alternative considered: fetch both network kinds and combine them client-side. Rejected because independently paginated collections cannot produce correct global ordering, totals, or terminal states.

### Keep syscalls behind progressive disclosure

Syscalls and raw JSON payloads remain reachable under Technical details or Observation history but will not compete with Processes and Network in the primary summary. This preserves diagnostic capability while reducing first-use complexity.

Alternative considered: remove syscall UI entirely. Rejected because operators still need low-level evidence and the API already supports it.

### Use contextual metrics instead of a universal occurrence label

The same `occurrence_count` will be labelled according to context: launches for a process, connection observations for a destination, DNS observations for a domain, and observations for mixed or technical collections. The UI will not claim semantic uniqueness beyond what the counter represents.

### Keep discoveries neutral and evidence-based

Runtime Groups will be presented as New discoveries because they group repeatedly observed behavior and expose first-seen lifecycle handling. Copy and visual treatment must explicitly avoid threat, incident, severity, or safety claims.

### Preserve evidence-qualified release language

Runtime Diff classifications map to New, No longer observed, and Still observed. “Disappeared” will not be translated as removed or absent, consistent with the existing evidence-qualified inventory semantics. Baseline and target release context remain visible.

### Centralize terminology in localization

New user-facing vocabulary will be represented in the localization catalog rather than scattered ad hoc translations. Dynamic contextual labels will use typed helpers or message keys. Both locales must cover navigation, headings, actions, filters, states, accessibility labels, and document titles.

## Risks / Trade-offs

- [Network is backed by two collections] → Present Connections and Domains as explicit subsections with independent states and never show a fabricated combined unique total.
- [Existing users may look for old names] → Preserve URLs and use short transitional helper copy where necessary, without retaining internal terminology as primary labels.
- [“New discovery” may still sound alarming] → Add neutral explanatory copy that discoveries are newly observed behavior, not automatically problems.
- [Contextual count labels can become inconsistent] → Define a single typed mapping from inventory kind to item and observation vocabulary and cover it with localization tests.
- [Legacy document-wide localization can miss new strings] → Add all established vocabulary to the centralized catalog and extend catalog-guard tests.
- [UI-only grouping cannot filter a whole cursor-paginated diff by category] → Do not add client-side category filters to Runtime Diff in this change; record server-side category filtering as a future enhancement.

## Migration Plan

1. Introduce centralized vocabulary and contextual label mappings with tests.
2. Redesign the Application overview and activity entry points while keeping route targets unchanged.
3. Restructure Runtime Inventory presentation into Processes, Network, and Technical details using current kind-specific queries.
4. Update Runtime Groups, Runtime Diff, and occurrence details to the new terminology.
5. Update accessibility and end-to-end assertions for both locales and narrow viewports.
6. Deploy as a frontend-only change. Rollback consists of reverting the presentation changes; no data or API rollback is required.

## Open Questions

- Should the initial default activity view open Processes or remember the user’s last selected primary area?
- Should “New discoveries” be a top-level Application action or a highlighted block within Application Activity?
- Is the Russian product term better standardized as «Новые обнаружения» or the softer «Новое поведение» after user testing?
