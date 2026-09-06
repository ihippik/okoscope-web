## ADDED Requirements

### Requirement: File occurrence payloads are safely rendered

Occurrence views SHALL render `file.create`, `file.modify`, `file.delete`, and `file.rename` using only contracted fields and SHALL safely fall back for unknown event kinds.

#### Scenario: Optional fields are absent

- **WHEN** optional file payload fields are missing
- **THEN** the occurrence view remains usable and does not invent unavailable metadata

#### Scenario: Unknown event kind is returned

- **WHEN** a future or unknown event kind/payload is returned
- **THEN** the page renders a generic activity label and safe technical-details fallback without crashing
