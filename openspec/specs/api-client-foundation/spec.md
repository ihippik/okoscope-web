# api-client-foundation Specification

## Purpose

Defines runtime API configuration, contract-derived types, backend compatibility checks, ephemeral bearer sessions, and correlated failure handling for the Okoscope Web UI.

## Requirements

### Requirement: Runtime API configuration is validated before use

The Web UI SHALL load its API base URL from runtime configuration independently of the compiled frontend assets and MUST reject missing, malformed, credential-bearing, or unsupported URLs before issuing API requests.

#### Scenario: Valid runtime configuration is loaded

- **WHEN** the application starts with a same-origin path or absolute HTTP or HTTPS API base URL
- **THEN** it normalizes the base URL and uses it for all API operations

#### Scenario: Runtime configuration is invalid

- **WHEN** the configured API base URL is absent or unsafe in a production deployment
- **THEN** the application displays a blocking configuration error without silently falling back to localhost

### Requirement: API types follow the published contract

The Web UI SHALL derive TypeScript API types, request bodies, query parameters, and success responses from the published Okoscope OpenAPI 3.1 contract and SHALL detect stale generated output during repository checks. It MUST NOT introduce hand-written transport types or call operations absent from generated OpenAPI declarations.

#### Scenario: Backend contract changes

- **WHEN** the pinned OpenAPI input changes incompatibly with committed generated output
- **THEN** the contract-generation check fails until the frontend types and affected consumers are updated

#### Scenario: Required operation is missing

- **WHEN** a requested frontend capability has no operation or required field in the pinned OpenAPI contract
- **THEN** the UI and documentation identify a contract blocker without mock data, untyped production calls, or client-side substitutes

#### Scenario: First-seen operations are generated

- **WHEN** contract regression checks inspect the generated client
- **THEN** typed inputs and successful responses exist for occurrence pagination and acknowledge, resolve, and reopen operations without local duplicate API types

### Requirement: Backend compatibility is checked before protected loading

The Web UI MUST request the unauthenticated build-info operation before loading protected tenant data and SHALL proceed only when the reported API version is supported by the frontend build and the required database migration is 7 or newer.

#### Scenario: Backend API is compatible

- **WHEN** build info is reachable and reports API version `v1` and database migration 7 or newer
- **THEN** the application permits credential entry and protected tenant queries

#### Scenario: Backend API is incompatible

- **WHEN** build info reports an unsupported API version
- **THEN** the application blocks tenant navigation and displays expected and actual API versions, service version, Git commit, and request ID when available

#### Scenario: Backend migration is incompatible

- **WHEN** build info reports database migration below 7 or omits a required migration value
- **THEN** the application blocks tenant navigation and displays the required and actual migration values with safe diagnostics

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

The Web UI SHALL distinguish API, network, and invalid-response failures and SHALL retain the response `X-Request-Id`, error-envelope request ID, or client-generated request ID in that priority order. Read failures SHALL offer retry; mutation failures SHALL use the same safe error presentation without exposing raw exception objects or Authorization data.

#### Scenario: API returns a structured error

- **WHEN** an API response contains the documented error envelope
- **THEN** the UI displays a safe contextual message, error code, and copyable request ID

#### Scenario: Request fails without an API response

- **WHEN** a network failure prevents receipt of a response
- **THEN** the UI presents a retry action for a read request and the client-generated request ID

#### Scenario: Background refresh fails

- **WHEN** a refetch fails after usable data has already been rendered
- **THEN** the UI preserves the existing data and reports the refresh failure non-destructively

#### Scenario: Mutation fails

- **WHEN** a notification mutation returns a normalized failure
- **THEN** the UI displays only its safe message, error code when available, and copyable request ID

### Requirement: Runtime Inventory queries preserve exact server scope

The Web UI SHALL consume Runtime Inventory summary, list, facet, item, and evidence operations through generated contract types. Query identity SHALL include every server-affecting path, normalized filter, search, facet, evidence kind, and opaque cursor input, and MUST exclude credentials.

#### Scenario: Inventory filters differ

- **WHEN** two inventory requests differ by Project, Application, kind, release, Kubernetes scope, observation time, search, facet, item, evidence kind, or cursor
- **THEN** their query identities differ and cached data from one scope is not presented as the other

#### Scenario: Contract snapshot is stale

- **WHEN** the backend Runtime Inventory contract differs from the pinned OpenAPI snapshot or generated schema
- **THEN** repository contract checks fail before ungenerated inventory types or operations can be merged

### Requirement: Cursor failures retain safe correlated recovery

The Web UI SHALL preserve the normalized API error code and request ID for Runtime Inventory cursor failures and SHALL distinguish the documented invalid-cursor error from unrelated HTTP 400 parameter errors.

#### Scenario: Inventory cursor is invalid

- **WHEN** an inventory list, facet, or evidence request returns the documented invalid-cursor code
- **THEN** the consuming view can offer cursor-only recovery while displaying safe correlated diagnostics

#### Scenario: Another parameter is invalid

- **WHEN** an inventory request returns HTTP 400 with a code other than the documented invalid-cursor code
- **THEN** the client preserves it as a contextual parameter failure and does not silently clear cursor or filters
