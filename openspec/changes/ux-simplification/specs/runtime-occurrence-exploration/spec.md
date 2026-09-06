## MODIFIED Requirements

### Requirement: Occurrences expose operational evidence safely

Each occurrence SHALL be presented as an entry in Observation history and SHALL show observed time, contextual activity label, process command, node, namespace, Pod, container, and release attribution when supplied by the generated response. Raw event kind and payload SHALL remain available under Technical details, MUST be rendered as bounded text-only data without HTML interpretation, and SHALL NOT displace the contextual summary as the primary content.

#### Scenario: Observation history is available

- **WHEN** an occurrence includes runtime, Kubernetes, release, and payload fields
- **THEN** the UI presents time, activity, location, and release context first and makes raw event data available as subordinate technical detail

#### Scenario: Optional attribution is absent

- **WHEN** an occurrence omits optional node, namespace, Pod, container, or release attribution
- **THEN** the UI presents a neutral unavailable value without inventing attribution

#### Scenario: Technical payload contains markup-like content

- **WHEN** an occurrence payload includes markup-like or URL-like strings
- **THEN** the UI displays the literal content in Technical details without creating markup, navigation, or executable behavior
