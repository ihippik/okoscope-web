## MODIFIED Requirements

### Requirement: Applications remain scoped to their Project

The Web UI SHALL list and retrieve Applications only beneath their owning Project route, SHALL display the Application name, slug, release count, discovery count derived from `runtime_group_count`, and latest observation time, and SHALL present an Application overview that explains the product through Process launches, Network activity, New discoveries, and Changes after release. The discovery count SHALL link to the existing Runtime Groups route without exposing “Runtime Groups” as its primary user-facing label.

#### Scenario: Operator selects a Project

- **WHEN** a Project is opened
- **THEN** the UI shows Project summary information and its cursor-paginated Application collection

#### Scenario: Operator selects an Application

- **WHEN** an Application is opened beneath its Project
- **THEN** the UI retains Organization and Project breadcrumb context, states that Okoscope shows which processes the Application starts, where it connects, and what changes after releases, and presents direct navigation to Processes, Network, New discoveries, Releases, and release changes where available

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
