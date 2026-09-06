## ADDED Requirements

### Requirement: Application inventory exposes inbound endpoints

The inventory SHALL provide an “Входящие соединения” section and `inbound_endpoint` filter whose displayed identity consists only of TCP transport, address family, canonical local address, and local port.

#### Scenario: Endpoint spans deployments

- **WHEN** the API returns one inbound endpoint with evidence from multiple processes, workloads, releases, or clients
- **THEN** the frontend displays one item and does not add those contributing values to endpoint identity

### Requirement: Listener and accept evidence are independent

An inbound endpoint SHALL independently display “Порт открыт на прослушивание” when `listener_observed` is true and “Наблюдались принятые соединения” when `accept_observed` is true, including both indications when both are true and no invented positive evidence when either value is false or unavailable.

#### Scenario: Every evidence combination is presented

- **WHEN** the API returns any boolean combination of listener and accept evidence
- **THEN** each true indication is shown independently and each false indication is not claimed

#### Scenario: An evidence property is malformed or absent

- **WHEN** defensive rendering encounters a missing evidence property outside the valid generated contract
- **THEN** the frontend shows a safe unavailable-evidence fallback without treating it as true

### Requirement: Inbound inventory participates in existing exploration controls

Inbound endpoint summary, list, detail, release presence, sightings, groups, occurrences, facets, search, pagination, loading, empty, and API error behavior SHALL follow the existing inventory interaction model.

#### Scenario: User searches for an endpoint

- **WHEN** the user searches by canonical local address or decimal local port
- **THEN** the query is sent through the existing inventory search parameter and matching backend results are displayed

#### Scenario: User pages inbound results

- **WHEN** an inbound endpoint page has a next cursor
- **THEN** the next request preserves the selected kind, search, scope, and facets while advancing the cursor

### Requirement: Existing inventory kinds do not regress

Adding inbound endpoints SHALL preserve process, destination, domain, and syscall identity, filtering, detail, and evidence presentation.

#### Scenario: Existing inventory results are rendered

- **WHEN** the API returns any previously supported inventory kind
- **THEN** its established identity and navigation remain available
