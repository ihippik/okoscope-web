## Why

Application Activity exposes exact counts and evidence, but operators must mentally compare many cards and paginated rows to understand which behaviors dominate and what changed between releases. Scope-aware visual summaries will make distributions and release changes understandable at a glance without presenting partial pages as complete statistics.

## What Changes

- Add compact, accessible distribution visualizations for the four activity kinds using the existing Runtime Inventory summary.
- Add bounded server-side aggregation for the top processes, destinations, domains, and syscalls in the active inventory scope, including explicit totals and an `other` bucket.
- Add interactive top-behavior bar charts that preserve the active release, Kubernetes, search, and observation-time filters and can narrow the inventory list.
- Add an aggregate Runtime Diff summary and a count-change visualization for target-versus-baseline releases.
- Define percentage denominators, observation terminology, empty/error states, inert rendering, responsive behavior, and non-color cues so charts cannot imply duration, traffic volume, risk, or completeness from paginated data.
- Defer time-series charts and relationship graphs until the backend can provide bounded time buckets and graph-oriented aggregates.

## Capabilities

### New Capabilities

- `runtime-data-visualization`: Scope-aware aggregate API contracts and accessible visual presentation of activity distributions and top observed behaviors.

### Modified Capabilities

- `runtime-inventory-exploration`: Extend the inventory summary area with visual kind distribution and top-behavior interactions while retaining server-derived totals and active scope.
- `release-runtime-comparison`: Extend Runtime Diff with server-derived classification totals and a visual comparison of occurrence-count changes.

## Impact

- Adds OpenAPI schemas and operations for bounded inventory distribution and Runtime Diff summary data.
- Affects Runtime Inventory and Runtime Diff routes, query keys, generated API types, fixtures, tests, and responsive/accessibility styling.
- May introduce a lightweight charting dependency only if native React/SVG primitives cannot meet accessibility, bundle-size, and interaction requirements; the preferred implementation uses existing UI primitives and CSS/SVG.
- Does not change existing list, summary, facet, evidence, or Runtime Diff pagination contracts.
