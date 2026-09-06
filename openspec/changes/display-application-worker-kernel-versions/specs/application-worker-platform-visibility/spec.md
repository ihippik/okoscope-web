## ADDED Requirements

### Requirement: Application overview shows observed worker platforms

The Web UI SHALL show a bounded worker-platform collection on the Application overview, preserving each returned worker as a separate entry with Cluster name, node name, agent version, nullable architecture, nullable Linux kernel release, Application observation bounds, and agent last-seen time.

#### Scenario: Application spans heterogeneous workers

- **WHEN** the worker collection contains nodes reporting different kernel releases or architectures
- **THEN** the overview shows separate entries with each worker's reported values and does not present one canonical Application kernel

#### Scenario: Worker platform metadata is unavailable

- **WHEN** a worker has null architecture or kernel release
- **THEN** the overview keeps the worker visible and renders each null field with the localized explicit unavailable state

#### Scenario: Worker collection is empty

- **WHEN** the server returns no workers with accepted Application evidence
- **THEN** the section displays a localized empty state explaining that no worker observations are available yet

### Requirement: Worker evidence semantics remain explicit

The Web UI SHALL distinguish Application observation timestamps from agent last-seen time and MUST NOT derive online status, Linux distribution, support, vulnerability, or eBPF compatibility claims from worker platform values.

#### Scenario: Worker timestamps are displayed

- **WHEN** a worker entry is rendered
- **THEN** its last Application observation and last agent signal use distinct localized labels without an online or offline verdict

#### Scenario: Kernel release is displayed

- **WHEN** a worker reports a kernel release
- **THEN** the UI renders the bounded value as inert text without converting it into a link or inferred platform verdict

### Requirement: Worker discovery is independently resilient and bounded

The Web UI SHALL load Application workers independently from blocking Application details, SHALL preserve server ordering, and SHALL use bounded incremental pagination with opaque cursors.

#### Scenario: Initial worker request is pending

- **WHEN** Project and Application details are available while the initial worker request is pending
- **THEN** the overview remains usable and only the worker section displays its localized loading state

#### Scenario: Initial worker request fails

- **WHEN** worker discovery fails with a normalized API, network, or invalid-response error
- **THEN** the overview preserves Application details and the worker section displays safe correlated diagnostics with a retry action

#### Scenario: Additional workers are available

- **WHEN** a worker page returns a non-null opaque next cursor
- **THEN** the section offers a localized load-more action that sends the cursor unchanged and appends the next server-ordered page

#### Scenario: Background refresh fails

- **WHEN** a refresh fails after worker entries have been rendered
- **THEN** the existing worker entries remain visible and the failure is reported non-destructively

### Requirement: Worker presentation is responsive and localized

The Web UI SHALL provide semantically equivalent worker information across supported viewport sizes, and every new operator-facing label, state, and action SHALL be available in English and Russian.

#### Scenario: Worker collection is viewed on a narrow screen

- **WHEN** the table layout cannot fit the available viewport
- **THEN** workers are presented as readable stacked entries without horizontal page overflow or omitted platform fields

#### Scenario: Operator changes locale

- **WHEN** the active locale changes between English and Russian
- **THEN** worker headings, field labels, loading, empty, unavailable, retry, and pagination text update while reported worker values remain unchanged
