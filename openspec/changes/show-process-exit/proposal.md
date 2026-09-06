## Why

The backend change `observe-process-termination-and-restarts` adds source-qualified process-exit and Kubernetes container-lifecycle evidence, but the Web UI cannot yet explain those events without falling back to raw JSON. Operators need a compact investigation experience that preserves what the kernel, Kubernetes, and derived projections each actually prove, especially without inferring OOM from `SIGKILL` or conventional exit code 137.

## What Changes

- Present `process.exit`, `container.terminated`, `container.restart`, Kubernetes `CrashLoopBackOff` waiting state, and `container.restart_loop` with concise typed labels and source badges.
- Preserve `kernel`, `kubernetes`, and `derived` provenance in runtime-group lists, group detail, occurrence cards, and investigation timelines.
- Present qualified cross-source correlation without merging source claims, choosing ambiguous candidates, or describing SIGKILL/137 as proof of OOM.
- Add a compact chronological investigation timeline that relates bounded kernel, Kubernetes, and derived evidence while retaining each occurrence as an independent fact.
- Add restart-loop findings to the Application “Requires attention” experience using server-provided priority, reason, facts, and safe runtime-group navigation; ordinary exits and isolated restarts do not become attention findings solely because of their event type.
- Keep technical identifiers and original typed payloads available in bounded, expandable details while making the primary presentation understandable without inspecting JSON.
- Extend generated-contract fixtures, localization, accessibility, responsive behavior, and regression coverage for the new evidence variants.

## Capabilities

### New Capabilities

- `process-termination-presentation`: Source-qualified, correlation-safe presentation of process exits, container termination/restarts, waiting states, and derived restart loops across runtime investigation surfaces.

### Modified Capabilities

- `api-client-foundation`: Consume the published typed termination, lifecycle, provenance, correlation, restart-loop, and attention fields exclusively through regenerated OpenAPI declarations.
- `runtime-group-exploration`: Add compact termination and restart summaries, provenance/correlation filters where supported, and evidence-aware group detail.
- `runtime-occurrence-exploration`: Replace raw-JSON-only termination rendering with a bounded correlated investigation timeline that preserves event-time and observation gaps.
- `organization-attention-triage`: Explain restart-loop attention items without presenting operational priority as severity or promoting unsupported causes.
- `application-attention-guidance`: Surface restart-loop findings and recommendations on the Application “Requires attention” route with truthful bounded evidence.

## Impact

- Affects the generated OpenAPI schema and types, observability presentation helpers and components, runtime-group list/detail routes and URL state, attention components and routing, localization catalogs, and unit/end-to-end fixtures.
- Depends on the backend publishing closed typed event unions, explicit evidence source and correlation status, bounded related evidence, restart-loop window/version facts, and attention reason/fact variants.
- Introduces no new frontend service, persistence mechanism, or untyped API path; older events with absent additive evidence remain readable with neutral unavailable provenance.
