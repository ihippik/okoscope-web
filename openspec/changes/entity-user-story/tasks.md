## 1. Contract and Shared Transport

- [x] 1.1 Review and retain the updated provisioning OpenAPI snapshot, regenerate `schema.d.ts`, and expose generated aliases for admin hierarchy, create requests, credential metadata, and one-time responses without handwritten transport models.
- [x] 1.2 Extend `ApiClient` with typed DELETE support and successful `204`/empty-body handling while preserving structured error decoding.
- [x] 1.3 Preserve documented field-error maps in normalized API errors and ensure unknown response properties, Authorization values, and tokens are discarded.
- [x] 1.4 Add provisioning mutation helpers for fresh UUID idempotency keys, single-flight submission, and no automatic retry of 400, 401, 404, or 409 responses.
- [x] 1.5 Add API client tests for admin Authorization, JSON creates, idempotency headers, field errors, empty `204`, safe DELETE failures, and absence of credentials from request IDs and diagnostics.

## 2. Provisioning Data Layer

- [x] 2.1 Add secret-free query keys and typed query options for admin Organizations, scoped Projects, scoped Applications, admin Application metadata, and Application credential metadata.
- [x] 2.2 Add typed create Organization, create Project, create Application, issue credential, and revoke credential functions that encode path identifiers and keep one-time responses out of query caches.
- [x] 2.3 Add query/mutation tests proving hierarchy scope separation, identifier encoding, secret-free cache keys, invalidation after creation/revocation, and no automatic mutation replay.

## 3. Entity Form Foundation

- [x] 3.1 Implement reusable name/slug state and validation for trimmed 1–120 character names and 1–63 character lowercase ASCII single-hyphen slugs.
- [x] 3.2 Implement deterministic slug derivation that stops overwriting the slug after explicit operator editing.
- [x] 3.3 Implement reusable field rendering for local and backend field errors, pending/disabled submission, safe request IDs, and accessible focus behavior.
- [x] 3.4 Add unit/component tests for slug derivation, manual slug preservation, boundary validation, field-error association, and double-submission prevention.

## 4. Onboarding and Admin Navigation

- [x] 4.1 Add a file-based onboarding route behind compatibility and ephemeral admin credential gates, with localized navigation entry and document metadata.
- [x] 4.2 Implement admin Organization discovery and selection plus the create Organization step and its empty, loading, retry, 401, 409, and success states.
- [x] 4.3 Implement scoped Project discovery and selection plus the create Project step using only the selected or returned Organization ID.
- [x] 4.4 Implement scoped Application discovery and selection plus the create Application step using only the selected or returned Project ID.
- [x] 4.5 Implement wizard progress/back behavior that retains only non-secret identifiers and inputs, resumes partial hierarchies, and never attempts to recover an existing Application token.
- [x] 4.6 Add route and component tests for fresh onboarding, resume at each hierarchy level, parent 404 recovery, 401 session clearing, 409 field feedback, loading/disabled states, and deep-link/browser-history safety.

## 5. One-Time Connect Agent Experience

- [x] 5.1 Implement component-local one-time token state with an explicit save-now warning, selectable token display, Copy token action, accessible feedback, and cleanup on close, navigation, unmount, reload, and session end.
- [x] 5.2 Implement pure Kubernetes Secret generation using the Application slug and token, with exact Copy Secret behavior while the one-time view remains mounted.
- [x] 5.3 Implement workload namespace input and pure agent selector generation with the documented label and credential-file path, plus Copy agent config behavior.
- [x] 5.4 Add tests for exact generated YAML, clipboard success/failure, unmount cleanup, mutation reset, and absence of plaintext token from URL, localStorage, sessionStorage, query cache, logs, and error output after close.

## 6. Application Credential Management

- [x] 6.1 Add an admin-safe Agent credentials section reachable from Application context without depending on tenant observability enrichment calls.
- [x] 6.2 Implement the credential table with name, token hint, localized timestamps, last-used value, derived Active/Never used/Revoked status, scoped loading/error/retry states, and Revoke only for active rows.
- [x] 6.3 Implement the Issue credential dialog with contract-compatible name validation, unique-name conflict handling, single-flight issuance, metadata invalidation, and a one-time token modal outside query cache.
- [x] 6.4 Implement revoke confirmation with credential identity, an additional last-active ingestion warning, idempotent DELETE handling, disabled pending controls, safe failure recovery, and metadata refresh.
- [x] 6.5 Add component/API-mock tests for status derivation, secret-free listing, issuance cleanup, 409 handling, normal revocation, last-active warning, repeated `204`, refresh after mutation, and revocation failure.

## 7. Accessibility, Localization, and Verification

- [x] 7.1 Add complete English and Russian strings for onboarding, admin credential limitations, Kubernetes setup, credential management, validation, errors, confirmations, statuses, and clipboard announcements; update localization catalog guards.
- [x] 7.2 Ensure dialogs provide initial focus, keyboard containment/dismissal policy, focus restoration, accessible descriptions, live copy announcements, and responsive layouts using the existing design system.
- [x] 7.3 Add focused Playwright coverage for the successful onboarding/connect-agent journey and issue/revoke credential journey without recording plaintext tokens in snapshots or traces.
- [x] 7.4 Run formatter, lint, typecheck, OpenAPI generation/check, unit/component tests, production build, and focused end-to-end tests; document any environment-only verification separately.
