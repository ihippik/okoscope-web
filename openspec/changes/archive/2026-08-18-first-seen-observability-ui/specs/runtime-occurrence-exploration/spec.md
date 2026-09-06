## ADDED Requirements

### Requirement: Operators can browse bounded occurrence pages

The Web UI SHALL request `GET /api/v1/runtime-groups/{group_id}/occurrences` through the generated client with an opaque cursor and a bounded page size, SHALL load only the requested page, and SHALL include group ID, cursor, and limit in query identity.

#### Scenario: First occurrence page loads

- **WHEN** an operator opens occurrences for a Runtime Group
- **THEN** the UI requests one bounded page for that group and does not automatically fetch all remaining occurrences

#### Scenario: Operator follows the next cursor

- **WHEN** a successful occurrence page supplies `next_cursor` and the operator activates Next
- **THEN** the UI requests that cursor while retaining the bounded page size and group context

### Requirement: Occurrences expose operational evidence safely

Each occurrence SHALL show observed time, process command, event kind, payload, node, namespace, Pod, container, and release attribution when supplied by the generated response. Dynamic payloads MUST be rendered as bounded text-only data without HTML interpretation.

#### Scenario: Occurrence evidence is available

- **WHEN** an occurrence includes runtime, Kubernetes, release, and payload fields
- **THEN** the UI presents each field with an explicit label and safely renders the payload

#### Scenario: Optional attribution is absent

- **WHEN** an occurrence omits optional node, namespace, Pod, container, or release attribution
- **THEN** the UI presents a neutral unavailable value without inventing attribution

### Requirement: Occurrence collection states are explicit and accessible

The occurrence view SHALL provide distinguishable skeleton/loading, empty, error, success, and pagination states, SHALL expose a correlated request ID and retry for recoverable API failures, and SHALL keep controls keyboard-operable with visible focus.

#### Scenario: No occurrences are returned

- **WHEN** a successful occurrence page contains no items
- **THEN** the UI displays an occurrence-specific empty state rather than loading or failure UI

#### Scenario: Occurrence request fails

- **WHEN** the request fails with a correlation identifier
- **THEN** the UI displays a safe error, request ID, and keyboard-operable retry action

#### Scenario: Layout becomes narrow

- **WHEN** the occurrence view is displayed at a supported narrow viewport
- **THEN** evidence and pagination remain readable and operable without changing semantic or tab order
