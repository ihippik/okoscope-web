## ADDED Requirements

### Requirement: Requires attention surfaces restart-loop findings truthfully

The Application “Requires attention” route SHALL present server-returned restart-loop totals or recommendations with exact bounded facts and SHALL use typed resource references to open the corresponding runtime-group detail. It MUST NOT derive totals or recommendations by traversing paginated runtime-group or occurrence collections.

#### Scenario: Application has a restart-loop recommendation

- **WHEN** the Application attention response returns a restart-loop recommendation
- **THEN** the route identifies the affected container, count/window and projection facts, server priority, provenance context, and a safe Investigate action

#### Scenario: Application has ordinary process exits only

- **WHEN** no restart-loop attention item or recommendation is present even though process-exit discoveries exist
- **THEN** the route does not synthesize a termination warning and retains the server-provided no-action-needed state

### Requirement: Attention correlation copy preserves source authority

Application attention cards SHALL distinguish kernel, Kubernetes, and derived evidence and SHALL describe qualified correlation without claiming that SIGKILL or conventional code 137 proves OOM.

#### Scenario: Qualified OOMKilled evidence accompanies SIGKILL

- **WHEN** a restart-loop recommendation includes correlated kernel SIGKILL and Kubernetes `OOMKilled`
- **THEN** the card attributes OOMKilled to Kubernetes/runtime and directs the operator to the detailed source-separated investigation
