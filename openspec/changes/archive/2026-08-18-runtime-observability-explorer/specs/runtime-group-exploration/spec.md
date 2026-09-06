## ADDED Requirements

### Requirement: Runtime groups are browsable within an Application

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/runtime-groups`, request `GET /api/v1/runtime-groups` through the generated OpenAPI client with required `project_id` and `application_id`, and present event kind, semantic summary, namespace, workload identity, status, first seen, last seen, and occurrence count for each group.

#### Scenario: Runtime groups load successfully

- **WHEN** an operator opens the Runtime Groups route for an Application
- **THEN** the UI requests only that Project and Application scope and renders the returned groups with all required operational fields

#### Scenario: A group was first observed recently

- **WHEN** a group's `first_seen_at` falls within the product-defined recent interval
- **THEN** the UI marks it with a non-color-only visual treatment that distinguishes it from older groups

### Requirement: Runtime group collection state is URL-addressable

The Web UI SHALL support event-kind, status, namespace, workload-kind, workload-name, and observation-period filters plus opaque cursor pagination in validated URL search state, and MUST omit the cursor whenever any filter changes.

#### Scenario: Filtered route is opened directly

- **WHEN** a valid Runtime Groups URL contains filters and a cursor
- **THEN** the UI restores them and includes every value in the generated-client request and query key

#### Scenario: Operator changes a filter

- **WHEN** any Runtime Groups filter is added, changed, or removed
- **THEN** router navigation preserves the other filters and removes the cursor before requesting results

#### Scenario: Operator follows the next cursor

- **WHEN** a response provides a non-null `next_cursor`
- **THEN** pagination navigates to that cursor while preserving all active filters

### Requirement: Runtime group collection states are explicit and recoverable

The Runtime Groups route SHALL distinguish loading, empty, error, and success states, SHALL offer retry for recoverable failures, and SHALL display the correlated request ID on API errors.

#### Scenario: No groups match the current scope and filters

- **WHEN** the successful page contains no items
- **THEN** the UI shows an empty state that distinguishes filtered absence from loading or failure

#### Scenario: Runtime group request fails

- **WHEN** the API request returns an error with a correlation identifier
- **THEN** the UI presents the error, request ID, and a keyboard-operable retry action

### Requirement: Runtime Group Detail exposes evidence safely

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/runtime-groups/:groupId` and show the group's event kind, semantic summary, namespace, workload identity, first seen, last seen, occurrence count, representative event, and recent occurrences including observed timestamp, node, pod, container, process command, and structured payload.

#### Scenario: Operator opens a runtime group

- **WHEN** the group detail response belongs to the Project and Application in the route
- **THEN** the UI renders the group summary, representative event, and recent occurrence timeline

#### Scenario: Detail request fails

- **WHEN** the Runtime Group Detail request fails
- **THEN** the UI shows the correlated API error and retry behavior without displaying stale detail as the requested group

### Requirement: Route ownership is enforced before detail rendering

The Web UI MUST compare a Runtime Group Detail response's `project_id` and `application_id` with both route parameters before rendering any group or occurrence data.

#### Scenario: Group belongs to another route context

- **WHEN** either ownership identifier differs from the route context
- **THEN** the UI withholds the response data and presents a scoped not-found or ownership error with navigation to the valid Application parent

### Requirement: Dynamic observability JSON is rendered safely

Semantic summaries and payloads SHALL be rendered as data without HTML interpretation, with bounded initial depth/size, long-value wrapping, understandable unknown-structure fallback, and a labeled keyboard-operable action that copies JSON from the original value.

#### Scenario: JSON contains markup-like strings

- **WHEN** a key or value contains HTML or script text
- **THEN** the viewer displays the literal text and does not create or execute markup

#### Scenario: JSON is deeply nested or unusually large

- **WHEN** the value exceeds the viewer's initial depth or rendering bound
- **THEN** the page remains usable and presents a clear collapsed or fallback representation

#### Scenario: Operator copies JSON

- **WHEN** the copy action succeeds or fails
- **THEN** the viewer copies the serialized original value when possible and announces the outcome accessibly

### Requirement: Runtime-group requests remain contract-derived

The frontend MUST implement runtime-group scope, filters, observation lower bound, and pagination through the generated OpenAPI operation and MUST NOT use local DTOs, manual untyped requests, client-side filtering of cursor pages, `any`, or unjustified type assertions.

#### Scenario: Filtered runtime-group request is built

- **WHEN** the UI requests filtered Runtime Groups results
- **THEN** required scope and every active `event_kind`, `status`, `namespace`, `workload_kind`, `workload_name`, `since`, cursor, and limit value are passed through generated-client parameters
