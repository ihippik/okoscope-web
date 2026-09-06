## ADDED Requirements

### Requirement: Restart-loop attention remains operational and evidence-qualified

The Organization attention UI SHALL render contract-defined restart-loop reason codes and facts using server-provided priority, container identity, observed restart count, bounded window, projection version, latest qualified lifecycle evidence, and correlation status when supplied. It MUST NOT elevate isolated exits/restarts to attention work or describe priority as termination severity.

#### Scenario: Restart loop is in the priority queue

- **WHEN** the attention snapshot returns a restart-loop item with a typed Runtime Group resource reference
- **THEN** the UI explains the bounded derived finding, preserves its operational priority, and links to that existing runtime-group investigation

#### Scenario: Latest evidence is CrashLoopBackOff

- **WHEN** the item's latest waiting reason is `CrashLoopBackOff`
- **THEN** the UI describes it as current Kubernetes backoff context and not as the process termination cause

#### Scenario: Only SIGKILL is supplied

- **WHEN** attention facts contain kernel SIGKILL without qualified Kubernetes `OOMKilled` evidence
- **THEN** the UI does not mention OOM and states that the cause is unavailable from current evidence
