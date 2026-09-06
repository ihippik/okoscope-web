## Context

The application already uses file-based TanStack Router routes, TanStack Query, an in-memory bearer session, generated OpenAPI declarations, and a shared `ApiClientError`/request-ID presentation. The pinned OpenAPI contract contains destination operations, test delivery, disable, rotate-secret, cursor-paginated delivery reads, and project notification health. The client initially supported bodyless GET/POST only, so typed mutation bodies and PATCH are added without inventing transport models.

## Goals / Non-Goals

**Goals:**

- Deliver project-scoped destination and delivery workflows using generated schemas and operation parameter/response types.
- Keep bearer credentials and one-time signing secrets ephemeral and absent from browser persistence, URLs, and logs.
- Reuse normalized errors and query invalidation across every mutation.
- Preserve the delivery cursor in validated route search state and support responsive, keyboard-accessible interaction.
- Present typed notification health with adaptive polling and stale-data behavior.

**Non-Goals:**

- Defining or modifying the backend OpenAPI contract from the frontend repository.
- Synthesizing health counters, server-side filters, semantic metadata, terminal reasons, or retry fields not returned by OpenAPI.
- Displaying unrestricted response excerpts, secrets after dialog dismissal, or full exception objects.

## Decisions

1. **Contract aliases remain the only transport types.** Notification aliases are projections from `components` and `operations` in the generated declaration. The API client gains JSON-body POST/PATCH support as a generic transport primitive. Hand-written UI-only view state is allowed, but no duplicated API interface is introduced. This is preferred to ad hoc request objects because OpenAPI changes then fail typechecking.

2. **Feature-local query keys and options coordinate reads and invalidation.** Destination list/detail and delivery list/detail use stable project-scoped keys. Every successful disable/rotate mutation invalidates destination list/detail, delivery history, and the reserved health key; create/update/test invalidate the resources they can affect. This is preferred to local cache mutation because revisioned destination responses and delivery side effects remain server-authoritative.

3. **The one-time secret lives only in mounted component state.** Create and rotate responses are destructured into a secret-dialog model; closing/unmounting sets that model to null. Copy uses `navigator.clipboard` directly and live regions announce outcomes. No placeholder is rendered on ordinary detail pages. This limits exposure while still supporting the required handoff.

4. **Delivery pagination is one page per URL cursor.** The route validates only the OpenAPI-supported `cursor`; next navigation writes `next_cursor`, and a small in-memory cursor trail provides a previous action for the current mount. No client filtering is added. This keeps links reproducible and prevents UI filters from implying server behavior.

5. **Potentially unsafe fields are allowlisted for rendering.** Delivery detail renders the documented summary and attempt fields but intentionally omits `response_excerpt`. The contract currently lacks semantic event metadata beyond origin/source/event name and has no distinct terminal reason or next-attempt field; the UI labels only fields actually supplied.

6. **Health follows the generated contract.** The query uses 10-second polling for idle/disabled, 3-second polling for backlogged/retrying/failing/draining, `refetchIntervalInBackground: false`, and retained successful data with an explicit stale warning on refresh failure.

7. **Native dialogs provide the confirmation boundary.** A reusable accessible modal built on the native `dialog` element provides labelled/described confirmation and secret views without adding a dependency. Submit buttons are disabled while mutations are pending.

## Risks / Trade-offs

- **[Frequent elevated-state polling can increase request volume]** → Poll every three seconds only for elevated states and pause polling when the tab is inactive.
- **[Destination `url` is a full URL in the contract]** → Render it only on the destination-management surface because no safe representation exists, and document the backend opportunity to add one for delivery diagnostics.
- **[Delivery detail exposes `response_excerpt` in its schema]** → Never render it, because the requested UI forbids unrestricted response bodies.
- **[Native dialog behavior varies in test environments]** → Keep focusable labelled controls and a simple open-state wrapper; test keyboard-accessible names and close-time state clearing.
- **[Cursor previous history is mount-local]** → Browser history remains authoritative; direct cursor links still work, while server cursors remain opaque.

## Migration Plan

Add client primitives and feature queries/components first, then routes/navigation, tests, and documentation. The new routes are additive and can be rolled back by removing their files and project link. No stored frontend data or backend migration is introduced. When the health operation arrives, regenerate schema declarations and replace the blocker panel with the specified query without migrating client state.

## Open Questions

- Will delivery summaries gain `next_attempt_at`, `terminal_reason`, semantic event metadata, and a safe destination representation?
- Should future server-side delivery filters use status, destination, event name, or another documented combination?
