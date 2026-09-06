## ADDED Requirements

### Requirement: Occurrences form a bounded investigation timeline

The list occurrence layout SHALL render the server-returned bounded page as a semantic ordered timeline with visible event time, evidence source, typed event facts, and expandable technical details for each independent occurrence. It MUST NOT imply that the page is an unbounded or globally reconstructed Pod history.

#### Scenario: Multiple evidence sources are returned

- **WHEN** a page contains kernel exit, Kubernetes termination/restart, waiting-state context, and derived loop evidence
- **THEN** the timeline retains one source-labeled entry per occurrence in returned event-time order and remains readable without color

#### Scenario: Operator uses a narrow viewport

- **WHEN** the investigation timeline is displayed at the minimum supported width
- **THEN** times, source labels, facts, correlation explanations, and details remain in semantic DOM order without horizontal page scrolling

### Requirement: Timeline correlation does not become causation

The occurrence timeline MAY visually cluster qualified related evidence but SHALL keep source rows and claims separate, SHALL use non-causal language, and MUST NOT create a synthetic occurrence for a correlation relationship.

#### Scenario: Correlated sources agree on the container lifetime

- **WHEN** the API qualifies a kernel exit and Kubernetes termination as correlated
- **THEN** the timeline labels them correlated evidence and preserves both original event identities and claims

#### Scenario: Correlation is unresolved

- **WHEN** an occurrence reports unresolved correlation
- **THEN** the timeline states that no qualified match is available without hiding the independently useful occurrence

### Requirement: Timeline pagination preserves bounded server semantics

The Web UI SHALL preserve API page order and cursor behavior and MUST NOT reorder or merge events across unloaded cursor pages in an attempt to reconstruct a global timeline.

#### Scenario: More evidence is available

- **WHEN** the occurrence response supplies a next cursor
- **THEN** the UI identifies the displayed evidence as bounded and requests the next server page only after operator action
