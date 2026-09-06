## Context

Runtime Inventory already exposes a filter-aware server summary for four behavior kinds and cursor-paginated typed items. Runtime Diff exposes cursor-paginated target/baseline entries. The UI currently renders exact cards and lists, but a page is not a statistically complete population, so client-side aggregation would produce misleading percentages and rankings. Observed identity fields are untrusted inert text, and all visual additions must preserve the existing URL-addressable scope, ownership checks, request-state handling, and accessibility guarantees.

## Goals / Non-Goals

**Goals:**

- Make kind composition, dominant behaviors, and release changes understandable at a glance.
- Base every percentage and ranking on complete server-derived totals under the active normalized scope.
- Keep values inspectable as exact labelled text and make chart interactions equivalent by pointer and keyboard.
- Reuse the existing inventory and diff data vocabulary, query architecture, typed identities, and safe rendering primitives.
- Bound response size and rendering work independently of the number of matching observations or identities.

**Non-Goals:**

- Time-series charts, heatmaps, and process-domain-address relationship graphs.
- Inferring duration, transferred bytes, configured intent, risk, anomaly, or causal relationships from occurrence counts.
- Replacing evidence lists, pagination, filters, or detail routes with charts.
- Fetching all cursor pages in the browser to manufacture aggregates.

## Decisions

### Add purpose-built aggregate operations

Add an inventory distribution operation scoped by Application, inventory kind, the existing inventory filters, and a bounded `limit`. Its response carries complete `total_item_count` and `total_occurrence_count`, typed top entries, and an explicit aggregate `other` value. Add a Runtime Diff aggregate operation or an aggregate field loaded independently from the paginated entries, containing complete classification totals and a bounded ranking by absolute count delta.

The initial contract uses a default top-N of 5 and maximum of 10. Distribution entries carry an opaque server-issued `identity_token`; inventory list filtering accepts that token without exposing or reconstructing identity internals in the browser. Runtime Diff aggregates use a separate `/runtime-diff/summary` operation so aggregate caching and availability remain independent of collection cursors.

This is preferred over extending list page sizes or loading every page because it gives correct denominators, bounded latency/payloads, deterministic ordering, and query plans the backend can optimize. Existing list and diff contracts remain unchanged.

### Treat occurrence count as the only percentage measure

Kind share equals a kind's summary `occurrence_count` divided by summary `occurrence_count`. A top entry's share equals its occurrence count divided by the distribution's total occurrence count. Counts remain visible beside a locale-formatted percentage; no category is adjusted to force rounded labels to sum to 100.

The UI consistently calls these values observations. Item-count composition can be added later as an explicit alternative measure, but the initial interface does not mix unique identities and occurrences in one chart.

### Use horizontal bars and native labelled structure

Use React-rendered semantic HTML for labels, values, controls, and state handling, with CSS or small presentational SVG for bar geometry. Geometry is hidden from assistive technology; accessible names come from ordinary text. Bars retain minimum readable contrast, selected state uses more than color, focus is visible, animation is absent or respects reduced motion, and narrow layouts stack without horizontal chart scrolling.

Horizontal bars are preferred over pie/donut charts because long commands and network identities need space, close values remain comparable, and exact counts fit naturally. A chart library will only be introduced if native primitives fail verified interaction or accessibility requirements.

### Make identity filtering typed

Distribution entries use the existing discriminated inventory semantic-summary shapes. Activating an entry applies a typed identity constraint supported by the API rather than copying display text into the generic search box. This avoids ambiguous matching and keeps commands, domains, IP addresses, ports, and syscalls inert. URL state records the selected identity in a deterministic, validated form and scope changes reset incompatible identity filters and cursors.

### Separate visual queries from paginated queries

Aggregate query keys include Project, Application, normalized server-affecting scope, kind/baseline, and aggregation limit, but never list cursors. List navigation therefore cannot change a chart. Background aggregate failures preserve prior data through the existing query cache and surface a non-destructive request-ID-aware warning.

### Keep release classification and magnitude distinct

Classification totals answer what is new, disappeared, or unchanged. Ranked delta bars answer which behaviors changed most in observed frequency. New and disappeared entries calculate display delta against zero while retaining their explicit classification; unchanged means identity continuity, not equal counts. Direction and classification are always expressed in text in addition to geometry.

## Risks / Trade-offs

- **[Aggregate queries may be expensive over broad time scopes]** → Require bounded top N, index/query-plan review, deterministic ordering, response limits, and backend performance tests before enabling unrestricted scopes.
- **[Occurrence percentages can be mistaken for time or traffic share]** → Keep the denominator and “recorded observations” explanation adjacent to charts and cover terminology in UI tests.
- **[An `other` bucket hides a long tail]** → Show its exact count and percentage and retain the full filtered inventory list for investigation.
- **[Generic search plus typed selection can conflict]** → Define normalization and reset rules explicitly; preserve compatible scope and visibly expose every active constraint.
- **[Large or hostile identity strings can damage layout or accessibility]** → Reuse inert text primitives, apply bounded wrapping/truncation with full accessible text, and test markup-like fixtures.
- **[A chart dependency could increase bundle size and accessibility risk]** → Start with semantic HTML/CSS and minimal SVG; require a documented bundle and accessibility justification before adding a dependency.

## Migration Plan

1. Add backward-compatible OpenAPI aggregate schemas and operations, generated types, fixtures, and backend implementations.
2. Deploy and verify aggregate correctness against full-scope database calculations and pagination-independent contract tests.
3. Add frontend queries and visual components behind successful-operation availability; existing cards and lists remain the fallback.
4. Add interactions only after URL normalization and typed filtering are supported end to end.
5. Roll back by hiding/removing the visual queries and components; existing summary, list, and Runtime Diff operations remain compatible.

## Open Questions

- What minimum evidence coverage, if any, should accompany a comparison visualization so low-volume releases are not overinterpreted?
