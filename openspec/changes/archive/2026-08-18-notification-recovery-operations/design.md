## Context

Notification delivery detail and history already use generated OpenAPI types and the shared normalized error layer. The updated contract adds single retry/cancel, bounded bulk retry, and cursor-paginated recovery audit operations. Every command requires an `Idempotency-Key` header and can return structured `409` conflicts.

## Goals / Non-Goals

**Goals:**

- Make only server-authorized recovery commands available and require explicit confirmation.
- Generate a fresh idempotency key per operator command, retain it while that command is pending, and never place it in URLs or persistence.
- Show safe command outcomes, conflicts, audit history, and affected deliveries with request IDs.
- Keep recovery state server-authoritative through query invalidation.

**Non-Goals:**

- Automatic retries initiated by the browser, unrestricted batch sizes, or client-derived eligibility.
- Persisting idempotency keys or recovery API responses.
- Displaying credentials, destination URLs, response excerpts, or internal exception data.

## Decisions

1. **API client accepts explicit headers.** The generic request options gain a header record so generated-operation requirements such as `Idempotency-Key` can be sent without a recovery-specific transport implementation.
2. **One key per confirmed command.** A UUID is created at confirmation time and captured by the mutation call. TanStack mutation retry remains disabled, preventing a new semantic command from being issued accidentally; a deliberate operator retry creates a new key.
3. **Eligibility follows response flags.** Single retry and cancel buttons render disabled unless `retry_allowed` or `cancel_allowed` is true. Conflicts remain possible due to races and use the shared safe error UI.
4. **Bulk retry mirrors the contract.** The form exposes destination ID, failed-before/after, error class, and limit only. Empty optional values are omitted and limit is bounded to 1–200.
5. **Audit history has URL cursor/filter state.** `command_type` and `cursor` are validated route search values. Detail renders only documented aggregate and affected-delivery fields.
6. **Commands invalidate broadly.** Success invalidates delivery list/detail, health, recovery history, and affected operation detail keys.

## Risks / Trade-offs

- **[Eligibility can change after render]** → Keep confirmation text explicit and present `409` conflicts safely.
- **[Double submission could create duplicate commands]** → Disable controls while pending and reuse one key for the in-flight request.
- **[Bulk retry affects many deliveries]** → Require confirmation, show exact filters and limit, and render bounded result counts.

## Migration Plan

Add client header support and recovery query types, then commands, routes, tests, and documentation. The feature is additive and can be rolled back by removing recovery routes/actions without stored client data migration.
