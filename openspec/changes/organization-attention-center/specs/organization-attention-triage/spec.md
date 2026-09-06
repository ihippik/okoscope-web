## ADDED Requirements

### Requirement: The authenticated root presents the Organization attention snapshot

The Web UI SHALL request `GET /api/v1/attention-summary` through generated OpenAPI types and SHALL present the response as the primary authenticated Organization landing experience. It MUST use the response totals and bounded collections directly and MUST NOT derive Organization totals or rankings by traversing paginated Project, Application, discovery, release, or notification collections.

#### Scenario: Attention summary loads successfully

- **WHEN** compatibility and authentication succeed and the Organization attention operation returns a snapshot
- **THEN** the root route displays its generation time, selected window, complete totals, and one concise server-ordered list of concrete recommendations
- **AND** detailed priority items, changed Applications, and notification problems are not repeated as separate landing-page sections

#### Scenario: Organization has nothing requiring attention

- **WHEN** every attention total is zero and every bounded attention collection is empty
- **THEN** the root route presents a positive all-clear state with normal Project navigation and does not render empty warning panels

#### Scenario: Attention contract is unavailable

- **WHEN** the generated OpenAPI declarations do not contain the Organization attention operation or required response fields
- **THEN** contract verification fails and the UI does not introduce handwritten response types, untyped requests, or client-side fan-out as a substitute

### Requirement: Attention window selection is URL-addressable

The Web UI SHALL support only the contract-defined `24h` and `7d` windows, SHALL default invalid or absent input to `24h`, and SHALL store the selected value in validated root-route search state. Changing the window MUST replace the current snapshot request without retaining unrelated pagination state or deriving a custom time boundary in the browser.

#### Scenario: Operator selects seven days

- **WHEN** the operator changes the window from 24 hours to 7 days
- **THEN** the URL records `window=7d` and the query requests a new server snapshot using the generated `window` parameter

#### Scenario: Root route contains an invalid window

- **WHEN** a direct root URL contains a window value outside the generated contract
- **THEN** the route normalizes to the 24-hour default and does not send the invalid value

### Requirement: Summary metrics lead to valid investigation scopes

The Web UI SHALL present new discoveries, open discoveries, changed Applications, notification-problem Projects, and failed deliveries as exact localized metrics. An actionable metric MUST navigate to a valid existing investigation scope with the matching supported filters, while a metric without a truthful aggregate destination SHALL remain informative rather than link to a misleading partial list.

#### Scenario: Operator reviews new discoveries

- **WHEN** a new-discovery action has a concrete Application resource scope
- **THEN** it opens that Application's New discoveries route with the snapshot window boundaries represented by supported first-seen filters and no inherited cursor

#### Scenario: Aggregate spans multiple Applications

- **WHEN** an Organization total cannot be represented by one existing filtered collection route
- **THEN** the UI uses the bounded priority queue or changed-Application list for investigation and does not label a partial Application list as the complete Organization total

### Requirement: Priority is operational and explainable

The Web UI SHALL render `urgent`, `high`, and `normal` as operational triage priority using text and non-color-only visual treatment. Each priority item SHALL explain its contract-defined reason using `kind`, `reason_code`, and supported facts, and MUST NOT present priority as a vulnerability, incident, anomaly, or security-risk assessment.

#### Scenario: Notification delivery is urgent

- **WHEN** an urgent notification failure item is returned
- **THEN** the UI identifies the affected Project, states the failed-delivery facts supplied by the API, and offers the corresponding notification investigation action without claiming overall Okoscope failure

#### Scenario: Discovery has normal priority

- **WHEN** a newly observed or open discovery has normal priority
- **THEN** the UI describes it as behavior to review and explicitly avoids implying that the behavior is harmful

### Requirement: Typed resource references produce safe existing routes

The Web UI SHALL map only supported discriminated attention resource references to client-owned routes. Project, Application, Runtime Group, and Runtime Diff references MUST retain every supplied ownership identifier, MUST render no server-provided string as a direct navigation URL, and SHALL omit or disable an action whose reference cannot be mapped safely.

