## ADDED Requirements

### Requirement: Provisioning operations use generated contract types

The Web UI SHALL consume admin hierarchy, create-entity, list-credential, issue-credential, and revoke-credential operations through generated OpenAPI request and response types and MUST NOT introduce parallel handwritten transport models.

#### Scenario: Provisioning contract changes

- **WHEN** the pinned OpenAPI provisioning operations differ from generated declarations
- **THEN** repository checks fail before untyped provisioning calls can be merged

### Requirement: API client supports empty successful responses

The shared API client SHALL support typed DELETE requests and MUST accept a documented successful response with no body without attempting JSON decoding.

#### Scenario: Credential revocation succeeds

- **WHEN** DELETE credential returns HTTP 204 with an empty body
- **THEN** the client resolves the mutation successfully without reporting an invalid response

#### Scenario: DELETE returns a structured error

- **WHEN** DELETE credential returns a non-success response with the documented error envelope
- **THEN** the client preserves its safe message, error code, status, and correlated request ID

### Requirement: Mutation retry and idempotency preserve entity and secret safety

Provisioning mutations SHALL be single-flight per submitted form, SHALL NOT automatically retry documented 400, 401, 404, or 409 responses, and SHALL attach a fresh UUID idempotency key to each intentional create or issue action without placing secret material in request identity.

#### Scenario: Operator submits once

- **WHEN** a provisioning form begins a mutation
- **THEN** one request carries one stable idempotency key for that mutation attempt and concurrent submission is disabled

#### Scenario: Mutation returns a client error

- **WHEN** a provisioning mutation returns HTTP 400, 401, 404, or 409
- **THEN** the mutation is not automatically repeated

#### Scenario: One-time response is received

- **WHEN** create Application or issue credential returns plaintext token material
- **THEN** the response is not written to TanStack Query cache or any persistent retry state

### Requirement: Field validation details remain structured

The API error normalization layer SHALL preserve documented field error mappings separately from the safe general message while excluding unknown response properties.

#### Scenario: Validation envelope has fields

- **WHEN** a documented error response contains a `fields` map
- **THEN** the consuming form can associate safe messages with known inputs and retain the correlated request ID
