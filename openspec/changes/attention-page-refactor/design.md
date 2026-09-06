## Context

The Application Requires attention page currently places summary metrics, Observed actions, Policy classification, Recommendations to review, and Priority queue in a single vertical flow. The recently added policy section increases useful context but also makes the page substantially longer. Recommendations and the priority queue are action-oriented, while observed and policy sections are snapshot facts; presenting all of them simultaneously weakens that distinction.

The route currently has no section URL state. All attention data already arrives in one backend snapshot, while the Overview panel additionally owns its existing supporting queries. The refactor must preserve server authority, existing destinations, empty states, localization, and narrow-viewport accessibility.

## Goals / Non-Goals

**Goals:**

- Make one coherent attention section visible at a time.
- Lead with concrete recommendations while keeping facts and the ranked queue one action away.
- Preserve selected-section state in a shareable URL and browser history.
- Expose recommendation and priority counts without client-side business inference.
- Implement the WAI-ARIA tab interaction model in English and Russian.

**Non-Goals:**

- Changing backend attention snapshots, ranking, recommendation generation, or policy semantics.
- Combining recommendations and priority items or deduplicating them in the frontend.
- Auto-selecting a tab based on priority, urgency, counts, or other inferred conditions.
- Adding a fourth top-level Policy tab; policy classification remains part of the factual Overview.
- Refactoring the organization-level Requires attention page.

## Decisions

### Use three tabs aligned to user intent

The top-level tabs are:

1. Overview — Observed actions and Policy classification.
2. Recommendations — backend-provided recommended next actions.
3. Priority queue — backend-ranked operational review items.

Observed actions and Policy classification remain together because both explain the current snapshot. Separating them would add navigation without reducing conceptual complexity.

Alternative considered: four tabs matching every current heading. Rejected because Russian labels are long, the mobile tab strip becomes harder to scan, and policy facts lose their relationship to observed facts.

### Default to Recommendations without conditional auto-selection

Missing or invalid section state resolves to `recommendations`. This keeps the page action-first and deterministic. The frontend will not switch to Priority queue based on urgency or counts because that would duplicate server prioritization semantics.

Alternative considered: default to Priority queue when urgent items exist. Rejected because it adds client decision logic and makes identical links open differently as snapshots change.

### Store section selection in route search state

The Application attention route will validate `section` as `overview`, `recommendations`, or `priority`. Invalid values resolve to `recommendations`. Tab activation navigates to the same route with the selected section, creating predictable back/forward behavior and shareable deep links.

The absent parameter remains backward-compatible and represents the default Recommendations view. Explicit tab links include their section value.

Alternative considered: component-local state. Rejected because refresh, sharing, and browser history would lose the selected view.

### Use an accessible tab pattern rather than styled navigation only

The control will expose `tablist`, `tab`, `aria-selected`, roving `tabIndex`, `aria-controls`, and one associated `tabpanel`. Left/Right move between tabs, Home/End jump to boundaries, and activation updates the URL. Focus remains on the selected tab after keyboard activation.

On narrow viewports, the tab list may scroll within its own bounded container, but the document MUST NOT gain horizontal overflow. Visible focus and the selected state remain distinguishable without relying on color alone.

### Display counts from existing arrays only

Recommendations shows `recommendations.length`; Priority queue shows `priority_items.length`. Overview has no count because it contains heterogeneous facts. Empty tabs remain selectable and show their existing empty-state copy.

The counts describe returned bounded arrays, not total global quantities. Copy and accessible labels will avoid implying completeness beyond the backend snapshot.

### Render only the active panel

Only the active panel is mounted. The attention snapshot remains in the parent query cache. Overview-specific supporting queries run only when Overview is selected and reuse their existing query cache on return. No new requests or enrichment paths are added.

Alternative considered: keep all panels mounted and visually hidden. Rejected because it preserves unnecessary page work and can create confusing duplicate accessibility content.

## Risks / Trade-offs

- **[Important queue items are less visible]** → Show the queue count in its tab and keep Priority queue one keyboard/click action away; do not hide the tab when empty.
- **[Counts are mistaken for complete totals]** → Describe them as items in the bounded snapshot and reuse backend-provided arrays only.
- **[Tabs overflow on mobile]** → Constrain scrolling to the tab list, use compact labels/count badges, and add narrow-viewport overflow tests.
- **[Back navigation feels noisy]** → Use normal history entries for explicit tab selection so Back restores the previous user view; initial defaulting does not force a redirect.
- **[Overview queries refetch on each switch]** → Rely on existing TanStack Query caching and current refetch policy.
- **[Invalid section links circulate]** → Route validation deterministically falls back to Recommendations without an error page.

## Migration Plan

1. Add and test section URL parsing independently.
2. Introduce the tab shell around existing section components without changing their content.
3. Add counts, localization, keyboard behavior, and responsive styling.
4. Update component and browser tests for direct links, history, empty tabs, keyboard operation, and mobile layout.
5. Roll back by restoring stacked composition; no API, data, or migration rollback is required.

## Open Questions

None. The section model, default, URL values, count sources, and accessibility behavior are specified for implementation.
