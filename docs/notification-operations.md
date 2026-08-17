# Notification operations

Project notification operations are available at:

- `/projects/:projectId/notifications` — health contract status, webhook destinations, and cursor-paginated delivery history.
- `/projects/:projectId/notifications/destinations/:destinationId` — destination configuration, test delivery, disable, and signing-secret rotation.
- `/projects/:projectId/notifications/deliveries/:deliveryId` — safe delivery summary and attempt timeline.

All requests use the shared authenticated API client and types projected from the generated OpenAPI declarations. The delivery history accepts only the documented opaque `cursor`; it is stored in the URL. The UI does not implement local substitutes for server filters.

## Credentials and secrets

Bearer credentials remain in the existing in-memory session. Signing secrets are rendered only from create and rotate responses, kept in component state while the one-time dialog is mounted, copied through the Clipboard API on request, and cleared when the dialog closes. Secrets are never written to localStorage, sessionStorage, IndexedDB, URLs, or logs. A destination detail page does not render a masked placeholder because the secret cannot be recovered.

Disable and rotate require confirmation. Successful destructive operations invalidate destination list/detail, delivery history, and the reserved notification-health query key. Errors use the shared safe message, error code, and copyable request ID.

Delivery detail intentionally does not render the OpenAPI `response_excerpt` field. It also does not render signing material, bearer credentials, stack traces, or a full destination URL.

## Health and polling

Notification health uses the generated response for `GET /api/v1/projects/{project_id}/notification-health`. The UI presents `disabled`, `idle`, `backlogged`, `retrying`, `failing`, and `draining` with status text that does not depend on color. `disabled` and `draining` are informational delivery states, not overall Okoscope availability incidents.

Query behavior is:

- 10-second refresh for normal states;
- 3-second refresh for `backlogged`, `retrying`, `failing`, and `draining`;
- no polling while the browser tab is inactive;
- retain the last successful response after a transient refresh failure and label it stale;
- no persistence of responses or bearer credentials.

The last successful health snapshot remains visible and is explicitly labelled stale when a refresh fails. Health responses and bearer credentials are not persisted in browser storage.
