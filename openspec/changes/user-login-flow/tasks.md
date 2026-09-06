## 1. Contract and compatibility

- [x] 1.1 Copy the authoritative migration-16 backend OpenAPI document into the pinned frontend input and regenerate committed TypeScript declarations
- [x] 1.2 Add contract regression assertions for register, login, current-user, logout, `AuthContext`, `owner | member`, cookie security, and the absence of tenant bearer authentication
- [x] 1.3 Raise the frontend compatibility threshold to database migration 16 and update startup compatibility tests and documentation
- [x] 1.4 Project generated auth request, response, identity, Organization, and role types through the existing API type boundary without handwritten transport DTOs or casts

## 2. Credentialed API transport

- [x] 2.1 Send browser credentials on same-origin and configured absolute-origin API requests while preserving runtime URL validation, request IDs, abort signals, JSON validation, and safe errors
- [x] 2.2 Remove tenant credential lookup and `Authorization` attachment from ordinary protected requests while leaving application-ingestion data handling unaffected
- [x] 2.3 Add explicit request behavior that distinguishes anonymous current-user `401`, invalid-login `401`, and expired authenticated protected-request `401`
- [x] 2.4 Add API client tests for credentialed fetch, no tenant bearer leakage, auth success and no-content responses, expected authentication failures, and global session-expiry notification

## 3. Authentication state and cache isolation

- [x] 3.1 Replace the in-memory credential/session-mode store with an authentication provider representing checking, anonymous, authenticated `AuthContext`, and retryable restoration error states
- [x] 3.2 Resolve current-user context only after build compatibility succeeds and gate both anonymous forms and protected route content until resolution completes
- [x] 3.3 Establish authenticated context directly from successful login and registration responses without persisting it as a substitute for reload restoration
- [x] 3.4 Centralize protected-query removal on login, registration, logout, and expired-session identity boundaries while retaining only public build-info cache data
- [x] 3.5 Preserve the current route and validated search state through current-user restoration and interactive authentication, including direct deep links and browser reload
- [x] 3.6 Add state/provider tests for restoration success, expected anonymous response, retryable restoration error, identity change, cache isolation, and session expiry

## 4. Anonymous first screen

- [x] 4.1 Replace the credential launcher with a responsive localized first screen combining Okoscope product orientation, language selection, and an accessible authentication card
- [x] 4.2 Implement sign-in as the initial mode with email/password semantics, duplicate-submit prevention, busy state, uniform invalid-credentials presentation, and password cleanup
- [x] 4.3 Implement an unconditionally visible registration mode with email, password, Organization name, and editable slug using documented structural constraints
- [x] 4.4 Submit registration directly without capability probes or fallbacks and present `registration_disabled`, conflicts, validation failures, network failures, and invalid responses through correlated safe errors
- [x] 4.5 On successful login or registration, reveal the originally requested route and announce the transition accessibly without a forced redirect to root
- [x] 4.6 Add English and Russian copy for first-screen value proposition, modes, fields, constraints, busy states, authentication failures, session expiry, roles, and retry actions
- [x] 4.7 Add component and accessibility tests for both modes, keyboard/focus behavior, narrow/wide layouts, language switching, validation, duplicate submission, safe errors, and unconditional registration visibility

## 5. Authenticated shell, roles, and profile

- [x] 5.1 Remove hard-coded tenant/admin development entry constants, session-mode branching, and the ordinary-user system-admin onboarding navigation action
- [x] 5.2 Derive authenticated shell identity and Organization context from `AuthContext` and retain existing tenant navigation and Organization attention landing behavior
- [x] 5.3 Inventory existing owner-only Project/Application/application-credential controls and hide their presentation from members while preserving backend-authoritative `403` handling
- [x] 5.4 Redesign profile to display normalized email, Organization name and slug, localized membership role, language selection, and no session-secret material
- [x] 5.5 Implement authoritative backend logout with in-flight protection, successful anonymous transition/cache clearing, and retryable failure that retains authenticated context
- [x] 5.6 Add shell/profile tests for owner/member presentation, absence of system-admin entry, identity fields, forbidden responses, successful logout, failed logout, and post-logout cache isolation

## 6. Browser flows and cleanup

- [x] 6.1 Update API fixtures to establish and validate browser cookies for registration, login, current-user restoration, protected operations, expiry, and logout
- [x] 6.2 Add Playwright coverage for first visit, registration, sign-in rejection/success, authenticated reload, direct deep-link restoration, expired session, identity change, and logout
- [x] 6.3 Add Playwright coverage proving registration remains visible and displays the correlated backend `registration_disabled` response without probes or fallback behavior
- [x] 6.4 Verify exact-origin credentialed CORS behavior and state-changing trusted-Origin requests for separately configured development API origins
- [x] 6.5 Remove obsolete credential-session tests, bearer-first-screen copy, README guidance, verification-matrix entries, and development tenant-token assumptions
- [x] 6.6 Run formatting, lint, typecheck, generated-contract drift checks, unit/component suites, Playwright, and accessibility verification and resolve all regressions
