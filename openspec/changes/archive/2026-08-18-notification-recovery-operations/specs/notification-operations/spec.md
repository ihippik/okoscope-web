## ADDED Requirements

### Requirement: Delivery views expose recovery entry points

Delivery detail SHALL expose server-authorized retry and cancel actions, and notification history SHALL expose a bulk retry entry point plus navigation to recovery audit history.

#### Scenario: Operator investigates a delivery

- **WHEN** delivery detail is rendered
- **THEN** retry and cancel controls reflect `retry_allowed` and `cancel_allowed` rather than client-derived status rules

#### Scenario: Operator opens notification history

- **WHEN** the Notifications route is rendered
- **THEN** bulk retry and recovery history are available as clearly labelled operational actions
