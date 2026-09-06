## Context

The current observability UI treats runtime groups uniformly. Known network and file variants receive typed summaries, while unknown semantic summaries and occurrence payloads fall back to bounded JSON. Occurrences render as independent cards rather than a chronological investigation, and the Application “Requires attention” route understands only the existing contract-defined reasons and facts.

The backend `observe-process-termination-and-restarts` change deliberately separates three authorities: native kernel process termination, Kubernetes/runtime container state, and versioned server-derived restart-loop findings. Cross-source correlation is qualified evidence and never permits the UI to rewrite one source's claim. In particular, `SIGKILL` and the shell convention 137 do not prove OOM; only Kubernetes/runtime evidence can report `OOMKilled`. The frontend must retain this distinction in short summaries as well as technical detail.

## Goals / Non-Goals

**Goals:**

- Give all termination and restart variants compact, typed, accessible presentation across group list, group detail, occurrences, and attention.
- Use one visual and textual provenance vocabulary for `kernel`, `kubernetes`, and `derived` evidence without encoding severity.
- Present correlated events together in event-time order while retaining their independent claims and identifiers.
- Explain ambiguous, unresolved, and observation-gap states rather than filling missing evidence.
- Route server-selected restart-loop attention work to the existing runtime-group investigation.
- Preserve bounded JSON and technical metadata as a secondary diagnostic surface.

**Non-Goals:**

- Inferring root cause, OOM, signal sender, severity, vulnerability, or incident status in the browser.
- Reconstructing correlation, restart-loop windows, attention priority, or missing restart timestamps client-side.
- Turning every non-zero exit, signal, container termination, restart, or `CrashLoopBackOff` state into attention work.
- Adding live streaming, unbounded Pod history, core-file inspection, stack traces, or symbolication.
- Creating a separate termination dashboard or changing runtime-group lifecycle semantics.

## Decisions

### 1. Treat provenance and operational priority as independent dimensions

Introduce a shared evidence-source presentation primitive with explicit text for Kernel evidence, Kubernetes evidence, and Derived finding. Its color and icon identify authority only. Existing attention priority badges continue to describe server-provided operational triage and are never computed from event kind, signal, reason, or source.

Using warning colors as provenance was rejected because it would imply that `SIGKILL`, `OOMKilled`, or `CrashLoopBackOff` automatically has product severity.

### 2. Dispatch closed generated unions to typed presentation models

Regenerate the OpenAPI declaration and narrow the contract-provided discriminated unions in presentation helpers. Each supported semantic summary and payload maps to a title, primary fact, secondary qualifier, provenance, and optional safety explanation. Unknown future and older payloads retain the existing bounded JSON fallback and show source as unavailable when absent.

Handwritten transport DTOs and structural guessing from arbitrary keys were rejected because they can drift from the contract and collapse native, runtime, and conventional exit semantics.

### 3. Use source-specific safe copy

Kernel normal exit renders native status. Kernel signal exit renders canonical signal name and number; conventional `128 + signal` is subordinate and explicitly labeled a derived convention. The wait-status core flag says only “Core-dump flag set” and explains that a core file is not confirmed. Kubernetes termination renders runtime reason and runtime exit code. `CrashLoopBackOff` renders as a current waiting/backoff state, never a termination cause. Restart loops state their projection version, exact bounded window, and observed count.

A generic “Process crashed” or “OOM crash” title was rejected because it makes unsupported causal and severity claims.

### 4. Keep list cards compact and reserve correlation detail for investigation

Runtime-group list cards show event title, source badge, most discriminating semantic fact, workload/container identity, observation count, first/last seen, and a small related-evidence summary when the contract supplies it. They do not embed all correlated occurrences. Event source and correlation status become URL filters only if the generated list operation supports them; no cursor-page client filtering is allowed.

Rendering a full multi-source timeline in every list card was rejected for density, performance, and bounded-pagination reasons.

### 5. Make list-mode occurrences an event-time investigation timeline

