# release-runtime-comparison Specification

## Purpose

Defines Application-scoped release browsing and baseline-aware runtime behavior comparison with ownership-safe navigation.

## Requirements

### Requirement: Releases are browsable within an Application

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/releases`, use the generated OpenAPI client, present immutable Release version, deployed time, description, and `manual` or `observed` source, support opaque cursor pagination, and provide a Runtime Diff link for each Release without exposing Release creation or editing. For an observed Release it SHALL also present the returned image identity, revision count, and active episode count; for a manual Release it SHALL preserve the legacy presentation when identity fields are null and Kubernetes counts are zero.

#### Scenario: Observed Releases load successfully

- **WHEN** an operator opens the Releases route and an observed Release contains image identity and Kubernetes counts
- **THEN** the UI renders its source, immutable image identity, revision count, active episode count, and Runtime Diff action under the owning Project and Application

#### Scenario: Manual Release loads without identity metadata

- **WHEN** a manual Release has null identity fields and zero revision and active-episode counts
- **THEN** the UI renders its source, version, deployed time, description, and Runtime Diff action without requiring or fabricating Kubernetes metadata

#### Scenario: More releases are available

- **WHEN** a release page contains a non-null `next_cursor`
- **THEN** the operator can navigate to the next cursor and the cursor is represented in the URL and query key

#### Scenario: Releases are absent or fail to load

- **WHEN** the release request is empty or fails
- **THEN** the UI presents the corresponding empty or request-ID-aware error/retry state rather than a release editor

### Requirement: Runtime Diff compares a target with a selected baseline

The Web UI SHALL expose `/projects/:projectId/applications/:applicationId/releases/:targetReleaseId/runtime-diff`, use the backend-selected baseline when the URL omits a baseline, display the backend-returned `baseline_selection_source`, allow an explicit alternative baseline, and keep baseline and cursor in validated URL search state. It MUST NOT infer or replace baseline-selection provenance in the browser.

#### Scenario: Transition baseline is selected automatically

- **WHEN** the route has no baseline parameter and the backend returns a baseline with `baseline_selection_source` equal to `transition`
- **THEN** the generated-client request omits `baseline_id` and the UI presents the returned target, baseline, and transition-derived selection explanation

#### Scenario: Concurrent transition fallback is selected automatically

- **WHEN** the backend returns `concurrent_transition_fallback`
- **THEN** the UI explains that the baseline is a backend fallback for concurrent transition evidence without asserting rollout order or traffic allocation

#### Scenario: Legacy deployment order is selected automatically

- **WHEN** the backend returns `legacy_deployment_order`
- **THEN** the UI identifies deployment order as the backend's legacy baseline-selection source

#### Scenario: Backend has no baseline selection

- **WHEN** the backend returns a null baseline and `baseline_selection_source` equal to `none`
- **THEN** the UI presents no baseline as available and does not synthesize one

#### Scenario: Operator selects another baseline

- **WHEN** a valid Application release is selected as baseline
- **THEN** router navigation records its ID, resets the diff cursor, issues a query whose key includes target, baseline, Project, and Application identifiers, and presents the returned `explicit` selection source

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

The frontend MUST implement Releases cursor pagination, deployment-episode cursor pagination, and Runtime Diff baseline/cursor pagination through generated OpenAPI operations and MUST NOT use local DTOs, manually assembled untyped requests, `any`, unjustified assertions, client-side metadata enrichment, or duplicated release-transition and baseline-selection business logic.

#### Scenario: Generated types include automatic Release metadata

- **WHEN** the repository OpenAPI snapshot is synchronized from the current backend schema and TypeScript API types are regenerated
- **THEN** Release source and identity fields, deployment episode schemas and operation, and Runtime Diff baseline-selection source are available through contract-derived types

#### Scenario: Paginated comparison request is built

- **WHEN** the UI requests a Releases page, an episode page, or an explicit-baseline Runtime Diff page
- **THEN** cursor, limit, Release scope, and optional `baseline_id` values are passed through the corresponding generated-client parameters
