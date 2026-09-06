## MODIFIED Requirements

### Requirement: Applications remain scoped to their Project

The Web UI SHALL list and retrieve Applications only beneath their owning Project route, SHALL display the Application name, slug, release count, runtime-group count, and latest observation time, and SHALL provide clear Application-scoped actions to browse Runtime Groups and Releases. The runtime-group count SHALL link to the Runtime Groups route.

#### Scenario: Operator selects a Project

- **WHEN** a Project is opened
- **THEN** the UI shows Project summary information and its cursor-paginated Application collection

#### Scenario: Operator selects an Application

- **WHEN** an Application is opened beneath its Project
- **THEN** the UI shows its summary, retains Organization and Project breadcrumb context, and presents `View runtime groups` and `View releases` navigation

#### Scenario: Operator activates the runtime-group count

- **WHEN** the linked Runtime groups aggregate is activated
- **THEN** the router opens the Runtime Groups collection for the same Project and Application

#### Scenario: Scoped resource is not found

- **WHEN** a Project or Application detail request returns HTTP 404
- **THEN** the UI shows a scoped not-found state with navigation back to the nearest valid parent

### Requirement: Navigation states are accessible and deterministic

The Web UI SHALL provide distinct loading, empty, error, and success states, keyboard-operable navigation, meaningful document titles, visible focus behavior, responsive narrow-viewport layouts, and complete breadcrumbs for tenant, Runtime Groups, Runtime Group Detail, Releases, and Runtime Diff routes. Deep links, reload, and browser back/forward SHALL restore route and validated URL search state.

#### Scenario: A route is loading

- **WHEN** required route data is pending
- **THEN** the UI presents a stable loading layout without falsely showing an empty collection

#### Scenario: Navigation is performed by keyboard

- **WHEN** an operator traverses and activates hierarchy, filter, pagination, and detail controls without a pointing device
- **THEN** focus order, labels, visible focus, and route transitions remain understandable and operable at wide and narrow viewports

#### Scenario: An observability deep link is reloaded

- **WHEN** an operator directly loads or reloads a Runtime Groups, Runtime Group Detail, Releases, or Runtime Diff URL
- **THEN** the UI reconstructs breadcrumbs and scoped data without requiring prior navigation

#### Scenario: Browser history is traversed

- **WHEN** an operator uses browser back or forward after changing filters, cursors, baseline, or detail routes
- **THEN** the prior validated URL state and corresponding view are restored
