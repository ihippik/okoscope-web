# runtime-inventory-exploration Specification

## Purpose

Defines Application-scoped Runtime Inventory summary, filtering, typed behavior browsing, evidence detail, release-presence semantics, and inert rendering.

## Requirements

### Requirement: Runtime Inventory summary follows active scope

The Web UI SHALL provide an Application-scoped Runtime Inventory route whose summary is loaded from the inventory summary operation and displays Process, Destination, Domain, and Syscall item and occurrence counts. It SHALL send the active release, cluster, namespace, workload kind, workload name, container, observation bounds, and committed search to both summary and list operations where supported, and MUST NOT infer summary totals from a list page.

#### Scenario: Operator applies inventory filters

- **WHEN** an operator selects a release, Kubernetes scope, observation window, or committed search
- **THEN** the summary and active behavior list are requested with the same normalized scope and the active filters remain visible in the URL-addressable view

#### Scenario: A summary kind is absent

- **WHEN** the summary response has no entry for one of the four inventory kinds
- **THEN** the corresponding card displays zero without deriving a value from the current list page

### Requirement: Behavior kinds use typed inert identities

The Web UI SHALL provide Processes, Destinations, Domains, and Syscalls tabs and SHALL render each item using the semantic identity defined for its `inventory_kind`. Each item SHALL display first and last observation, occurrence count, and release, cluster, namespace, workload, Pod, container, and runtime-group counts.

#### Scenario: Operator changes behavior kind

- **WHEN** an operator activates a behavior tab or summary card
- **THEN** the route requests that kind, preserves other active filters, resets the list cursor, and renders only its typed semantic identity

#### Scenario: Observed identity resembles executable markup

- **WHEN** an executable, command, domain, address, or syscall contains markup, Markdown, URL-like, or event-handler-like text
- **THEN** the value remains literal inert text and creates no element, navigation target, script, or event handler

### Requirement: Inventory filters use dependent server options

The Web UI SHALL provide release, cluster, namespace, workload-kind, workload-name, container, and observation-time filters. Cluster, namespace, workload, and container options SHALL come from the bounded dependent facet operation; each request SHALL apply every active normalized filter except the requested facet's own value and SHALL treat facet search and cursor as independent server inputs.

#### Scenario: A dependent filter changes

- **WHEN** an operator changes namespace while opening workload-name options
- **THEN** workload-name options are requested in the new namespace scope without sending the currently selected workload-name as its own constraint

#### Scenario: Facet options are paginated

- **WHEN** a facet page returns a non-null opaque cursor
- **THEN** the operator can request the next bounded option page without parsing the cursor or using list pagination state

#### Scenario: Selected option is absent from refreshed options

- **WHEN** dependent options reload and do not contain the currently selected URL value
- **THEN** the selected value remains visible and applied until the operator clears or replaces it

### Requirement: Search and collection pagination are deterministic

The Web UI SHALL debounce inventory identity search, SHALL commit no more than 200 characters, and SHALL include committed search and every server-affecting filter in query identity. Every collection cursor SHALL remain opaque, requests MUST use a limit no greater than 200, and scope, kind, filter, identity-version, or search changes SHALL replace rather than concatenate results and reset the affected cursor.

#### Scenario: Operator types in search

- **WHEN** search input changes rapidly
- **THEN** the UI commits a normalized value after debounce, replaces the list cursor, and does not issue one list request for every keystroke

#### Scenario: Empty terminal page is returned

- **WHEN** a request containing a cursor returns an empty page with no next cursor
- **THEN** the UI identifies the terminal page separately from an empty first page and provides a deterministic way back without inventing a previous cursor

#### Scenario: Cursor is rejected

- **WHEN** the backend returns the documented invalid-cursor failure for the list or a facet
- **THEN** the UI presents a dedicated invalid-cursor state and offers to clear only that cursor while preserving the remaining scope

### Requirement: Inventory detail exposes bounded evidence

The Web UI SHALL provide an addressable detail route for an inventory item and SHALL expose independently cursor-paginated Releases, Sightings, Groups, and Occurrences evidence views. It SHALL load the item before evidence, validate Project/Application/item ownership, validate returned evidence paths against the expected relative scoped paths, and SHALL load only the active evidence collection.

#### Scenario: Operator opens item detail directly

- **WHEN** a valid inventory item URL is loaded or reloaded
- **THEN** the UI reconstructs Project and Application context, validates item ownership, and opens the selected evidence view without prior list navigation

#### Scenario: Item belongs to another scope

- **WHEN** item identifiers in a successful response do not match the Project, Application, or item route parameters
- **THEN** no item or evidence content is rendered and the UI presents a scoped not-found or ownership error

#### Scenario: Evidence link is unsafe or mismatched

- **WHEN** an evidence link is absolute, targets another tenant/item, or does not match its expected evidence kind
- **THEN** the UI does not request it and reports an invalid response with correlated diagnostics

### Requirement: Release presence is evidence-qualified

The Web UI SHALL render `observed`, `not_observed`, and `unknown` as three distinct evidence-qualified states. It MUST NOT describe `not_observed` as absent, removed, impossible, or safe, and SHALL show `release_evidence_count` plus occurrence count and observation bounds when present.

#### Scenario: Release has attributed evidence without the item

- **WHEN** release presence is `not_observed`
- **THEN** the UI states that the item was not seen in available attributed evidence and displays the non-zero release evidence count without claiming absence

#### Scenario: Release cannot be evaluated

- **WHEN** release presence is `unknown`
- **THEN** the UI states that trusted attributed evidence is unavailable and does not treat null occurrence bounds as zero observations

### Requirement: Inventory states are distinct and accessible

The Web UI SHALL distinguish loading, empty first page, empty terminal page, invalid cursor, unauthorized, not found, server/network failure, stale refresh, and success states for inventory and evidence views. Controls and tabs SHALL be keyboard operable, responsive, visibly focused, labelled, and understandable without color alone.

#### Scenario: Inventory has no matching items

- **WHEN** the first list page is empty under an active scope
- **THEN** the UI displays a filter-aware empty state rather than loading, terminal-page, or error content

#### Scenario: Protected request is unauthorized

- **WHEN** an inventory request returns HTTP 401
- **THEN** the existing ephemeral credential flow clears authentication and presents the correlated unauthorized state

#### Scenario: Refresh fails after data was shown

- **WHEN** a background summary, list, facet, item, or evidence refresh fails after usable data was rendered
- **THEN** the UI preserves that data and reports the refresh failure non-destructively with retry and request ID

### Requirement: All observed inventory strings remain inert

The Web UI MUST render executable, command, domain, namespace, workload, Pod, container, node, event, facet label, payload, and release-adjacent observed strings through inert text primitives in list, detail, filter, tooltip, and copied-preview surfaces. It MUST NOT interpret these strings as HTML or Markdown, convert them automatically to links, or execute URL-like values.

#### Scenario: Unsafe fixture is rendered across surfaces

- **WHEN** markup-like fixture values appear in an identity, facet option, sighting, occurrence, tooltip, or copy preview
- **THEN** the literal value is available to the operator while the DOM contains no fixture-created element, navigation, event handler, or script execution
