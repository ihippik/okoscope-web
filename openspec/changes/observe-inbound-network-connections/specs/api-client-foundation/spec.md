## ADDED Requirements

### Requirement: Generated API contract includes inbound network variants

The frontend SHALL generate its API schema from the synchronized OpenAPI contract and SHALL consume generated types for `NetworkListenPayload`, `NetworkAcceptPayload`, `InboundNetworkSemanticSummary`, `inbound_endpoint`, and its inventory identity without parallel handwritten DTO definitions.

#### Scenario: API schema is regenerated

- **WHEN** the frontend API generation command runs against the synchronized contract
- **THEN** inbound event and inventory variants are available through generated component unions and the contract check remains clean

### Requirement: Contract fixtures exercise inbound closed schemas

Compile-time and API contract fixtures SHALL include valid IPv4 and IPv6 listener/accept payloads, safe group summaries without remote clients, and every inbound inventory evidence combination accepted by the contract.

#### Scenario: Remote data is checked against summary types

- **WHEN** inbound group and inventory fixtures are typechecked
- **THEN** remote address and port cannot be added to their closed semantic summary schemas
