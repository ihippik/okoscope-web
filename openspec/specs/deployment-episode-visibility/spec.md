# deployment-episode-visibility Specification

## Purpose

Defines Application-scoped presentation and pagination of observed Kubernetes deployment episodes with evidence-qualified transition and readiness semantics.

## Requirements

### Requirement: Deployment episodes are distinct Release-scoped evidence

The Web UI SHALL present deployment episodes as observations associated with an immutable Release and Kubernetes revision, SHALL identify each episode's revision and occurrence number, and MUST NOT describe a Release, revision, and episode as interchangeable deployment objects.

#### Scenario: One Release has repeated deployment episodes

- **WHEN** the backend returns multiple episodes for the same Release and revision with different occurrence numbers
- **THEN** the UI renders them as distinct chronological episodes under the single immutable Release

#### Scenario: One Release has multiple revisions

- **WHEN** episodes for one Release reference different `revision_id` values
- **THEN** the UI preserves the revision identity for each episode rather than merging them into a single revision

### Requirement: Episode history exposes lifecycle and readiness evidence

Each episode SHALL display `state`, `transition_kind`, start and end evidence, Ready Pod count, workload Ready Pod count, and `ready_pod_share` when available. The UI SHALL distinguish an ongoing episode with null `ended_at` from a completed episode and SHALL communicate unavailable nullable timestamps or readiness share without inventing values.

#### Scenario: Active episode has readiness evidence

- **WHEN** an active episode includes first and last observation times, Ready Pod counts, a snapshot time, and non-null `ready_pod_share`
- **THEN** the UI presents the active state, lifecycle evidence, counts, snapshot context, and formatted Ready Pod share

#### Scenario: Episode metadata is nullable

- **WHEN** `first_ready_at`, `ended_at`, `snapshot_observed_at`, or `ready_pod_share` is null
- **THEN** the UI presents the applicable unavailable or ongoing state and does not derive a timestamp, percentage, or completion claim

### Requirement: Concurrency and Ready Pod share remain evidence-qualified

The Web UI SHALL visibly identify episodes whose transition kind is `concurrent` and SHALL state adjacent to readiness-share presentation that Ready Pod share is not request traffic share and does not confirm canary or A/B deployment intent.

#### Scenario: Concurrent revisions are observed

- **WHEN** active episodes for simultaneous revisions are classified as `concurrent`
- **THEN** each relevant episode shows a concurrency label and the UI does not assign traffic percentages or rollout strategy

#### Scenario: Ready Pod share is displayed

- **WHEN** any episode renders a non-null `ready_pod_share`
- **THEN** the same episode history context explains that the value represents Ready Pods, not traffic share or proof of canary/A/B

### Requirement: A return to an older Release is not a confirmed rollback

The Web UI SHALL render `rollback_candidate` using the explicit label “rollback candidate” and MUST NOT state or imply that a rollback was confirmed or completed.

#### Scenario: Older image identity becomes active again

- **WHEN** the backend classifies the new episode transition as `rollback_candidate`
- **THEN** the UI labels it as a rollback candidate and retains the observed timestamps and state as the supporting evidence

### Requirement: Episode requests are bounded, scoped, and contract-derived

The Web UI SHALL request episode history through the generated `listDeploymentEpisodes` operation only when the operator opens a Release's history, SHALL support its opaque cursor pagination, and MUST include Project, Application, Release, and cursor in the query identity. It MUST validate that every returned episode belongs to the requested Release before rendering.

#### Scenario: Operator opens episode history

- **WHEN** an operator requests history for an observed Release
- **THEN** the frontend issues one bounded generated-client request for that scoped Release and renders its loading, success, empty, or request-ID-aware error state

#### Scenario: More episodes are available

- **WHEN** an episode page returns a non-null `next_cursor`
- **THEN** the operator can request the next page without changing the parent Release page cursor

#### Scenario: Episode response conflicts with its Release

- **WHEN** a returned episode has a `release_id` different from the requested Release
- **THEN** the UI withholds the episode page and presents a scoped ownership error

### Requirement: Manual Releases remain usable without Kubernetes episode metadata

The Web UI SHALL preserve the legacy manual Release presentation when image identity fields are null and revision and active-episode counts are zero. It SHALL NOT require, synthesize, or infer revision or episode evidence for such a Release.

#### Scenario: Legacy manual Release has no Kubernetes metadata

- **WHEN** a manual Release has null identity metadata, zero revision count, and zero active episode count
- **THEN** the UI continues to show its version, description, deployment time, source, and Runtime Diff action without an error or fabricated Kubernetes history
