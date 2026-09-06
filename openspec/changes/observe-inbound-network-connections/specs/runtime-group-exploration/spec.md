## ADDED Requirements

### Requirement: Inbound runtime groups expose receiving behavior

Runtime group lists and details SHALL support `network.listen` and `network.accept` and SHALL show process command, TCP transport, address family, formatted local endpoint, first seen, last seen, occurrence count, and available workload and release context.

#### Scenario: Inbound group is displayed

- **WHEN** a listener or accepted-connection group is returned
- **THEN** its receiving process and local endpoint context are displayed without a remote endpoint

### Requirement: Accepted clients do not fragment group presentation

The frontend SHALL preserve backend grouping and SHALL NOT derive group identity, headings, notification presentation, or aggregate visualization from remote client addresses or ports.

#### Scenario: Multiple clients contribute to one group

- **WHEN** one `network.accept` group contains occurrences from different remote endpoints
- **THEN** the frontend shows one receiving group and directs the user to raw occurrences to investigate clients