#### Scenario: Runtime Group reference is activated

- **WHEN** an item contains a valid `runtime_group` resource reference
- **THEN** the action opens the existing Runtime Group detail route using its Project, Application, and Runtime Group IDs

#### Scenario: Runtime Diff reference is activated

- **WHEN** an item contains a valid `runtime_diff` resource reference
- **THEN** the action opens the existing target-release comparison route with its baseline preserved in validated search state

#### Scenario: Resource reference is unsupported

- **WHEN** a future or malformed resource variant cannot be mapped to a known route
- **THEN** the item facts remain readable, no unsafe link is created, and the UI exposes a safe unavailable-action state

### Requirement: Changed Applications preserve evidence-qualified comparison semantics

The Web UI SHALL present each bounded changed-Application entry with Project and Application identity, baseline and target releases, exact classification totals, and bounded largest changes. It MUST describe `disappeared` as no longer observed, MUST NOT infer deletion or safety, and MUST link comparisons through the existing release-diff route.

#### Scenario: Comparable releases changed

- **WHEN** a changed Application contains baseline and target release references
- **THEN** the UI shows new, no-longer-observed, and unchanged counts and offers an action to inspect that exact comparison

#### Scenario: Long-tail changes are not in the bounded response

- **WHEN** total changed items exceed the supplied largest-changes collection
- **THEN** the UI labels the collection as a bounded highlight and does not claim it enumerates every changed behavior

### Requirement: Notification problems remain Project-scoped

The Web UI SHALL present every returned notification problem with Project identity, textual health state, relevant counters, observation time, priority, and reason. Actions SHALL open that Project's existing Notifications route or a supported delivery scope and MUST NOT expose webhook URLs, signing secrets, response excerpts, or credentials.

#### Scenario: Project has no enabled destination

- **WHEN** a notification problem or recommendation reports `enabled_destination_missing`
- **THEN** the UI explains that notification delivery needs an enabled destination and links to the affected Project's destination-management area

#### Scenario: Notification data is stale relative to the page

- **WHEN** the returned problem observation time precedes the snapshot generation time
- **THEN** both timestamps remain distinguishable and the UI does not represent the problem counters as live streaming data

### Requirement: Recommendations are deterministic next actions

The Web UI SHALL render contract-defined recommendations as localized next actions using their typed kind, reason, facts, scope, priority, and resource reference. Recommendations MUST remain distinct from priority events, MUST NOT invent missing facts, and MUST NOT be described as AI-generated advice.

#### Scenario: Recommendation can be acted on

- **WHEN** a recommendation has a supported resource reference
- **THEN** it displays one localized action label and opens the corresponding existing investigation or configuration route

#### Scenario: Multiple recommendations are returned

- **WHEN** the snapshot contains recommendations of different priorities
- **THEN** the UI preserves the server order and conveys each priority independently of color

### Requirement: Attention request states remain usable and accessible

The attention route SHALL provide distinct stable loading, empty, error, stale-refresh, and success states; SHALL retain the last successful snapshot during a background refresh failure; and SHALL expose safe retry diagnostics including the best available request ID. All metrics, window controls, lists, priority labels, timestamps, and actions MUST be keyboard-operable, localized, and readable at supported narrow viewports without horizontal page scrolling.

#### Scenario: Initial attention request fails

- **WHEN** no successful snapshot exists and the request fails
- **THEN** the page shows a correlated retryable error while preserving access to Projects and session controls

#### Scenario: Refresh fails after success

- **WHEN** a previously displayed snapshot cannot be refreshed
- **THEN** the snapshot remains visible, is marked stale, and provides a retry action without replacing facts with zeros

#### Scenario: Operator uses a narrow viewport

- **WHEN** the attention center is displayed at the minimum supported width
- **THEN** summary metrics, queue items, comparisons, problems, and actions stack in semantic order and remain operable without loss of information
