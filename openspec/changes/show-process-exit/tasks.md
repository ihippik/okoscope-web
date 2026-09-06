## 1. Contract readiness

- [x] 1.1 Compare the backend OpenAPI contract with the required process-exit, container-lifecycle, restart-loop, provenance, correlation, bounded related-evidence, and attention shapes; document any blocking missing fields before UI implementation
- [x] 1.2 Update the pinned `openapi/okoscope-v1.yaml` from the compatible backend contract and regenerate `src/shared/api/schema.d.ts` using the repository contract workflow
- [x] 1.3 Add compile-time contract fixtures for normal exit, signaled exit, Kubernetes termination, restart gap, CrashLoopBackOff context, restart loop, all correlation states, and restart-loop attention variants
- [x] 1.4 Extend generated query parameters and URL-state types for evidence-source and correlation-status filters only if the published runtime-group list operation supports them
- [x] 1.5 Run the generated-schema freshness and TypeScript contract checks and resolve all new closed-union exhaustiveness failures

## 2. Safe presentation model

- [x] 2.1 Add centralized typed presentation helpers for the five event kinds, native exit variants, Kubernetes reasons/waiting states, restart deltas, and restart-loop window/version facts
- [x] 2.2 Add shared accessible provenance badges for kernel, Kubernetes, and derived evidence whose styling does not encode severity
- [x] 2.3 Add correlation presentation for correlated, ambiguous, unresolved, and unavailable states without choosing candidates or using causal language
- [x] 2.4 Add source-specific explanatory copy for SIGKILL/137, core-dump flag semantics, OOMKilled authority, CrashLoopBackOff, and restart observation gaps
- [x] 2.5 Extend localization catalogs and catalog guards for event labels, evidence sources, correlation states, safety explanations, and attention reason/action copy
- [x] 2.6 Unit-test presentation helpers to prove that SIGKILL or conventional 137 alone never produces OOM language and that Kubernetes OOMKilled remains separately attributed

## 3. Runtime-group list and detail

- [x] 3.1 Add typed compact semantic-summary components for process exit, container termination, container restart, and derived restart loop while retaining bounded JSON fallback for older or future events
- [x] 3.2 Update runtime-group list cards in grid and list layouts to show provenance, discriminating facts, workload/container identity, counts, observation bounds, and bounded related-evidence summary
- [x] 3.3 Add supported evidence-source and correlation-status controls to runtime-group filters with canonical URL persistence and cursor reset behavior
- [x] 3.4 Update Runtime Group Detail to present primary typed termination and correlation evidence before expandable technical identifiers, qualifiers, timestamps, and original JSON
- [x] 3.5 Add responsive and accessible component tests for source labels, non-color meaning, long identities, absent provenance, unknown payload fallback, and keyboard-operated technical details

## 4. Investigation timeline

- [x] 4.1 Implement the list-mode semantic time rail while preserving API page order, one independent row per occurrence, and existing cursor pagination
- [x] 4.2 Add typed occurrence renderers for process exit, container termination, container restart, waiting-state context, and restart-loop evidence
- [x] 4.3 Visually cluster only qualified correlated evidence while retaining separate source rows, event identities, claims, and non-causal copy
- [x] 4.4 Render ambiguous and unresolved correlation without a connector to a chosen candidate and render restart deltas greater than one as one aggregate observation gap
- [x] 4.5 Preserve grid mode as a bounded card overview or remove its toggle only if route-level UX tests confirm the timeline is the sole supported layout
- [x] 4.6 Test event-time rendering, late/received-time details, bounded-page messaging, next-cursor behavior, narrow viewport order, correlation states, and JSON fallback

## 5. Requires attention integration

- [x] 5.1 Extend typed attention reason/fact/recommendation presentation for server-returned restart-loop findings at Organization and Application scope
- [x] 5.2 Render compact restart-loop attention copy with server priority, container, count/window, projection version, latest qualified lifecycle context, provenance, and correlation status
- [x] 5.3 Map restart-loop attention resources through the existing typed Runtime Group destination and preserve safe unavailable-action behavior for malformed or future variants
- [x] 5.4 Update the Application “Requires attention” totals/recommendations without deriving findings from paginated runtime-group or occurrence data
- [x] 5.5 Add attention tests proving that isolated exits/restarts produce no client-synthesized warning, CrashLoopBackOff is context rather than cause, and SIGKILL without Kubernetes evidence produces no OOM claim
- [x] 5.6 Verify Organization and Application attention loading, empty, error, stale-refresh, localization, keyboard, and narrow-viewport states with the new variants

## 6. End-to-end verification and documentation

- [x] 6.1 Add deterministic API fixtures covering normal status, SIGSEGV with core flag, uncorrelated SIGKILL, correlated Kubernetes OOMKilled, ambiguous correlation, restart-count jump, CrashLoopBackOff, and version-one restart loop
- [x] 6.2 Extend Playwright coverage from New discoveries through Runtime Group Detail and from “Requires attention” through the same investigation route
- [x] 6.3 Run formatting, lint, TypeScript, unit, contract, and end-to-end suites and record the verification result
- [x] 6.4 Update operator-facing frontend documentation to explain provenance, native versus conventional exit codes, qualified correlation, bounded timelines, and attention semantics
- [x] 6.5 Perform a final copy audit that rejects unsupported root-cause, OOM, crash, severity, vulnerability, incident, and core-file claims across all rendered variants
