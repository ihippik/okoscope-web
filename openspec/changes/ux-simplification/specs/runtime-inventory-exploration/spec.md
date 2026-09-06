## MODIFIED Requirements

### Requirement: Runtime Inventory summary follows active scope

The Web UI SHALL present the Application-scoped inventory route as Application Activity with Processes and Network as its primary areas. It SHALL load summary data from the inventory summary operation, display process counts as Process launches, present Destination and Domain counts as separate Network subsections, and place Syscall counts under Technical details. It SHALL send the active release, cluster, namespace, workload kind, workload name, container, observation bounds, and committed search to both summary and list operations where supported, and MUST NOT infer summary totals from a list page, add Destination and Domain counts as unique network actions, or imply complete inbound/outbound coverage.

#### Scenario: Operator applies activity filters

- **WHEN** an operator selects a release, Kubernetes scope, observation window, or committed search
- **THEN** the summary and active activity list are requested with the same normalized scope and the active filters remain visible in the URL-addressable view

#### Scenario: A summary kind is absent

- **WHEN** the summary response has no entry for one of the four inventory kinds
- **THEN** its corresponding Processes, Network subsection, or Technical details count displays zero without deriving a value from the current list page

#### Scenario: Operator reviews the Network summary

- **WHEN** Destination and Domain counts are both available
- **THEN** the UI labels them as Connections and Domains and does not present their sum as a count of unique network actions

### Requirement: Behavior kinds use typed inert identities

The Web UI SHALL provide primary Process launches and Network activity navigation, SHALL provide Connections and Domains as distinct Network views backed respectively by `destination` and `domain`, and SHALL expose Syscalls through secondary Technical details. It SHALL render each item using the semantic identity defined for its `inventory_kind`. Each item SHALL display first and last observation, a context-specific observation count, and release, cluster, namespace, workload, Pod, container, and discovery counts.

#### Scenario: Operator changes activity view

- **WHEN** an operator activates Processes, Connections, Domains, or Syscalls
- **THEN** the route requests the corresponding existing inventory kind, preserves other active filters, resets the list cursor, and renders only its typed semantic identity

#### Scenario: Operator opens Network activity

- **WHEN** the Network area is displayed
- **THEN** Connections and Domains have distinct controls, loading states, empty states, and cursor pagination and are not merged into a client-sorted collection

#### Scenario: Operator opens technical details

- **WHEN** an operator requests low-level activity details
- **THEN** Syscalls are available without appearing as a third primary product area alongside Processes and Network

#### Scenario: Observed identity resembles executable markup

- **WHEN** an executable, command, domain, address, or syscall contains markup, Markdown, URL-like, or event-handler-like text
- **THEN** the value remains literal inert text and creates no element, navigation target, script, or event handler
