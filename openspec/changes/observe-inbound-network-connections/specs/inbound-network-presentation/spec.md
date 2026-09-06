## ADDED Requirements

### Requirement: Inbound event kinds have distinct user presentation

The frontend SHALL present `network.listen` as “Открыт порт” and `network.accept` as “Принято входящее соединение” with visually distinguishable icons or badges while retaining a safe neutral fallback for unknown event kinds.

#### Scenario: Listener and accept events are shown together

- **WHEN** a result set contains both inbound event kinds
- **THEN** the user can distinguish their meaning by label and visual treatment without opening raw data

### Requirement: Endpoint formatting is shared and unambiguous

The frontend SHALL format an endpoint through `formatEndpoint(addressFamily, address, port)`, rendering IPv4 as `address:port`, IPv6 as `[address]:port`, and the port as a number without DNS lookup, hostname substitution, automatic linking, or equivalence inference between IPv4 and IPv6 wildcards.

#### Scenario: IPv4 endpoint is formatted

- **WHEN** the family is `ipv4`, address is `0.0.0.0`, and port is `8080`
- **THEN** the canonical endpoint is `0.0.0.0:8080`

#### Scenario: IPv6 endpoint is formatted

- **WHEN** the family is `ipv6`, address is `2001:db8::1`, and port is `8080`
- **THEN** the canonical endpoint is `[2001:db8::1]:8080`

#### Scenario: Wildcard endpoints are explained independently

- **WHEN** the address is `0.0.0.0` or `::`
- **THEN** the frontend respectively identifies all IPv4 interfaces or all IPv6 interfaces without merging the endpoints

### Requirement: Remote client evidence is confined to raw occurrence detail

The frontend MUST render remote address and port only within an explicitly expanded authorized `network.accept` raw occurrence detail and MUST NOT expose them in group summaries, inventory, release comparison, notification previews, URLs, analytics events, telemetry, browser logs, or aggregate visualizations.

#### Scenario: Accepted client is investigated

- **WHEN** the user expands the raw detail of a `network.accept` occurrence
- **THEN** the frontend renders its remote endpoint using the shared endpoint formatter

#### Scenario: Accepted client remains private in summaries

- **WHEN** the same occurrence contributes to any aggregated frontend surface
- **THEN** its remote address and port are absent from rendered content and frontend-generated metadata

### Requirement: Runtime strings render as inert text

The frontend SHALL treat addresses, process commands, workload values, and unknown payload fields as untrusted text without `innerHTML` or automatic links and SHALL preserve the layout for long values.

#### Scenario: Unsafe values are returned

- **WHEN** an inbound field contains HTML, script-like, or URL-like text
- **THEN** the value is displayed inertly and no markup, script, or navigation is activated
