## ADDED Requirements

### Requirement: Single-delivery recovery is explicit and idempotent

The Web UI SHALL offer retry and cancel only when the delivery response authorizes the corresponding action, MUST require confirmation, and MUST send a non-persisted `Idempotency-Key` for each confirmed command.

#### Scenario: Operator retries an eligible delivery

- **WHEN** `retry_allowed` is true and the operator confirms retry
- **THEN** the UI sends one retry command, disables duplicate submission, and presents the typed recovery result

#### Scenario: Operator cancels an eligible delivery

- **WHEN** `cancel_allowed` is true and the operator confirms cancellation
- **THEN** the UI explains that pending delivery stops, sends one cancel command, and refreshes affected server data

### Requirement: Bulk retry is bounded by the contract

The Web UI SHALL expose only OpenAPI-supported bulk filters, MUST require confirmation, SHALL constrain limit to 1–200, and MUST send an `Idempotency-Key` without browser persistence.

#### Scenario: Operator confirms bulk retry

- **WHEN** valid optional filters and limit are confirmed
- **THEN** the UI sends the generated request body and presents selected, retried, skipped, remaining, has-more, and replayed fields

### Requirement: Recovery conflicts are safe and correlated

The Web UI SHALL present structured command failures through the shared API error layer, including safe message, error code, and copyable request ID, without raw exceptions or automatic command replay.

#### Scenario: Recovery state changed concurrently

- **WHEN** a command returns HTTP 409
- **THEN** the confirmation surface shows correlated conflict diagnostics and lets the operator close or deliberately retry after refreshed data

### Requirement: Recovery operations are auditable

The Web UI SHALL provide cursor-paginated recovery-operation history filtered only by documented `command_type`, and SHALL provide detail with aggregate outcome and affected deliveries.

#### Scenario: Operator browses recovery history

- **WHEN** the server returns operations and a next cursor
- **THEN** the UI renders command, outcome, actor, request ID, counts, timestamps, and URL-addressable next-page navigation

#### Scenario: Operator opens recovery detail

- **WHEN** a recovery operation detail is returned
- **THEN** the UI renders its aggregate fields and affected delivery IDs, generations, actions, and timestamps without sensitive payloads

### Requirement: Recovery workflows are accessible

Recovery forms, confirmations, outcomes, history, and detail SHALL be keyboard-operable, responsive, correctly labelled, and convey status independently of color with live command feedback.

#### Scenario: Operator uses assistive input

- **WHEN** the operator navigates or submits recovery controls without a pointing device
- **THEN** focus, labels, dialog descriptions, pending state, and results remain understandable and operable
