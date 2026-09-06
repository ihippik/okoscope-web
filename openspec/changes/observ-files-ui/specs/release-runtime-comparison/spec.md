## ADDED Requirements

### Requirement: Release diff presents backend-classified file activity

Release Diff SHALL render file activity entries classified by the backend as new, unchanged, or disappeared and SHALL NOT compute a client fingerprint.

#### Scenario: Rename appears in a release diff

- **WHEN** a rename entry is returned
- **THEN** ordered old/new process-reported paths and replacement state are displayed with the backend classification
