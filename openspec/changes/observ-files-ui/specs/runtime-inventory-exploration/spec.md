## ADDED Requirements

### Requirement: Runtime inventory includes file activity

The inventory SHALL accept `file_activity`, expose it in kind navigation and filters, and use existing scoped, paginated inventory/search APIs.

#### Scenario: Search file activity

- **WHEN** a user searches file activity by operation, path, or new path
- **THEN** the existing backend query receives the search term and returned results are rendered

#### Scenario: Backend has no file activity

- **WHEN** summary and list responses contain no file activity
- **THEN** existing inventory kinds continue to work and file activity has a zero or empty state
