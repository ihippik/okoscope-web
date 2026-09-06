# notification-health Specification

## Purpose

Defines authoritative Project notification-delivery health presentation, operational state meaning, adaptive polling, and stale-data handling.

## Requirements

### Requirement: Notification health reflects the authoritative contract

Once OpenAPI publishes `GET /api/v1/projects/{project_id}/notification-health`, the Web UI SHALL use its generated response type to present delivery enabled state, active destination count, pending, due, retrying, in-flight, expired leases, failed, oldest-due age, and observation time. Until that operation exists, the Web UI MUST expose a contract blocker and MUST NOT synthesize values or call an untyped path.

#### Scenario: Health operation is absent

- **WHEN** the pinned generated OpenAPI client has no notification-health operation
- **THEN** the Notifications route identifies the missing backend contract and does not present fabricated health status

#### Scenario: Health operation becomes available

- **WHEN** the generated client includes the operation and a successful response is returned
- **THEN** every documented counter and timestamp is presented from that response

### Requirement: Health states communicate operational meaning

The Web UI SHALL provide distinct text for `disabled`, `idle`, `backlogged`, `retrying`, `failing`, and `draining`; it MUST describe `disabled` and `draining` as informational rather than incidents and MUST NOT imply notification health is overall Okoscope availability.

#### Scenario: Any health state is shown

- **WHEN** a supported health response is rendered
- **THEN** its meaning and severity are conveyed in text independently of color, with failed deliveries linked from `failing`

### Requirement: Health polling adapts and preserves usable data

The Web UI SHALL poll health every 10 seconds normally and every 3 seconds for `retrying`, `failing`, `backlogged`, or `draining`, SHALL pause polling while the tab is inactive, and SHALL retain the last successful value with an explicit stale indication after a transient refresh failure.

#### Scenario: Health severity changes

- **WHEN** the last successful state enters or leaves an elevated polling state
- **THEN** the next polling interval changes between 3 and 10 seconds accordingly

#### Scenario: Background refresh fails

- **WHEN** a health refetch fails after successful data was displayed
- **THEN** the previous counters remain visible and the UI marks them stale with safe retry diagnostics

#### Scenario: Tab is inactive

- **WHEN** the document is not visible
- **THEN** no health polling request is scheduled in the background
