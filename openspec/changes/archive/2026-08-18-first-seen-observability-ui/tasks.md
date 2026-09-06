## 1. Contract and Compatibility Foundation

- [x] 1.1 Copy the authoritative backend commit `76ff32fe913ccce4a4392262b286df75dae013c6` OpenAPI v1 document into the pinned frontend contract input and regenerate the TypeScript API artifacts with the repository scripts.
- [x] 1.2 Add contract regression assertions for Runtime Group first-seen/lifecycle/notification fields, list filter parameters, the paginated occurrences operation, and acknowledge/resolve/reopen operations with typed successful responses.
- [x] 1.3 Update affected generated-client consumers until typecheck and generation freshness checks pass without duplicate DTOs, `any`, manual untyped requests, or unjustified assertions.
- [x] 1.4 Raise the build-info compatibility gate to database migration 6 while retaining API version `v1`, and add compatible, too-old, and missing-migration tests with safe diagnostics.

## 2. Runtime Groups URL State and List

- [x] 2.1 Extend Runtime Groups search parsing/serialization with contract-supported event kind, `open`/`acknowledged`/`resolved` status, release, first-seen from/to, and last-seen filters while retaining existing supported filters.
- [x] 2.2 Update filter navigation and query-option factories so every normalized filter participates in generated request parameters and query identity and every filter change clears the cursor.
- [x] 2.3 Preserve canonical list filters and cursor in group-detail links/return navigation and add unit/router coverage for deep links, pagination, invalid search normalization, and browser-history restoration.
- [x] 2.4 Extend the responsive Runtime Groups presentation with first seen, last seen, occurrence count, lifecycle status, and release/Kubernetes context using text labels and accessible focus behavior.
- [x] 2.5 Implement a centralized, clock-injectable recent-first-seen mapping and non-color-only presentation without risk/severity semantics, including boundary and invalid-timestamp unit tests.
- [x] 2.6 Update list skeleton, filtered/unfiltered empty, correlated error/retry, success, and bounded pagination states and cover them with component and axe tests.

## 3. Runtime Group Detail and Notification Summary

- [x] 3.1 Extend the contract-derived detail query and ownership gate to expose first event ID, first/last seen times, occurrence count, lifecycle status/change time, representative event, semantic summary, Kubernetes attribution, release attribution, and notification summary.
- [x] 3.2 Build responsive, labeled detail sections using an explicit operator-facing field allowlist and the bounded safe JSON viewer so credentials, signing secrets, and internal notification objects cannot be rendered.
- [x] 3.3 Implement a total notification-state presentation for `pending`, `not_configured`, `delivering`, `delivered`, `terminally_failed`, and `backfill_suppressed`, with pending/disabled-worker and missing-webhook wording that never implies risk or successful delivery.
- [x] 3.4 Add unit/component tests for all notification mappings, missing optional attribution, secret-field exclusion, ownership mismatch, loading, correlated error/retry, responsive behavior, and axe compliance.

## 4. Occurrence Exploration

- [x] 4.1 Add contract-derived occurrence query keys/options with group ID, opaque cursor, and a centralized bounded page-size constant; verify that no automatic all-page accumulation occurs.
- [x] 4.2 Add the occurrence section/route state to Runtime Group Detail with cursor navigation that requests only the selected page and preserves the surrounding group/list navigation context.
- [x] 4.3 Render observed time, process command, event kind, bounded safe payload, node, namespace, Pod, container, and release with neutral fallbacks for absent optional attribution.
- [x] 4.4 Implement occurrence-specific skeleton, empty, correlated error/retry, success, and next-page states with keyboard-operable controls and responsive semantic ordering.
- [x] 4.5 Add integration/component tests for bounded request parameters, cursor query identity and navigation, safe payload rendering, optional fields, failure/retry behavior, and occurrence axe coverage.

## 5. Lifecycle Actions

- [x] 5.1 Define and unit-test the generated-status-to-valid-actions mapping for acknowledge, resolve, and reopen, including unknown/unsupported status fallback.
- [x] 5.2 Add generated-client TanStack Query mutations for acknowledge, resolve, and reopen with shared pending-state duplicate-submission prevention and request-ID-aware normalized errors.
- [x] 5.3 Add accessible lifecycle controls to detail, execute acknowledge/reopen directly, and implement resolve confirmation with initial focus, cancel behavior, keyboard operation, and focus restoration.
- [x] 5.4 On successful mutation, invalidate Runtime Group Detail and all related Application-scoped Runtime Groups queries; preserve confirmed state and restore retryable controls on failure.
- [x] 5.5 Add component/integration tests for action visibility in every status, resolve confirmation, duplicate-submit blocking, safe correlated errors, and exact Query invalidation after all three successful mutations.

## 6. End-to-End Verification and Delivery

- [x] 6.1 Add a Playwright journey for Application → Runtime Groups → Group Detail → bounded occurrences → acknowledge → resolve → reopen, asserting status/control transitions and request behavior.
- [x] 6.2 Extend Playwright coverage for filtered deep links, cursor navigation, detail navigation, browser Back restoration, responsive interaction, keyboard focus, and axe checks on the updated list/detail/occurrence states.
- [x] 6.3 Update manual production-smoke documentation with the Payment API project/application and `busybox` group fixture IDs, keeping those UUIDs out of production source code.
- [x] 6.4 Update container smoke fixtures/assertions only if required by migration-6 build info or the refreshed contract, then run unit/component, typecheck, contract freshness, Playwright/axe, build, and container smoke verification.
