## 1. Aggregate API Contracts

- [x] 1.1 Resolve the distribution top-N bounds, typed identity-filter encoding, and Runtime Diff aggregate transport decisions documented as open questions
- [x] 1.2 Extend the OpenAPI contract with normalized inventory distribution query parameters and bounded total, top-entry, and `other` response schemas
- [x] 1.3 Extend the OpenAPI contract with complete Runtime Diff classification totals and bounded absolute-delta ranking schemas
- [x] 1.4 Regenerate API schema types and add compile-time contract fixtures for all inventory kinds, `other`, empty aggregates, and new/disappeared diff entries
- [x] 1.5 Verify or coordinate backend aggregate implementations with deterministic ordering, complete-scope totals, input limits, ownership checks, and query-performance coverage

## 2. Query and Presentation Foundations

- [x] 2.1 Add normalized aggregate query builders and keys that include Project, Application, active scope, kind or release baseline, and limit while excluding collection cursors
- [x] 2.2 Add pure helpers for safe percentage calculation, locale-formatted count/percentage labels, signed deltas, and zero-total handling
- [x] 2.3 Add typed inert labels for process, destination, domain, and syscall aggregate identities without automatic links or HTML/Markdown interpretation
- [x] 2.4 Build an accessible reusable horizontal-bar primitive with semantic text, keyboard focus support, responsive layout, non-color cues, and reduced-motion behavior
- [x] 2.5 Add component tests for rounding, zero totals, long/hostile labels, assistive names, keyboard operation, focus indication, narrow layouts, and non-color meaning

## 3. Runtime Inventory Visualizations

- [x] 3.1 Replace the four summary cards with a kind-composition visualization that retains item counts, shows occurrence shares and denominators, and activates a kind
- [x] 3.2 Add the active-kind top-behavior distribution with absolute counts, percentages, explicit `other`, and observation—not duration, traffic, intent, or risk—terminology
- [x] 3.3 Add typed identity selection to validated URL state and API parameters, preserving compatible filters and resetting incompatible identity state and list cursors
- [x] 3.4 Implement loading, empty, initial-error, unauthorized, not-found, invalid-scope, and stale-refresh states with retry and request-ID handling
- [x] 3.5 Extend Runtime Inventory fixtures and tests to prove charts use server totals rather than list pages and remain stable across list pagination and active filters

## 4. Release Comparison Visualizations

- [x] 4.1 Add complete new, disappeared, and unchanged classification totals to the Runtime Diff route independently of the current cursor page
- [x] 4.2 Add the bounded largest-change visualization with typed identity, classification, baseline count, target count, signed delta, and explicit direction text
- [x] 4.3 Preserve target/baseline ownership validation and implement aggregate loading, no-baseline, empty, error, stale-refresh, retry, and request-ID states
- [x] 4.4 Extend Runtime Diff fixtures and tests for multi-page completeness, increases, decreases, equal counts, new/disappeared zero-side calculation, and inert hostile identities

## 5. Verification and Delivery

- [x] 5.1 Run generated-type checks, unit/component tests, lint, and production build and resolve regressions
- [x] 5.2 Add end-to-end coverage for filtered inventory percentages, keyboard chart filtering, cursor independence, release aggregate completeness, responsive presentation, and retry states
- [x] 5.3 Verify chart text and interactions against WCAG keyboard, focus, contrast, zoom, screen-reader, reduced-motion, and color-independent requirements
- [ ] 5.4 Measure aggregate query latency and response bounds on representative high-cardinality data and document the accepted top-N limits
- [x] 5.5 Update user-facing and API documentation with denominator definitions, aggregation semantics, limitations, and examples
