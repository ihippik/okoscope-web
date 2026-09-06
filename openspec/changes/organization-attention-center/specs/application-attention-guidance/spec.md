## ADDED Requirements

### Requirement: Application overview uses the Application attention snapshot

The Application overview SHALL expose Requires attention as a fourth primary workflow link. Its nested attention route SHALL request the generated Application attention operation for the current Project and Application and SHALL use it to present concrete discovery and latest-release-change totals followed by recommendations. The response ownership references MUST match the route before attention content is rendered.

#### Scenario: Application attention loads successfully

- **WHEN** the operator activates Requires attention on the Application overview and its scoped attention response loads successfully
- **THEN** a stable nested route presents compact attention totals and recommendations while preserving breadcrumb navigation back to the Application
- **AND** it does not repeat priority items or release comparison as separate attention sections

#### Scenario: Attention response ownership differs

- **WHEN** the returned Project or Application identity does not match the route parameters
- **THEN** the UI rejects the attention content and presents a scoped safe error without linking to the mismatched resources

### Requirement: Application Recommendations become actionable

The disabled Recommendations placeholder SHALL be replaced by an accessible block of deterministic recommendations when the Application attention response supplies them. Each recommendation SHALL use localized contract-defined copy, exact facts, priority text, and a safely mapped resource action; the UI MUST NOT synthesize recommendations from paginated list pages.

#### Scenario: Application has recommendations

- **WHEN** one or more recommendations are returned
- **THEN** the overview presents the bounded recommendations in server order with concrete investigation actions

#### Scenario: Application has no recommendations

- **WHEN** the recommendations collection is empty
- **THEN** the overview presents a neutral no-action-needed state instead of a disabled coming-soon control

### Requirement: Application attention failures do not hide established workflows

Application identity and established activity, discovery, release, and worker actions SHALL remain usable when the attention query fails. The failed attention region SHALL provide a correlated retry action and MUST NOT replace the entire Application route with an attention-specific error.

#### Scenario: Application attention request fails

- **WHEN** the Application itself loads but its attention summary fails
- **THEN** the established Application overview remains visible and only the attention region shows a safe retryable error

### Requirement: Application attention shows evidence-qualified observed actions

The attention route SHALL show the exact file-deletion identity count for the snapshot window and SHALL link to file activity filtered to delete operations and the same bounds. It MAY confirm outbound internet traffic when a public destination appears in the bounded main-destination response, but MUST NOT interpret the absence of such an entry as proof that no internet traffic occurred.
The route SHALL also show inbound-port groups first observed in the window and the largest positive occurrence change available in the bounded release comparison. Observed-action card color SHALL progress from green to red using documented event-volume thresholds and MUST NOT be labelled as security severity.

#### Scenario: Destructive and internet evidence is available

- **WHEN** deleted-file identities and a public outbound destination are observed in the attention window
- **THEN** the route shows the deletion count, confirms observed internet traffic, and provides filtered investigation links

#### Scenario: No public destination is present in the bounded response

- **WHEN** the main outbound destinations contain no confirmed public IP
- **THEN** the route says internet traffic is not confirmed in the main destinations rather than showing a definitive zero
