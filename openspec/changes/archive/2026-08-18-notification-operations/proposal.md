## Why

Project operators need a safe, accessible UI for configuring webhook delivery and diagnosing notification failures without exposing credentials or relying on fabricated client data. The backend already publishes most notification operations through OpenAPI, so the web UI should make those typed capabilities usable and explicitly surface the remaining health-contract gap.

## What Changes

- Add project notification routes for destination management and delivery history/detail, with links from project navigation.
- Add create, edit, test, disable, and signing-secret rotation workflows using only generated OpenAPI types and operations.
- Treat create/rotate secrets as one-time values that are copied in-memory and cleared when their dialog closes.
- Add cursor pagination in the URL, safe delivery/attempt diagnostics, shared request-ID errors, responsive layouts, confirmations, and accessible live feedback.
- Add notification-health UI and adaptive visibility-aware polling from the documented OpenAPI operation without synthesizing health data.
- Add unit, browser, and accessibility coverage for all contract-supported workflows and document routes, security rules, polling behavior, and blockers.

## Capabilities

### New Capabilities

- `notification-operations`: Project-level webhook destination administration, one-time secret handling, delivery history/detail, diagnostics, accessibility, and API-contract boundaries.
- `notification-health`: Project notification worker and queue health presentation, staleness handling, and adaptive polling, conditional on the authoritative OpenAPI contract.

### Modified Capabilities

- `tenant-navigation`: Project navigation exposes the Notifications section and preserves project context.
- `api-client-foundation`: Notification operations use generated transport types and the shared safe API error/request-ID layer.

## Impact

- Adds TanStack Router project routes and notification feature modules under `src/`.
- Extends generated-client query/mutation usage without hand-written transport schemas or persisted API data.
- Adds Vitest/Testing Library, Playwright, and axe coverage plus notification operations documentation.
- Uses the backend OpenAPI definition for `GET /api/v1/projects/{project_id}/notification-health` and its generated response schema.
