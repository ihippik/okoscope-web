## ADDED Requirements

### Requirement: Recovery audit routes are URL-addressable

The Web UI SHALL provide Project-scoped recovery-operation history and detail routes with validated cursor and command-type search state, accessible breadcrumbs, and deep-link support.

#### Scenario: Operator opens recovery history

- **WHEN** `/projects/:projectId/notifications/recovery` is opened directly
- **THEN** the UI reconstructs Project notification context and loads the validated server page

#### Scenario: Operator opens recovery detail

- **WHEN** `/projects/:projectId/notifications/recovery/:operationId` is opened directly
- **THEN** the UI displays the scoped audit record with navigation back to Notifications and recovery history
