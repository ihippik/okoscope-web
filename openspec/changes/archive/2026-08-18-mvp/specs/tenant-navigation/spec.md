## ADDED Requirements

### Requirement: Tenant hierarchy is URL-addressable

The Web UI SHALL provide stable routes for the current Organization, the Project collection, an individual Project, a Project's Applications, and an individual Application using API UUIDs as route parameters.

#### Scenario: Operator opens the application root

- **WHEN** compatibility and authentication succeed at the root route
- **THEN** the UI loads the current Organization and presents its Project navigation

#### Scenario: Operator opens a deep link

- **WHEN** a valid Project or Application detail URL is opened directly
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

The Web UI SHALL list and retrieve Applications only beneath their owning Project route and SHALL display the Application name, slug, release count, runtime-group count, and latest observation time.

#### Scenario: Operator selects a Project

- **WHEN** a Project is opened
- **THEN** the UI shows Project summary information and its cursor-paginated Application collection

#### Scenario: Operator selects an Application

- **WHEN** an Application is opened beneath its Project
- **THEN** the UI shows its summary while retaining Organization and Project breadcrumb context

#### Scenario: Scoped resource is not found

- **WHEN** a Project or Application detail request returns HTTP 404
- **THEN** the UI shows a scoped not-found state with navigation back to the nearest valid parent

### Requirement: Navigation states are accessible and deterministic

The Web UI SHALL provide distinct loading, empty, error, and success states, keyboard-operable navigation, meaningful document titles, and visible focus behavior for milestone routes.

#### Scenario: A route is loading

- **WHEN** required route data is pending
- **THEN** the UI presents a stable loading layout without falsely showing an empty collection

#### Scenario: Navigation is performed by keyboard

- **WHEN** an operator traverses and activates hierarchy controls without a pointing device
- **THEN** focus order, labels, and route transitions remain understandable and operable
