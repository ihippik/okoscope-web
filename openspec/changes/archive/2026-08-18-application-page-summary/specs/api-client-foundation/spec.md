## ADDED Requirements

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
