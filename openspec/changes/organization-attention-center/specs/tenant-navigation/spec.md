## MODIFIED Requirements

### Requirement: Tenant hierarchy is URL-addressable

The Web UI SHALL provide stable routes for the current Organization attention center, the Project collection, an individual Project, a Project's Applications, an individual Application, Project Notifications, a Project webhook destination, and a Project notification delivery using API UUIDs as route parameters. The Organization root SHALL keep its selected attention window in validated URL search state without changing the existing `/` path.

#### Scenario: Operator opens the application root

- **WHEN** compatibility and authentication succeed at the root route
- **THEN** the UI loads the current Organization and its Organization attention summary, presents the Requires attention command center, and retains direct Project navigation

#### Scenario: Operator opens a deep link

- **WHEN** a valid Project, Application, Notification, destination, delivery detail, Runtime Group, or Runtime Diff URL is opened directly
- **THEN** the UI reconstructs the required hierarchy from route parameters and API queries without requiring prior attention-center or list navigation

### Requirement: Applications remain scoped to their Project

The Web UI SHALL list and retrieve Applications only beneath their owning Project route, SHALL display the Application name, slug, release count, discovery count derived from `runtime_group_count`, and latest observation time, and SHALL present an Application overview that explains the product through Process launches, Network activity, New discoveries, Changes after release, and scoped attention guidance. The discovery count SHALL link to the existing Runtime Groups route without exposing “Runtime Groups” as its primary user-facing label.

#### Scenario: Operator selects a Project

- **WHEN** a Project is opened
- **THEN** the UI shows Project summary information and its cursor-paginated Application collection

#### Scenario: Operator selects an Application

- **WHEN** an Application is opened beneath its Project
- **THEN** the UI retains Organization and Project breadcrumb context, presents direct navigation to Process launches, Network activity, New discoveries, Releases, and release changes, and loads Application attention guidance independently of the established overview data

#### Scenario: Operator activates the discovery count

- **WHEN** the linked New discoveries aggregate is activated
- **THEN** the router opens the existing Runtime Groups collection for the same Project and Application

#### Scenario: Operator opens Process activity

- **WHEN** the Process launches action is activated
- **THEN** the router opens the existing inventory collection for the same Project and Application with `kind=process` and no inherited cursor

#### Scenario: Operator opens Network activity

- **WHEN** the Network activity action is activated
- **THEN** the router opens the existing inventory collection in its Network presentation with an API-supported destination or domain kind and no inherited cursor

#### Scenario: Scoped resource is not found

- **WHEN** a Project or Application detail request returns HTTP 404
- **THEN** the UI shows a scoped not-found state with navigation back to the nearest valid parent
