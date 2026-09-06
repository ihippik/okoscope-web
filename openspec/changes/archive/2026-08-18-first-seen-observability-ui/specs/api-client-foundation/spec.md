## MODIFIED Requirements

### Requirement: API types follow the published contract

The Web UI SHALL derive TypeScript API types and operation inputs from the Okoscope OpenAPI 3.1 contract pinned from backend commit `76ff32fe913ccce4a4392262b286df75dae013c6`, SHALL keep successful responses strictly contract-derived, and SHALL detect stale generated output during repository checks without handwritten duplicate DTOs.

#### Scenario: Backend contract changes

- **WHEN** the pinned OpenAPI input changes incompatibly with committed generated output
- **THEN** the contract-generation check fails until the frontend types and affected consumers are updated

#### Scenario: First-seen operations are generated

- **WHEN** contract regression checks inspect the generated client
- **THEN** typed inputs and successful responses exist for occurrence pagination and acknowledge, resolve, and reopen operations without local duplicate API types

### Requirement: Backend compatibility is checked before protected loading

The Web UI MUST request the unauthenticated build-info operation before loading protected tenant data and SHALL proceed only when the backend reports API version `v1` and database migration 6 or newer.

#### Scenario: Backend API is compatible

- **WHEN** build info is reachable and reports API version `v1` and database migration 6 or newer
- **THEN** the application permits credential entry and protected tenant queries

#### Scenario: Backend API version is incompatible

- **WHEN** build info reports an unsupported API version
- **THEN** the application blocks tenant navigation and displays expected and actual API versions, service version, Git commit, and request ID when available

#### Scenario: Backend migration is incompatible

- **WHEN** build info reports database migration below 6 or omits a required migration value
- **THEN** the application blocks tenant navigation and displays the required and actual migration values with safe diagnostics

#### Scenario: Build-info cannot be loaded

- **WHEN** the build-info request fails because of transport, HTTP, or response-decoding failure
- **THEN** the application displays a retryable startup error with safe diagnostics
