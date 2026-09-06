## MODIFIED Requirements

### Requirement: Runtime Inventory summary follows active scope

The Web UI SHALL provide an Application-scoped Runtime Inventory route whose summary is loaded from the inventory summary operation and displays Process, Destination, Domain, and Syscall item and occurrence counts. It SHALL additionally visualize each kind's occurrence share of the complete summary total using labelled horizontal bars with absolute counts and percentages. It SHALL send the active release, cluster, namespace, workload kind, workload name, container, observation bounds, and committed search to summary, distribution, and list operations where supported, and MUST NOT infer summary or distribution totals from a list page. Selecting a kind in the summary visualization SHALL activate that kind while preserving compatible scope and resetting the list cursor.

#### Scenario: Operator applies inventory filters

- **WHEN** an operator selects a release, Kubernetes scope, observation window, or committed search
- **THEN** the summary, distribution, and active behavior list are requested with the same normalized scope and the active filters remain visible in the URL-addressable view

#### Scenario: A summary kind is absent

- **WHEN** the summary response has no entry for one of the four inventory kinds
- **THEN** the corresponding visualization entry displays zero without deriving a value from the current list page

#### Scenario: Operator activates a visualized kind

- **WHEN** an operator activates a kind bar by pointer or keyboard
- **THEN** that kind becomes active, compatible filters remain applied, the list cursor resets, and the control communicates its selected state without relying on color
