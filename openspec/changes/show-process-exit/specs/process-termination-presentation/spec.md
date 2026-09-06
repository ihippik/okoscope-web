## ADDED Requirements

### Requirement: Termination evidence uses explicit provenance

The Web UI SHALL label every supported process-exit, container-lifecycle, and restart-loop summary and occurrence as `kernel`, `kubernetes`, or `derived` according to the generated response and MUST NOT use provenance styling as a severity, risk, vulnerability, or incident label.

#### Scenario: Kernel exit is displayed

- **WHEN** a `process.exit` summary or occurrence reports evidence source `kernel`
- **THEN** the UI displays a textual Kernel evidence label together with its native termination facts

#### Scenario: Older evidence lacks provenance

- **WHEN** a readable older event has no evidence-source field
- **THEN** the UI identifies provenance as unavailable and does not infer it from an arbitrary payload field

### Requirement: Native and conventional exit semantics remain distinct

The Web UI SHALL display a normal process status or a terminating signal as mutually exclusive native kernel facts. It SHALL label `128 + signal` as a derived conventional exit code, SHALL describe the core-dump bit only as a kernel flag, and MUST NOT claim that a core file exists.

#### Scenario: SIGKILL has no runtime evidence

- **WHEN** kernel evidence reports `SIGKILL` signal 9 and optional conventional code 137 without qualified Kubernetes evidence
- **THEN** the UI states that the process was terminated by SIGKILL and that OOM cause is unknown from this evidence

#### Scenario: Core flag is set

- **WHEN** a signal termination reports `core_dump_flag=true`
- **THEN** the UI says the core-dump flag was set and explains that creation of a core file is not confirmed

### Requirement: Kubernetes termination and waiting state remain separate

The Web UI SHALL present Kubernetes/runtime termination reason and runtime exit code as Kubernetes evidence and SHALL present a current waiting reason such as `CrashLoopBackOff` as a distinct state rather than a termination cause.

#### Scenario: Runtime reports OOMKilled

- **WHEN** `container.terminated` reports reason `OOMKilled` and runtime exit code 137
- **THEN** the UI attributes both facts to Kubernetes/runtime evidence without saying that the kernel observed OOM

#### Scenario: CrashLoopBackOff follows termination

- **WHEN** Kubernetes evidence includes a previous termination and current waiting reason `CrashLoopBackOff`
- **THEN** the UI presents both facts separately and labels CrashLoopBackOff as a waiting/backoff state

### Requirement: Restart evidence does not fabricate occurrences

The Web UI SHALL display a positive restart-count transition with its new count and observed delta and MUST render a delta greater than one as one aggregate observation gap without inventing individual restart timestamps.

#### Scenario: Restart count jumps

- **WHEN** `container.restart` reports count 7, delta 3, and an observation-gap marker
- **THEN** the UI states that the count increased from 4 to 7 between observations and that exact individual restart times are unavailable

### Requirement: Restart-loop findings explain their bounded derivation

The Web UI SHALL label `container.restart_loop` as derived evidence and SHALL display projection version, threshold or observed count, and bounded window facts supplied by the API without recomputing the finding.

#### Scenario: Version-one loop is displayed

- **WHEN** a derived loop reports four observed restarts in a rolling ten-minute window under projection version 1
- **THEN** the UI displays those exact facts and does not present the finding as an independently observed crash cause

### Requirement: Cross-source correlation remains qualified

The Web UI SHALL preserve each correlated source occurrence independently, SHALL explain `correlated`, `ambiguous`, and `unresolved` status using generated qualifiers, and MUST NOT choose an ambiguous candidate or rewrite one source's claim as another's.

#### Scenario: SIGKILL correlates with OOMKilled

- **WHEN** qualified evidence relates kernel SIGKILL and Kubernetes `OOMKilled` within one trusted container lifetime
- **THEN** the UI presents both source rows together and states that OOMKilled is reported by Kubernetes rather than inferred from SIGKILL

#### Scenario: Multiple kernel candidates exist

- **WHEN** a Kubernetes termination has ambiguous correlation with multiple candidate exits
- **THEN** the UI reports ambiguity and draws no relationship to one arbitrarily selected candidate
