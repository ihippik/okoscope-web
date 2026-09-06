## ADDED Requirements

### Requirement: Termination presentation remains contract-derived

The Web UI SHALL consume closed process-exit, container-lifecycle, restart-loop, provenance, correlation, related-evidence, and attention variants through generated OpenAPI declarations and MUST NOT introduce handwritten transport types, untyped requests, or client-derived substitutes for absent contract fields.

#### Scenario: Required correlation field is absent

- **WHEN** the pinned contract cannot express the correlation status or bounded related evidence required by the investigation UI
- **THEN** contract verification identifies the blocker and the UI does not infer correlation from timestamps, PID, Pod name, or exit code

#### Scenario: Contract adds termination variants

- **WHEN** the pinned contract publishes the required closed unions and attention facts
- **THEN** generated types, compile-time fixtures, and query consumers narrow every supported variant without `any` or unjustified assertions
