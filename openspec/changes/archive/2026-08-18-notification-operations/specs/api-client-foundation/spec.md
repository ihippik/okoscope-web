## MODIFIED Requirements

### Requirement: API types follow the published contract

The Web UI SHALL derive TypeScript API types, request bodies, query parameters, and success responses from the published Okoscope OpenAPI 3.1 contract and SHALL detect stale generated output during repository checks. It MUST NOT introduce hand-written transport types or call operations absent from generated OpenAPI declarations.

#### Scenario: Backend contract changes

- **WHEN** the pinned OpenAPI input changes incompatibly with committed generated output
- **THEN** the contract-generation check fails until the frontend types and affected consumers are updated

#### Scenario: Required operation is missing

- **WHEN** a requested frontend capability has no operation or required field in the pinned OpenAPI contract
- **THEN** the UI and documentation identify a contract blocker without mock data, untyped production calls, or client-side substitutes

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
