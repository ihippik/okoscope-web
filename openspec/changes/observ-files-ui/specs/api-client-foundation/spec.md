## ADDED Requirements

### Requirement: Generated API contract includes file activity

The checked-in OpenAPI document and generated TypeScript declarations SHALL include the file activity inventory kind, semantic summaries, and create/modify/delete/rename payload variants.

#### Scenario: API types are regenerated

- **WHEN** the API generation check runs
- **THEN** generated declarations match the checked-in OpenAPI contract and exhaustively admit the new variants
