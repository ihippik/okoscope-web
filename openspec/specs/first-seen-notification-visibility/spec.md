# first-seen-notification-visibility Specification

## Purpose

Defines safe, accessible presentation of first-seen notification delivery state without exposing secrets or implying risk.

## Requirements

### Requirement: Every first-seen notification state has explanatory presentation

The Web UI SHALL provide a visible text label and understandable explanatory copy for `pending`, `not_configured`, `delivering`, `delivered`, `terminally_failed`, and `backfill_suppressed`, and MUST NOT present notification delivery state as risk or severity.

#### Scenario: Notification state is recognized

- **WHEN** Runtime Group Detail contains any supported first-seen notification state
- **THEN** the UI renders its accessible label and state-specific explanation without relying on color alone

#### Scenario: Notification state is not configured

- **WHEN** the state is `not_configured`
- **THEN** the UI explains that a webhook destination is not configured and does not offer destination creation in this workflow

#### Scenario: Notification is pending

- **WHEN** the state is `pending`, including when delivery-worker context indicates delivery is disabled
- **THEN** the UI states that delivery has not completed and does not imply that a notification was sent successfully

#### Scenario: Notification terminally failed or was suppressed

- **WHEN** the state is `terminally_failed` or `backfill_suppressed`
- **THEN** the UI distinguishes final delivery failure from intentional backfill suppression in plain language

### Requirement: Notification presentation excludes secrets

The notification summary SHALL render only contract fields intended for operators and MUST NOT display webhook credentials, destination secrets, signing secrets, or raw internal notification objects.

#### Scenario: Notification data contains internal material

- **WHEN** the detail response contains internal notification or destination fields not included in the presentation allowlist
- **THEN** the UI omits them while retaining the supported state summary
