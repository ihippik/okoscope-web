## ADDED Requirements

### Requirement: Runtime API configuration is validated before use

The Web UI SHALL load its API base URL from runtime configuration independently of the compiled frontend assets and MUST reject missing, malformed, credential-bearing, or unsupported URLs before issuing API requests.

#### Scenario: Valid runtime configuration is loaded

- **WHEN** the application starts with a same-origin path or absolute HTTP or HTTPS API base URL
- **THEN** it normalizes the base URL and uses it for all API operations

#### Scenario: Runtime configuration is invalid

- **WHEN** the configured API base URL is absent or unsafe in a production deployment
- **THEN** the application displays a blocking configuration error without silently falling back to localhost

### Requirement: API types follow the published contract

The Web UI SHALL derive TypeScript API types from the published Okoscope OpenAPI 3.1 contract and SHALL detect stale generated output during repository checks.

#### Scenario: Backend contract changes

- **WHEN** the pinned OpenAPI input changes incompatibly with committed generated output
- **THEN** the contract-generation check fails until the frontend types and affected consumers are updated

### Requirement: Backend compatibility is checked before protected loading

The Web UI MUST request the unauthenticated build-info operation before loading protected tenant data and SHALL proceed only when the reported API version is supported by the frontend build.

#### Scenario: Backend API is compatible

- **WHEN** build info is reachable and reports API version `v1`
- **THEN** the application permits credential entry and protected tenant queries

#### Scenario: Backend API is incompatible

- **WHEN** build info reports an unsupported API version
- **THEN** the application blocks tenant navigation and displays expected and actual API versions, service version, Git commit, and request ID when available

#### Scenario: Build-info cannot be loaded

- **WHEN** the build-info request fails because of transport, HTTP, or response-decoding failure
- **THEN** the application displays a retryable startup error with safe diagnostics

### Requirement: MVP bearer credentials remain ephemeral

The Web UI SHALL allow an operator to provide the bearer credential needed by protected API operations and MUST retain it only in application memory for the active page lifetime.

#### Scenario: Operator submits a credential

- **WHEN** a non-empty bearer credential is submitted after compatibility succeeds
- **THEN** subsequent protected requests include it in the Authorization header without placing it in URLs or logs

#### Scenario: Page is reloaded

- **WHEN** the browser reloads or closes the page
- **THEN** the credential is no longer available and the operator must provide it again

#### Scenario: API rejects the credential

- **WHEN** a protected request returns HTTP 401
- **THEN** the application clears the in-memory credential and returns to the credential prompt with a correlated error

### Requirement: Failures are normalized and correlated

The Web UI SHALL distinguish API, network, and invalid-response failures and SHALL retain the response `X-Request-Id`, error-envelope request ID, or client-generated request ID in that priority order.

#### Scenario: API returns a structured error

- **WHEN** an API response contains the documented error envelope
- **THEN** the UI displays a safe contextual message and a copyable request ID

#### Scenario: Request fails without an API response

- **WHEN** a network failure prevents receipt of a response
- **THEN** the UI presents a retry action and the client-generated request ID

#### Scenario: Background refresh fails

- **WHEN** a refetch fails after usable data has already been rendered
- **THEN** the UI preserves the existing data and reports the refresh failure non-destructively
