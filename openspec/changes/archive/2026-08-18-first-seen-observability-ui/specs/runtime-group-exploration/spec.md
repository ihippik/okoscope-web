## MODIFIED Requirements

### Requirement: Runtime groups are browsable within an Application

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/runtime-groups`, request `GET /api/v1/runtime-groups` through the generated OpenAPI client with required `project_id` and `application_id`, and present event kind, semantic summary, Kubernetes identity, release attribution, lifecycle status, first seen, last seen, and occurrence count for each group.

#### Scenario: Runtime groups load successfully

- **WHEN** an operator opens the Runtime Groups route for an Application
- **THEN** the UI requests only that Project and Application scope and renders the returned groups with all required operational fields and accessible status text

#### Scenario: A group was first observed recently

- **WHEN** a group's valid `first_seen_at` falls within the product-defined recent interval
- **THEN** the UI marks it with a non-color-only “Recently first seen” treatment that does not imply risk or severity

### Requirement: Runtime group collection state is URL-addressable

The Web UI SHALL support event-kind, lifecycle status (`open`, `acknowledged`, or `resolved`), release, first-seen from/to, and last-seen filters, SHALL retain other contract-supported filters, and SHALL represent opaque cursor pagination in validated URL search state. The Web UI MUST omit the cursor whenever any filter changes and MUST preserve the complete filters and cursor state across detail navigation and browser Back.

#### Scenario: Filtered route is opened directly

- **WHEN** a valid Runtime Groups URL contains filters and a cursor
- **THEN** the UI restores them and includes every value in the generated-client request and query key

#### Scenario: Operator changes a filter

- **WHEN** any Runtime Groups filter is added, changed, or removed
- **THEN** router navigation preserves the other filters and removes the cursor before requesting results

#### Scenario: Operator follows the next cursor

- **WHEN** a response provides a non-null `next_cursor`
- **THEN** pagination navigates to that cursor while preserving all active filters

#### Scenario: Operator returns from group detail

- **WHEN** an operator opens a group from a filtered cursor page and navigates Back
- **THEN** the list restores the same canonical filters and cursor state

### Requirement: Runtime Group Detail exposes evidence safely

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/runtime-groups/:groupId` and show `first_seen_at`, `first_seen_event_id`, `last_seen_at`, `occurrence_count`, lifecycle status, `status_changed_at`, representative event, semantic summary, Kubernetes attribution, release attribution, and notification summary. It MUST render only operator-facing fields and MUST NOT display internal credentials, webhook signing secrets, or arbitrary secret-bearing response fields.

#### Scenario: Operator opens a runtime group

- **WHEN** the group detail response belongs to the Project and Application in the route
- **THEN** the UI renders all required group metadata and evidence with labels that remain understandable without color

#### Scenario: Detail contains internal fields

- **WHEN** a generated response includes credentials, signing secrets, or other internal-only fields
- **THEN** the UI omits those fields rather than generically dumping the response object

#### Scenario: Detail request fails

- **WHEN** the Runtime Group Detail request fails
- **THEN** the UI shows the correlated API error and retry behavior without displaying stale detail as the requested group

### Requirement: Runtime-group requests remain contract-derived

The frontend MUST implement runtime-group scope, every supported event-kind/status/release/first-seen/last-seen and retained filter, and pagination through the generated OpenAPI operation and MUST NOT use local DTOs, manual untyped requests, client-side filtering of cursor pages, `any`, or unjustified type assertions.

#### Scenario: Filtered runtime-group request is built

- **WHEN** the UI requests filtered Runtime Groups results
- **THEN** required scope, every active filter, cursor, and bounded limit value are passed through generated-client parameters and included in query identity
