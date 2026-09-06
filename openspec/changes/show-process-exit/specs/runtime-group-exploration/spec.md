## ADDED Requirements

### Requirement: Runtime groups summarize termination and restart evidence compactly

Runtime-group list and detail views SHALL provide typed compact summaries for `process.exit`, `container.terminated`, `container.restart`, and `container.restart_loop` with provenance, discriminating termination facts, workload/container identity, lifecycle status, occurrence count, and observation bounds. They MUST NOT require raw JSON inspection for the primary meaning of a supported event.

#### Scenario: Exit group appears in the list

- **WHEN** a process-exit group is returned
- **THEN** its card identifies Process terminated, its kernel provenance, native status or signal, workload identity, occurrence count, and first/last observation without assigning severity

#### Scenario: Restart-loop group appears in the list

- **WHEN** a restart-loop group is returned
- **THEN** its card identifies a Derived finding and displays container, bounded count/window facts, and latest qualified lifecycle state when supplied

### Requirement: Evidence filters preserve server scope

The runtime-group route SHALL expose evidence-source and correlation-status URL filters only when the generated list operation supports them, SHALL include supported values in query identity and navigation state, and MUST NOT filter a cursor page in the browser as a substitute.

#### Scenario: Evidence-source filter is supported

- **WHEN** an operator selects Kubernetes evidence
- **THEN** the validated URL, generated request, and query key carry the filter and any previous cursor is removed

#### Scenario: Evidence filter is absent from the contract

- **WHEN** the generated operation has no evidence-source filter
- **THEN** the UI omits that filter instead of applying it to only the currently loaded page

### Requirement: Group detail separates primary and technical evidence

Runtime Group Detail SHALL present typed operator-facing termination and correlation facts before a bounded expandable technical region containing generated identifiers, qualifiers, receive-time metadata, and original payload. Unknown future payloads SHALL retain the safe JSON fallback.

#### Scenario: Operator investigates correlated termination

- **WHEN** group detail includes qualified kernel and Kubernetes evidence
- **THEN** the UI shows source-separated facts and correlation explanation before technical identifiers or JSON
