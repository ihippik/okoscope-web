## ADDED Requirements

### Requirement: Admin session remains ephemeral

The Web UI SHALL accept the admin bearer credential only after backend compatibility succeeds, MUST keep it only in application memory for the page lifetime, and MUST explain that a static SPA cannot persist the credential securely.

#### Scenario: Admin starts a provisioning session

- **WHEN** the operator submits a non-empty admin credential
- **THEN** admin API requests include it in the Authorization header without placing it in the client bundle, URL, browser storage, logs, analytics, or error reporting

#### Scenario: Admin session ends

- **WHEN** the page reloads, closes, the operator ends the session, or an admin operation returns HTTP 401
- **THEN** the Web UI clears the in-memory credential and all secret-bearing component state

### Requirement: Existing provisioning progress is discoverable

The Web UI SHALL use the typed admin hierarchy operations to determine whether Organizations, Projects, and Applications already exist and SHALL allow the operator to select an existing parent or create the next missing entity.

#### Scenario: No Organization exists

- **WHEN** admin Organization discovery returns an empty collection
- **THEN** the onboarding wizard starts at the Organization step

#### Scenario: Partial hierarchy exists

- **WHEN** an Organization or Project exists without its next child entity
- **THEN** the operator can select that entity and continue at the next applicable creation step

#### Scenario: Complete hierarchy exists

- **WHEN** an Application already exists beneath a selected Project
- **THEN** the operator can open that Application without creating duplicate entities or attempting to retrieve its original token

### Requirement: Wizard creates the tenant hierarchy in order

The Web UI SHALL guide the operator through Organization, Project, Application, and Connect agent steps and MUST use only identifiers returned by successful creation or admin discovery responses as child-operation path parameters.

#### Scenario: Fresh onboarding succeeds

- **WHEN** the operator submits valid Organization, Project, and Application forms
- **THEN** the Web UI creates each entity once in dependency order and advances to Connect agent with the returned Organization, Project, Application, and initial credential data

#### Scenario: A creation step is pending

- **WHEN** a create mutation is in flight
- **THEN** its submission controls are disabled and additional submission attempts do not issue another request

#### Scenario: A step fails

- **WHEN** a creation request fails
- **THEN** the wizard remains on that step, retains non-secret form input and prior entity identifiers, and offers a safe retry without creating later entities

### Requirement: Entity forms validate names and slugs

Organization, Project, and Application forms SHALL require names of 1–120 characters without leading or trailing whitespace and slugs of 1–63 lowercase ASCII letters or digits separated only by single hyphens.

#### Scenario: Name generates a slug

- **WHEN** the operator edits a name before manually editing its slug
- **THEN** the form derives a lowercase ASCII slug, collapses unsupported runs to one hyphen, and removes leading and trailing hyphens

#### Scenario: Operator customizes a slug

- **WHEN** the operator edits the slug field
- **THEN** subsequent name edits do not overwrite that explicit slug value

#### Scenario: Local validation fails

- **WHEN** a name or slug violates the documented constraints
- **THEN** the form shows an error at the affected field and does not call the API

### Requirement: Provisioning failures are contextual and safe

The wizard SHALL map documented provisioning failures to actionable form or step feedback and MUST NOT include bearer credentials or Application tokens in diagnostics.

#### Scenario: Backend rejects a field

- **WHEN** the backend returns HTTP 400 with field errors
- **THEN** the wizard displays each documented field message beside its matching input and preserves the safe request ID

#### Scenario: Resource conflicts

- **WHEN** the backend returns HTTP 409 for a slug conflict
- **THEN** the wizard identifies the conflicting slug without retrying the mutation automatically

#### Scenario: Parent is missing

- **WHEN** the backend returns HTTP 404 for the selected parent
- **THEN** the wizard explains that the parent no longer exists and offers to reload admin hierarchy discovery

#### Scenario: Server failure

- **WHEN** the backend returns HTTP 500
- **THEN** the wizard displays a general failure message and copyable request ID without rendering unsafe response data

### Requirement: Initial Application token is shown once

The Connect agent step SHALL render the initial plaintext Application token only from the successful create-Application response and MUST destroy that plaintext when the one-time view is closed or unmounted.

#### Scenario: Application is created

- **WHEN** create Application returns an initial credential with `shown_once` true
- **THEN** the Connect agent step warns that the token is shown only once and provides a Copy token action

#### Scenario: One-time screen closes

- **WHEN** the operator closes the one-time view, navigates away, reloads, or ends the session
- **THEN** the token is removed from component state and cannot be restored from query cache, route state, URL, browser storage, logs, analytics, or error state

#### Scenario: Existing Application is resumed

- **WHEN** the operator opens an Application discovered through the admin hierarchy
- **THEN** the Web UI does not request or imply access to its original plaintext token and directs the operator to issue a new credential if needed

### Requirement: Connect agent configuration is copyable

While the initial token remains visible, the Web UI SHALL generate a Kubernetes Secret manifest and an agent workload selector fragment from the returned Application slug and token plus operator-supplied workload namespace.

#### Scenario: Kubernetes Secret is generated

- **WHEN** the Connect agent step is displayed
- **THEN** it shows a Secret named `okoscope-application-credentials` in namespace `okoscope` whose `stringData` maps the Application slug to the Application token

#### Scenario: Agent selector is generated

- **WHEN** the operator supplies a workload namespace
- **THEN** the selector uses that namespace, label `app: <application-slug>`, and credential file `/var/run/secrets/okoscope/applications/<application-slug>`

#### Scenario: Configuration is copied

- **WHEN** the operator activates Copy Secret or Copy agent config
- **THEN** the exact visible fragment is written to the Clipboard API and accessible success or failure feedback is announced
