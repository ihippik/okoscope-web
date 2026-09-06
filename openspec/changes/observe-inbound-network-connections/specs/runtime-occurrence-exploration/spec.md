## ADDED Requirements

### Requirement: Inbound occurrences have typed details

The occurrence timeline SHALL support `NetworkListen` and `NetworkAccept` payloads, show the formatted local endpoint for both, and show the formatted remote endpoint for `NetworkAccept` only after the occurrence technical details are expanded.

#### Scenario: Listener occurrence is expanded

- **WHEN** a user expands a `NetworkListen` occurrence
- **THEN** TCP, address family, and local endpoint are shown without remote-client fields

#### Scenario: Accept occurrence remains collapsed

- **WHEN** a `NetworkAccept` occurrence is rendered but its technical details are collapsed
- **THEN** the remote address and remote port are not present in visible occurrence content

#### Scenario: Accept occurrence is expanded

- **WHEN** the user expands a `NetworkAccept` occurrence
- **THEN** the local and remote endpoints are shown as inert formatted text

### Requirement: Malformed and unknown occurrence payloads fail safely

The occurrence timeline SHALL retain a bounded inert fallback for unknown or malformed payload shapes without throwing, executing content, or promoting unrecognized fields into aggregate presentation.

#### Scenario: Unknown payload is returned

- **WHEN** an occurrence contains an unknown discriminator or malformed endpoint data
- **THEN** the page remains usable and exposes only bounded text-oriented technical details
