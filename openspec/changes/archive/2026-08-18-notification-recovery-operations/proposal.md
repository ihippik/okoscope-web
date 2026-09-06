## Why

Operators can diagnose failed notification deliveries but cannot safely recover them from the Web UI. The published contract now exposes idempotent retry, cancel, bounded bulk retry, and auditable recovery-operation reads, so these controls can be added without client-side simulation.

## What Changes

- Add confirmed retry and cancel actions to delivery detail, gated by server-provided capability flags.
- Add bounded bulk retry using only documented filters and a required per-command idempotency key.
- Add cursor-paginated recovery-operation history and detail routes with affected-delivery audit information.
- Present idempotent replay results and safe `409` conflict diagnostics through the shared request-ID error layer.
- Invalidate notification health, deliveries, and recovery history after successful commands.
- Add accessible live feedback, responsive layouts, tests, and operator documentation.

## Capabilities

### New Capabilities

- `notification-recovery`: Idempotent single and bulk delivery recovery commands plus recovery-operation audit history.

### Modified Capabilities

- `notification-operations`: Delivery detail gains server-authorized retry/cancel actions and delivery history gains bulk retry entry points.
- `tenant-navigation`: Project notification navigation gains recovery history and recovery detail routes.

## Impact

- Extends notification feature queries, mutations, routes, components, and generated-schema aliases.
- Uses existing OpenAPI operations and the shared authenticated API client; no new dependency or browser persistence is introduced.
- Adds Vitest, Playwright, axe, and documentation coverage for commands, conflicts, idempotency, pagination, and audit detail.
