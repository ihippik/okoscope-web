## MODIFIED Requirements

### Requirement: Runtime groups are browsable within an Application

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/runtime-groups`, request `GET /api/v1/runtime-groups` through the generated OpenAPI client with required `project_id` and `application_id`, and present the collection as New discoveries. Each discovery SHALL show its behavior type, semantic summary, Kubernetes location, release attribution, review status, first observed time, last observed time, and observation count. The UI MUST explain that a discovery is newly observed behavior and MUST NOT imply threat, incident, vulnerability, or severity solely because a group exists or was recently first seen.

#### Scenario: New discoveries load successfully

- **WHEN** an operator opens the existing Runtime Groups route for an Application
- **THEN** the UI requests only that Project and Application scope and renders the returned groups as New discoveries with operational fields and accessible review status text

#### Scenario: A discovery was first observed recently

- **WHEN** a group's valid `first_seen_at` falls within the product-defined recent interval
- **THEN** the UI marks it with a non-color-only “Newly observed” treatment that does not imply risk or severity

#### Scenario: Operator needs the internal event kind

- **WHEN** a discovery contains an implementation-oriented event kind
- **THEN** the UI presents an understandable behavior label first and keeps the raw event kind available as technical detail
