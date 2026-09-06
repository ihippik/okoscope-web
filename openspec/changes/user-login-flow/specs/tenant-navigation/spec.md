## MODIFIED Requirements

### Requirement: Tenant hierarchy is URL-addressable

The Web UI SHALL provide stable routes for the current Organization, the Project collection, an individual Project, a Project's Applications, an individual Application, Project Notifications, a Project webhook destination, and a Project notification delivery using API UUIDs as route parameters. Compatibility and user-session gates MUST preserve the requested URL so authentication or session restoration can reveal the original route without requiring prior list navigation.

#### Scenario: User opens the application root

- **WHEN** compatibility and user-session authentication succeed at the root route
- **THEN** the UI loads the current Organization and presents its attention summary and Project navigation

#### Scenario: Authenticated user opens a deep link

- **WHEN** a valid Project, Application, Notification, destination, or delivery detail URL is opened directly with a restorable browser session
- **THEN** the UI restores current-user context and reconstructs the required hierarchy from route parameters and API queries without requiring prior list navigation

#### Scenario: Anonymous user opens a deep link

- **WHEN** a protected deep link is opened without a valid browser session
- **THEN** the UI retains the deep-link URL while presenting authentication and reveals that route after successful login or registration

## ADDED Requirements

### Requirement: Tenant navigation reflects membership role without replacing server authorization

The authenticated shell SHALL use the generated `owner | member` role to present known owner-only tenant provisioning and credential-management navigation only to owners. It MUST continue relying on backend authorization for every request and SHALL safely present documented forbidden responses.

#### Scenario: Owner navigates tenant administration

- **WHEN** authenticated context identifies an Organization owner
- **THEN** the UI exposes supported Project/Application provisioning and application-ingestion credential controls within that Organization

#### Scenario: Member navigates tenant resources

- **WHEN** authenticated context identifies an Organization member
- **THEN** the UI omits known owner-only provisioning controls while retaining permitted observability and operational navigation

#### Scenario: Backend rejects an operation

- **WHEN** the backend returns HTTP 403 despite the presented role or visible action
- **THEN** the UI presents the correlated forbidden state and MUST NOT emulate the mutation, elevate the role, or substitute frontend business logic

### Requirement: Ordinary user navigation excludes system-administrator credentials

The user login flow SHALL NOT display a hard-coded system-administrator entry action or infer global administrator authority from an authenticated Organization owner. Global admin routes and bearer authentication MUST remain outside ordinary tenant navigation.

#### Scenario: Organization owner opens the authenticated shell

- **WHEN** authentication context reports role `owner`
- **THEN** the primary navigation contains tenant capabilities but does not expose the development system-admin onboarding entry solely because of that role
