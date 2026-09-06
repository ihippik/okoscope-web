## MODIFIED Requirements

### Requirement: Releases are browsable within an Application

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/releases`, use the generated OpenAPI client, present each immutable Release's required `display_name`, deployed time, description, and `manual` or `observed` source, support opaque cursor pagination, and provide a Runtime Diff link without exposing Release creation or editing. For an observed Release it SHALL also present the returned image identity, revision count, and active episode count, and SHALL retain the complete returned container image composition in expandable technical details. The UI MUST NOT synthesize a display name from version, ID, digest, or identity components.

#### Scenario: Observed Release loads successfully

- **WHEN** an observed Release contains a display name, image identity, and Kubernetes counts
- **THEN** the UI renders the backend-provided display name as its heading and keeps its immutable digest and complete image composition available as supporting technical evidence

#### Scenario: Manual Release loads successfully

- **WHEN** a manual Release is returned with its required display name
- **THEN** the UI renders that display name as its heading without substituting the submitted version or applying legacy fallback logic

#### Scenario: More releases are available

- **WHEN** a Release page contains a non-null `next_cursor`
- **THEN** the operator can navigate to the next cursor and the cursor is represented in the URL and query key

#### Scenario: Releases are absent or fail to load

- **WHEN** the Release request is empty or fails
- **THEN** the UI presents the corresponding empty or request-ID-aware error/retry state rather than a Release editor

### Requirement: Runtime Diff compares a target with a selected baseline

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/releases/:targetReleaseId/runtime-diff`, use the backend-selected baseline when the URL omits a baseline, display the backend-returned `baseline_selection_source`, present target and baseline using their required `display_name` values, allow an explicit alternative baseline, and keep baseline and cursor in validated URL search state. It MUST NOT infer or replace baseline-selection provenance or Release names in the browser.

#### Scenario: Default comparison is opened

- **WHEN** the route has no baseline parameter
- **THEN** the generated-client request omits `baseline_id` and the UI presents the backend-returned target and baseline display names with their baseline-selection explanation

#### Scenario: Operator selects another baseline

- **WHEN** a valid Application Release is selected as baseline
- **THEN** the selector identifies it by `display_name`, router navigation records its ID, resets the diff cursor, and issues a query whose key includes target, baseline, Project, and Application identifiers

#### Scenario: Diff cursor changes

- **WHEN** the operator follows a returned `next_cursor`
- **THEN** the URL and query key include that cursor while preserving the selected baseline

## ADDED Requirements

### Requirement: Release names are consistent across operator-facing evidence

The backend SHALL provide a required non-empty human-readable display name on every Release and Release-attribution response. The Web UI SHALL use that contract-provided name wherever it presents or selects a Release, including Release cards, Runtime Diff target/baseline context and selectors, Runtime Inventory filters and Release evidence, and occurrence attribution. It MUST NOT fall back to version, Release ID, or digest.

#### Scenario: Release is referenced across multiple surfaces

- **WHEN** the same Release appears in the Releases list, Runtime Diff, Runtime Inventory, and occurrence evidence
- **THEN** every surface presents the same backend-provided human-readable name while retaining the same Release ID as navigation and query identity

#### Scenario: Display name is missing or empty

- **WHEN** a backend response cannot satisfy the required non-empty display-name contract
- **THEN** the backend rejects or withholds the invalid response and the frontend does not invent a substitute label

### Requirement: Observed Release names describe the workload-level identity neutrally

The backend SHALL generate an observed Release display name from the owning Application name, the count of all application and init-container images contributing to Release identity, and a short prefix of the immutable Release digest. It MUST NOT select a primary container or imply which container changed.

#### Scenario: Multi-container workload is observed

- **WHEN** an Application named `payment-api` produces an observed Release identity containing three images with digest prefix `a81f4c2e`
- **THEN** the backend supplies a display name equivalent to `payment-api · 3 images · a81f4c2e` while preserving the full identity digest and all three components separately

#### Scenario: One image is observed

- **WHEN** an observed Release identity contains one image
- **THEN** its display name uses the singular image count and does not elevate that container to a special primary-container role

### Requirement: Human-readable naming does not change Release identity

Release equality and reuse SHALL continue to depend on Application scope, identity version, and complete immutable identity digest rather than `display_name`. Changing an Application name or display formatting MUST NOT create a new Release, revision, or episode.

#### Scenario: Application is renamed

- **WHEN** the owning Application name changes without any container image digest changing
- **THEN** subsequent responses may present the updated human-readable name but retain the existing Release ID, identity digest, revisions, and episodes