The group detail occurrence list becomes a semantic ordered list with a visible time rail. Each item remains an independent occurrence with its own time, source badge, typed facts, and expandable technical details. Qualified related evidence may be visually clustered or connected, but correlation does not create a synthetic event or merge payloads. Grid mode may remain as an alternate card overview, while DOM order follows the API page order.

Ambiguous correlation displays the candidate count or contract-provided explanation without drawing a link to one candidate. Unresolved correlation states that no qualified match is available. A restart delta greater than one renders one aggregate transition and explicitly says that individual timestamps are unavailable.

Client-side global reordering across cursor pages was rejected because it could misrepresent bounded server order and late-event semantics.

### 6. Keep primary evidence concise and technical evidence expandable

Typed occurrence cards expose operator-facing facts first. PID/TGID, generation, raw wait status, Pod UID, runtime container ID, correlation identifiers/qualifiers, receive time, and original payload remain in an inert bounded details region. Existing JSON copying remains available for the original value.

Raw JSON as the primary view was rejected because operators would have to rediscover provenance and safety semantics on every investigation.

### 7. Extend attention only through typed server-provided findings

Add contract-supported restart-loop attention reason/facts and recommendations to the Organization and Application attention presentations. The compact item states container, observed restart count, bounded window, projection version, latest qualified waiting/runtime evidence, and correlation status when supplied. Its action uses the existing typed runtime-group resource reference. The frontend preserves server order and priority.

Synthesizing attention items from runtime-group or occurrence pages was rejected because those collections are paginated and cannot provide truthful organization/application totals or priority.

### 8. Centralize copy and test the unsafe inference boundaries

Event labels, evidence explanations, correlation labels, and attention reason text live in presentation/localization helpers rather than being assembled ad hoc in routes. Tests explicitly cover SIGKILL without runtime evidence, correlated SIGKILL plus Kubernetes `OOMKilled`, runtime exit code 137, `CrashLoopBackOff`, ambiguous correlation, core flag semantics, restart observation gaps, and older events without provenance.

## Risks / Trade-offs

- **[Risk] Backend contract lacks a field required for truthful presentation** → Treat it as an explicit contract blocker; do not add local inference or untyped mocks to production code.
- **[Risk] Dense provenance and correlation labels overwhelm compact cards** → Limit list cards to primary semantics and one bounded related-evidence line; move qualifiers into detail.
- **[Risk] Visual connectors imply causality** → Label them “correlated evidence,” use source-specific rows, and never use arrows or causal language.
- **[Risk] Cursor pages or late evidence appear out of global chronological order** → Preserve server page order, state that the view is bounded, and avoid client-side cross-page reconstruction.
- **[Risk] New attention facts are absent on older servers** → Compatibility and generated-contract checks gate the feature; optional additive evidence renders as unavailable without inventing zeros.
- **[Trade-off] Repeated provenance labels consume space** → Keep them visible because source authority is material evidence, including when a view is filtered by source.

## Migration Plan

1. Pin the backend OpenAPI contract containing typed termination/lifecycle unions, provenance, qualified correlation, restart-loop facts, and attention variants.
2. Regenerate schema declarations and add compile-time contract fixtures before enabling typed rendering.
3. Add presentation helpers and components while retaining bounded JSON fallback for older/unknown events.
4. Integrate compact summaries into runtime-group list/detail and the bounded occurrence timeline.
5. Integrate restart-loop reasons and recommendations into Organization/Application attention surfaces.
6. Run unit, accessibility-responsive, contract, and end-to-end regression coverage against correlated and uncorrelated fixtures.
7. Roll back presentation components if necessary; no frontend data migration is required and source events remain readable through the fallback.

## Open Questions

- Will related evidence be embedded as a bounded collection on group/occurrence responses, or exposed through a separate bounded generated operation?
- Does the list operation expose `evidence_source` and `correlation_status` filters, or should v1 limit those controls to detail presentation?
- Which server reason codes and fact field names will represent restart-loop attention consistently at Organization and Application scope?
- Does the backend guarantee event-time ordering within each occurrence page, including late accepted events, or must the UI label the returned order more neutrally?
