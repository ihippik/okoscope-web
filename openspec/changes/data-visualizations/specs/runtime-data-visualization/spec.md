## ADDED Requirements

### Requirement: Inventory distributions are server-derived and scope-aware

The API SHALL provide a bounded Application-scoped distribution operation for one inventory kind. It SHALL apply the same release, cluster, namespace, workload kind, workload name, container, observation bounds, and committed search scope as Runtime Inventory; return the total occurrence and item counts for that kind; return at most the requested top N typed identities in deterministic descending occurrence-count order; and return the remaining aggregate as an explicit `other` bucket. The Web UI MUST NOT derive complete distribution totals from a paginated inventory list.

#### Scenario: Operator requests a syscall distribution

- **WHEN** the operator views Syscalls under an active release, namespace, and observation window
- **THEN** the distribution request uses that normalized scope and the response accounts for every matching syscall occurrence through top entries plus `other`

#### Scenario: Two identities have equal counts

- **WHEN** two distribution entries have the same occurrence count
- **THEN** the API applies a documented stable identity tie-breaker so repeated requests return the same order

#### Scenario: No activity matches the scope

- **WHEN** the selected scope has zero occurrences for the requested kind
- **THEN** the API returns zero totals and no top or `other` entries and the UI presents an empty visualization state

### Requirement: Distribution visuals communicate exact meaning

The Web UI SHALL present kind composition and top-behavior distributions as labelled horizontal bars with absolute occurrence counts and percentages. It SHALL identify the denominator as matching recorded observations, MUST describe values as observations rather than duration, traffic volume, configured intent, prevalence across time, or risk, and SHALL expose the same values in accessible text.

#### Scenario: Kind composition is displayed

- **WHEN** the inventory summary contains observations across multiple kinds
- **THEN** each kind displays its occurrence count and percentage of the summary occurrence total with a text label that remains understandable without color

#### Scenario: Percentage rounding is visible

- **WHEN** rounded displayed percentages do not sum to exactly 100 percent
- **THEN** absolute counts and the denominator remain visible and no correction is silently assigned to an individual category

#### Scenario: Assistive technology reads a bar

- **WHEN** a screen-reader user navigates a distribution entry
- **THEN** its identity, absolute count, percentage, and category are available without relying on SVG geometry, tooltip hover, or color

### Requirement: Top behavior identities remain typed, inert, and bounded

The Web UI SHALL render process, destination, domain, and syscall distribution identities using their typed semantic summaries. Every observed string MUST remain inert text in labels, accessible names, and explanatory details. The visualization SHALL render only the bounded top entries and explicit `other` returned by the API.

#### Scenario: Destination distribution is displayed

- **WHEN** a destination entry contains process command, address family, destination address, and port
- **THEN** the visualization presents the typed process-to-address identity without converting the address or command into an automatic link

#### Scenario: Identity resembles markup

- **WHEN** a distribution identity contains HTML-, Markdown-, URL-, or event-handler-like text
- **THEN** the literal value is available to the operator and creates no element, navigation, script, or event handler

### Requirement: Visualization interactions preserve inventory scope

An operator SHALL be able to select a kind visualization to activate that inventory kind and select a top identity to narrow the inventory list. The interaction SHALL preserve every compatible active scope filter, reset collection cursors, and remain keyboard operable with visible focus and a non-chart equivalent.

#### Scenario: Operator selects a top domain

- **WHEN** the operator activates a domain distribution entry
- **THEN** the route applies a deterministic typed identity filter, resets the list cursor, and retains release, Kubernetes, search, and observation bounds that remain compatible

#### Scenario: Visualization cannot be rendered

- **WHEN** chart geometry is unavailable because of viewport, reduced-motion, or rendering constraints
- **THEN** the labelled values and equivalent filter controls remain usable

### Requirement: Release comparison aggregates are complete and bounded

The Runtime Diff API SHALL return server-derived classification totals for `new`, `disappeared`, and `unchanged` over the complete target/baseline comparison scope and bounded entries ranked by absolute occurrence-count change, independently of diff page pagination. Each ranked entry SHALL retain typed identity, classification, baseline count, target count, and signed delta.

#### Scenario: Diff has more entries than one page

- **WHEN** the complete diff spans multiple cursor pages
- **THEN** classification totals and ranked changes represent the complete comparison rather than the currently loaded page

#### Scenario: One side has no occurrence count

- **WHEN** behavior is new or disappeared
- **THEN** the aggregate represents the unobserved side consistently as zero for delta calculation while preserving its classification semantics

### Requirement: Visualization request states are explicit

Distribution and comparison visuals SHALL distinguish loading, empty, unauthorized, not found, invalid scope, server/network failure, stale refresh, and success states. A failed background refresh MUST preserve usable prior aggregate data and report the failure non-destructively with retry and request ID.

#### Scenario: Initial aggregate request fails

- **WHEN** no usable aggregate has loaded and the request fails
- **THEN** the visualization area presents the correlated error and retry action rather than zero-valued bars

#### Scenario: Aggregate refresh fails

- **WHEN** a refresh fails after aggregate data was displayed
- **THEN** the prior visualization remains visible with a non-destructive stale-data warning, retry action, and request ID
