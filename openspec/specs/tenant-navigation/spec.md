# tenant-navigation Specification

## Purpose

Defines accessible, URL-addressable browsing of the current Organization, its Projects, Project-scoped Applications, observability views, and notification operations.

## Requirements

### Requirement: Tenant hierarchy is URL-addressable

The Web UI SHALL provide stable routes for the current Organization, the Project collection, an individual Project, a Project's Applications, an individual Application, Project Notifications, a Project webhook destination, and a Project notification delivery using API UUIDs as route parameters.

#### Scenario: Operator opens the application root

- **WHEN** compatibility and authentication succeed at the root route
- **THEN** the UI loads the current Organization and presents its Project navigation

#### Scenario: Operator opens a deep link

- **WHEN** a valid Project, Application, Notification, destination, or delivery detail URL is opened directly
- **THEN** the UI reconstructs the required hierarchy from route parameters and API queries without requiring prior list navigation

### Requirement: Projects can be browsed incrementally

The Web UI SHALL list Projects in backend order, show their name, slug, archive state, Application count, and runtime-group count, and SHALL request additional pages using the returned opaque cursor.

#### Scenario: More Projects are available

- **WHEN** a Project page contains a non-null `next_cursor`
- **THEN** the operator can load the next page without duplicating or discarding previously loaded Projects

#### Scenario: Organization has no Projects

- **WHEN** the Project collection is empty
- **THEN** the UI displays an explicit empty state rather than an error

### Requirement: Applications remain scoped to their Project

The Web UI SHALL list and retrieve Applications only beneath their owning Project route, SHALL display the Application name, slug, release count, runtime-group count, and latest observation time, and SHALL provide clear Application-scoped actions to browse Runtime Groups, Releases, and Runtime Inventory. The runtime-group count SHALL link to the Runtime Groups route.

#### Scenario: Operator selects a Project

- **WHEN** a Project is opened
- **THEN** the UI shows Project summary information and its cursor-paginated Application collection

#### Scenario: Operator selects an Application

- **WHEN** an Application is opened beneath its Project
- **THEN** the UI shows its summary, retains Organization and Project breadcrumb context, and presents `View runtime groups`, `View releases`, and `View runtime inventory` navigation

#### Scenario: Operator activates the runtime-group count

- **WHEN** the linked Runtime groups aggregate is activated
- **THEN** the router opens the Runtime Groups collection for the same Project and Application

#### Scenario: Operator opens Runtime Inventory

- **WHEN** the Runtime Inventory action is activated
- **THEN** the router opens the inventory collection for the same Project and Application with its default behavior kind and no inherited cursor

#### Scenario: Scoped resource is not found

- **WHEN** a Project or Application detail request returns HTTP 404
- **THEN** the UI shows a scoped not-found state with navigation back to the nearest valid parent

### Requirement: Navigation states are accessible and deterministic

The Web UI SHALL provide distinct loading, empty, error, stale, and success states, keyboard-operable navigation, meaningful document titles, visible focus behavior, responsive narrow-viewport layouts, and complete breadcrumbs for tenant, Runtime Groups, Runtime Group Detail, Releases, Runtime Diff, Runtime Inventory, Runtime Inventory Detail, Notifications, destination, and delivery routes. Deep links, reload, and browser back/forward SHALL restore route and validated URL search state.

#### Scenario: A route is loading

- **WHEN** required route data is pending
- **THEN** the UI presents a stable loading layout without falsely showing an empty collection

#### Scenario: Navigation is performed by keyboard

- **WHEN** an operator traverses and activates hierarchy, filter, pagination, mutation, confirmation, and detail controls without a pointing device
- **THEN** focus order, labels, visible focus, and route transitions remain understandable and operable at wide and narrow viewports

#### Scenario: An operational deep link is reloaded

- **WHEN** an operator directly loads or reloads a Runtime Groups, Runtime Group Detail, Releases, Runtime Diff, Runtime Inventory, Runtime Inventory Detail, Notifications, destination, or delivery URL
- **THEN** the UI reconstructs breadcrumbs and scoped data without requiring prior navigation

#### Scenario: Browser history is traversed

- **WHEN** an operator uses browser back or forward after changing filters, cursors, baseline, inventory kind, evidence view, or detail routes
- **THEN** the prior validated URL state and corresponding view are restored

### Requirement: Project exposes notification navigation

The Web UI SHALL provide a visible `Notifications` link from the Project page and within accessible Project-scoped notification navigation.

#### Scenario: Operator opens a project

- **WHEN** project details are rendered
- **THEN** the operator can navigate directly to that project's Notifications route

### Requirement: Recovery audit routes are URL-addressable

The Web UI SHALL provide Project-scoped recovery-operation history and detail routes with validated cursor and command-type search state, accessible breadcrumbs, and deep-link support.

#### Scenario: Operator opens recovery history

- **WHEN** `/projects/:projectId/notifications/recovery` is opened directly
- **THEN** the UI reconstructs Project notification context and loads the validated server page

#### Scenario: Operator opens recovery detail

- **WHEN** `/projects/:projectId/notifications/recovery/:operationId` is opened directly
- **THEN** the UI displays the scoped audit record with navigation back to Notifications and recovery history
