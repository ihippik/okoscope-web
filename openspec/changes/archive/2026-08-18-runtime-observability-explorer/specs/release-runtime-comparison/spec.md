## ADDED Requirements

### Requirement: Releases are browsable within an Application

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/releases`, use the generated OpenAPI client, present version, deployed time, and description, support opaque cursor pagination, and provide a Runtime Diff link for each release without exposing release creation or editing.

#### Scenario: Releases load successfully

- **WHEN** an operator opens the Releases route
- **THEN** the UI renders releases belonging to that Project and Application with links to their Runtime Diff routes

#### Scenario: More releases are available

- **WHEN** a release page contains a non-null `next_cursor`
- **THEN** the operator can navigate to the next cursor and the cursor is represented in the URL and query key

#### Scenario: Releases are absent or fail to load

- **WHEN** the release request is empty or fails
- **THEN** the UI presents the corresponding empty or request-ID-aware error/retry state rather than a release editor

### Requirement: Runtime Diff compares a target with a selected baseline

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/releases/:targetReleaseId/runtime-diff`, use the backend-selected baseline when the URL omits a baseline, allow an explicit alternative baseline, and keep baseline and cursor in validated URL search state.

#### Scenario: Default comparison is opened

- **WHEN** the route has no baseline parameter
- **THEN** the generated-client request omits the baseline and the UI presents the backend-returned target and baseline

#### Scenario: Operator selects another baseline

- **WHEN** a valid Application release is selected as baseline
- **THEN** router navigation records its ID, resets the diff cursor, and issues a query whose key includes target, baseline, Project, and Application identifiers

#### Scenario: Diff cursor changes

- **WHEN** the operator follows a returned `next_cursor`
- **THEN** the URL and query key include that cursor while preserving the selected baseline

### Requirement: Runtime Diff communicates classifications and evidence

The Runtime Diff SHALL separate and label entries as `NEW`, `DISAPPEARED`, or `UNCHANGED`, visually prioritize `NEW` without relying on color alone, display semantic summary and baseline/target occurrence counts, and link each entry to its Runtime Group Detail route.

#### Scenario: Mixed classifications are returned

- **WHEN** a diff page contains new, disappeared, and unchanged entries
- **THEN** every entry has the matching classification label and evidence, with new behavior receiving the primary emphasis

#### Scenario: Operator follows a group link

- **WHEN** an operator activates a Runtime Diff entry's group link
- **THEN** navigation opens that group under the current Project and Application route context

### Requirement: Runtime Diff handles non-result states

The Runtime Diff route SHALL provide distinct loading, no-baseline, empty-diff, error, retry, and paginated success states and SHALL display the correlated request ID for API failures.

#### Scenario: Backend has no baseline

- **WHEN** the backend returns a null baseline
- **THEN** the UI identifies that no comparison baseline is available and does not synthesize one

#### Scenario: Diff contains no entries

- **WHEN** the diff request succeeds with an empty item page
- **THEN** the UI shows an explicit empty-diff state while retaining target and baseline context

#### Scenario: Diff request fails

- **WHEN** the request fails with a correlation identifier
- **THEN** the UI presents the error, request ID, and retry action

### Requirement: Release and diff ownership is enforced

The Web UI MUST validate that releases and Runtime Diff target/non-null baseline belong to the route's Project and Application and that the returned target ID equals `targetReleaseId` before rendering scoped data.

#### Scenario: Diff response conflicts with the route

- **WHEN** any returned ownership identifier or target ID conflicts with the URL context
- **THEN** the UI withholds the response and presents a scoped not-found or ownership error

### Requirement: Release comparison requests remain contract-derived

The frontend MUST implement Releases cursor pagination and Runtime Diff baseline/cursor pagination through generated OpenAPI operations and MUST NOT use local DTOs, manually assembled untyped requests, `any`, or unjustified assertions.

#### Scenario: Paginated comparison request is built

- **WHEN** the UI requests a Releases page or an explicit-baseline Runtime Diff page
- **THEN** cursor, limit, and optional `baseline_id` values are passed through the corresponding generated-client parameters
