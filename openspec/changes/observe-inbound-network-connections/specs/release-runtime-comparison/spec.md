## ADDED Requirements

### Requirement: Release comparison presents listener behavior from backend classification

Release comparison SHALL present `network.listen` entries as local endpoint behavior using the classification supplied by the backend and SHALL support new, disappeared, unchanged, and a safe unknown fallback if an unrecognized status reaches the client.

#### Scenario: Listener classification is returned

- **WHEN** the backend returns a listener diff entry
- **THEN** the frontend displays its classification, process, TCP family, and formatted local endpoint without client-side diff computation

### Requirement: Accepted traffic is not presented as release behavior change

The frontend MUST NOT interpret changes in `network.accept` occurrence counts or remote clients as new, disappeared, or changed listener behavior and MUST NOT expose remote endpoints in release summaries or visualizations.

#### Scenario: Only accepted traffic varies

- **WHEN** accepted-connection counts differ while listener behavior is unchanged
- **THEN** the frontend does not derive a release behavior change from those counts
