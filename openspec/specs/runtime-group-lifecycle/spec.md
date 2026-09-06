# runtime-group-lifecycle Specification

## Purpose

Defines valid, deliberate, correlated Runtime Group lifecycle transitions and the query refresh behavior that follows them.

## Requirements

### Requirement: Lifecycle controls expose only valid transitions

The Runtime Group Detail UI SHALL derive available acknowledge, resolve, and reopen actions from the group's current generated lifecycle status and MUST NOT present an action that is invalid for that status.

#### Scenario: Group status determines controls

- **WHEN** Runtime Group Detail renders an open, acknowledged, or resolved group
- **THEN** only transitions permitted by the API lifecycle for that current status are shown with accessible text labels

### Requirement: Lifecycle mutations are deliberate and non-duplicating

The Web UI SHALL call the generated acknowledge, resolve, and reopen operations, SHALL prevent repeated lifecycle submission while a mutation is pending, SHALL require explicit user confirmation before resolve, and SHALL allow acknowledge and reopen without modal confirmation.

#### Scenario: Operator resolves a group

- **WHEN** the operator activates Resolve
- **THEN** an accessible confirmation flow receives focus and the resolve request is sent only after confirmation

#### Scenario: Operator acknowledges or reopens a group

- **WHEN** the operator activates an available Acknowledge or Reopen action
- **THEN** the corresponding request begins without a modal confirmation

#### Scenario: Mutation is pending

- **WHEN** any lifecycle mutation is in flight
- **THEN** lifecycle controls prevent another submission and expose their pending state accessibly

### Requirement: Successful transitions refresh every related view

After a successful lifecycle mutation, the Web UI SHALL invalidate the Runtime Group Detail and all related Runtime Groups collection queries through TanStack Query so that status and transition controls are refetched consistently.

#### Scenario: Lifecycle mutation succeeds

- **WHEN** acknowledge, resolve, or reopen succeeds
- **THEN** detail and related Application-scoped group lists are invalidated and refreshed before the UI offers transitions based on stale status

### Requirement: Lifecycle failures are safe and correlated

A failed lifecycle mutation SHALL preserve the last confirmed group state, SHALL display a safe contextual error and request ID, and SHALL restore usable controls after the mutation settles.

#### Scenario: Lifecycle mutation fails

- **WHEN** the API rejects a lifecycle transition or the request fails
- **THEN** the UI shows a safe error with the best available request ID, does not claim the transition succeeded, and permits an appropriate retry
