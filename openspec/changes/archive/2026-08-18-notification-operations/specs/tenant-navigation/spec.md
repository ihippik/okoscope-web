## MODIFIED Requirements

### Requirement: Tenant hierarchy is URL-addressable

The Web UI SHALL provide stable routes for the current Organization, the Project collection, an individual Project, a Project's Applications, an individual Application, Project Notifications, a Project webhook destination, and a Project notification delivery using API UUIDs as route parameters.

#### Scenario: Operator opens the application root

- **WHEN** compatibility and authentication succeed at the root route
- **THEN** the UI loads the current Organization and presents its Project navigation

#### Scenario: Operator opens a deep link

- **WHEN** a valid Project, Application, Notification, destination, or delivery detail URL is opened directly
- **THEN** the UI reconstructs the required hierarchy from route parameters and API queries without requiring prior list navigation

### Requirement: Navigation states are accessible and deterministic

The Web UI SHALL provide distinct loading, empty, error, stale, and success states, keyboard-operable navigation, meaningful document titles, visible focus behavior, responsive narrow-viewport layouts, and complete breadcrumbs for tenant, Runtime Groups, Runtime Group Detail, Releases, Runtime Diff, Notifications, destination, and delivery routes. Deep links, reload, and browser back/forward SHALL restore route and validated URL search state.

#### Scenario: A route is loading

- **WHEN** required route data is pending
- **THEN** the UI presents a stable loading layout without falsely showing an empty collection

#### Scenario: Navigation is performed by keyboard

- **WHEN** an operator traverses and activates hierarchy, filter, pagination, mutation, confirmation, and detail controls without a pointing device
- **THEN** focus order, labels, visible focus, and route transitions remain understandable and operable at wide and narrow viewports

#### Scenario: An operational deep link is reloaded

- **WHEN** an operator directly loads or reloads a Runtime Groups, Runtime Group Detail, Releases, Runtime Diff, Notifications, destination, or delivery URL
- **THEN** the UI reconstructs breadcrumbs and scoped data without requiring prior navigation

#### Scenario: Browser history is traversed

- **WHEN** an operator uses browser back or forward after changing filters, cursors, baseline, or detail routes
- **THEN** the prior validated URL state and corresponding view are restored

## ADDED Requirements

### Requirement: Project exposes notification navigation

The Web UI SHALL provide a visible `Notifications` link from the Project page and within accessible Project-scoped notification navigation.

#### Scenario: Operator opens a project

- **WHEN** project details are rendered
- **THEN** the operator can navigate directly to that project's Notifications route
