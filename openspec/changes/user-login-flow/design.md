## Context

The frontend currently treats a non-empty in-memory bearer credential as proof of authentication, attaches it to protected requests, clears it on reload or `401`, and exposes hard-coded tenant/admin development entry points on the first screen. Backend migration 16 removes Organization-wide tenant credentials and publishes registration, login, current-user, and logout operations backed by an opaque `HttpOnly` cookie. Their safe response body is an `AuthContext` containing user, Organization, and `owner | member` membership role.

The frontend must preserve the existing build-compatibility gate, generated-contract discipline, query correlation, tenant-safe navigation, localization, accessible responsive behavior, and backend-authoritative permission model. Public registration can be disabled by backend configuration, but the product decision is to keep registration visible and submit the documented operation directly. The frontend must neither probe that configuration nor invent alternate behavior.

## Goals / Non-Goals

**Goals:**

- Establish one explicit browser authentication state from the published auth operations and restore it across reloads.
- Make the first screen a clear localized sign-in/registration experience rather than a development credential launcher.
- Send and revoke opaque cookie sessions safely without exposing or persisting session material.
- Preserve the requested route across session restoration and interactive authentication.
- Use returned Organization and role context for identity presentation and proactive navigation/action visibility while retaining server authorization as authoritative.
- Keep protected query data isolated from anonymous or expired sessions.

**Non-Goals:**

- Password reset, verification, invitations, SSO/OIDC, MFA, password changes, or multi-Organization selection.
- Discovering whether registration is enabled before submission, hiding registration, or adding client-side registration fallbacks.
- Replacing or exposing application ingestion credentials.
- Converting the system administrator bearer credential into a user session or making global admin routes available to Organization owners.
- Duplicating backend authorization rules or treating hidden controls as an authorization boundary.

## Decisions

### Model authentication as resolved server context, not possession of a client secret

Introduce an application-level auth store/provider with `checking`, `anonymous`, `authenticated(AuthContext)`, and retryable `error` states. After build compatibility succeeds, `GET /api/v1/auth/me` resolves the initial state. Login and registration replace the state directly with their returned `AuthContext`; logout and session-expiry replace it with `anonymous`.

This prevents an initial anonymous-screen flash, represents restoration failures separately from a valid anonymous response, and makes safe identity/role data available throughout the shell. Using only a boolean was rejected because profile and role-aware presentation would otherwise require redundant enrichment requests. Persisting `AuthContext` was rejected because `/auth/me` must remain authoritative after role, membership, disablement, expiry, or revocation changes.

### Use credentialed fetch for the published cookie transport

The shared API client will opt requests into browser credentials so the browser can accept `Set-Cookie` from authentication responses and send `okoscope_session` to protected operations. It will no longer read tenant credentials or attach their bearer header. The cookie remains invisible to application code, query keys, logs, errors, URLs, and storage.

For an absolute cross-origin API base URL, the existing exact backend CORS allowlist and `Access-Control-Allow-Credentials` contract remain mandatory. State-changing requests rely on the browser `Origin` header and backend trusted-origin validation. A frontend proxy, token extraction, or manual cookie handling was rejected because each would undermine the backend security boundary.

### Keep system administration outside the ordinary user shell

The first screen and authenticated navigation will contain no hard-coded admin credential or user-facing `Start onboarding` path. An Organization `owner` is a tenant administrator, not a system administrator. Existing owner-supported Project/Application provisioning remains accessible through tenant routes; global Organization administration is outside this login flow.

This avoids conflating two trust domains. Retaining the second development button was rejected because it exposes an implementation credential and teaches the wrong product model.

### Present login and registration as two explicit modes on one first-screen surface

The anonymous surface will combine product orientation with an accessible authentication card. Sign-in is the initial mode; a visible control switches to registration, and both modes retain language selection. Registration always exposes email, password, Organization name, and Organization slug and submits directly to `registerUser`.

Client validation will reflect only documented structural constraints needed for usable controls, such as required fields, email input semantics, password length, and slug format. Backend errors including `registration_disabled`, `registration_conflict`, and validation failures remain authoritative and use the shared safe message/code/request-ID presentation. No capability endpoint, speculative probe, retry-as-login, or locally inferred policy will be added.

### Preserve route intent while gating the root shell

The root shell will leave the browser URL unchanged while checking or requesting authentication. Successful `/auth/me`, login, or registration reveals the matched route already represented by that URL, so a deep link does not need to be serialized into query parameters or storage. Logout returns to the anonymous surface at the current URL; a later login may resume it if authorized.

This is preferable to always redirecting to `/`, which would discard operational context. If the authenticated user cannot access the requested tenant resource, the existing server-authoritative not-found/forbidden presentation applies.

### Clear protected cache at every authenticated-identity boundary

Login, registration, logout, and protected `401` transitions will remove protected queries before another identity can observe cached tenant data. Build-info may remain cached because it is public. A protected `401` makes the shell anonymous and surfaces a localized session-expired notice; the failing feature does not independently mutate auth state.

Authentication endpoint failures require special classification: the expected `401 invalid_credentials` from login is a form error, while `401` from `/auth/me` means anonymous and must not recursively invoke global unauthorized handling. Registration and logout retain their documented status semantics. Central request options or endpoint-specific auth methods will make these distinctions explicit instead of relying on path string inspection.

### Project generated auth types and role-aware UI from the pinned contract

The authoritative backend OpenAPI document will replace the pinned frontend input and regenerate declarations before auth code is written. Auth request/response types and operation paths will be derived from those declarations. The compatibility threshold becomes migration 16.

The returned role controls presentation only: `member` does not see owner-only provisioning actions, while every mutation still relies on backend `403` enforcement. Handwritten auth DTOs, casts, and extra enrichment requests are rejected by the repository contract rules.

## Risks / Trade-offs

- **[Cross-origin cookies are omitted by the browser]** → Use credentialed fetch consistently and cover exact-origin development/production configuration in integration tests and documentation.
- **[A global 401 handler consumes expected login or `/auth/me` responses]** → Make unauthorized side effects explicit per request category and test initial anonymous, invalid login, and expired protected-session paths independently.
- **[A prior user's cached tenant data appears after identity change]** → remove all protected queries before publishing anonymous or new authenticated context.
- **[Registration is disabled but remains visible]** → display the backend's safe correlated `registration_disabled` error; do not hide the form or create a fallback, as explicitly required by the product decision.
- **[Role-based hiding drifts from backend rules]** → use only the generated bounded role for known owner-only presentation and treat backend `403` as authoritative.
- **[Secure cookies do not work on plaintext development origins]** → rely on the backend's explicit development-plaintext cookie configuration; do not weaken production cookie requirements in the UI.
- **[Logout fails temporarily]** → keep the current authenticated context and show a retryable correlated mutation error, rather than claiming that the server-side session ended.

## Migration Plan

1. Copy backend migration-16 OpenAPI into the pinned input, regenerate declarations, and update compatibility assertions.
2. Add credentialed transport and endpoint-aware unauthorized behavior while retaining existing feature request shapes.
3. Introduce auth context/bootstrap, then replace the credential gate with checking, anonymous, authenticated, and error surfaces.
4. Implement localized login/registration, profile identity, role-aware navigation/actions, authoritative logout, and cache isolation.
5. Remove tenant/admin development entry constants and obsolete credential tests/documentation.
6. Run contract checks, unit/component suites, accessibility checks, and browser flows against cookie-aware fixtures for reload, deep links, expiry, roles, and logout.

Deployment requires backend migration 16 and a bootstrapped owner or explicitly enabled registration. Cross-origin deployments must list the exact Web origin. Rollback requires deploying the previous frontend only with a backend version that still supports its tenant bearer contract; the migration-16 backend intentionally provides no tenant bearer fallback.

## Open Questions

- Whether an unsuccessful logout caused by a confirmed already-expired session should be normalized by the API layer as anonymous; implementation should follow the generated status contract and backend idempotency tests rather than inventing a client exception.
- Which owner-only controls beyond current Project/Application/ingestion-credential provisioning need presentation gating; this should be enumerated from existing routes during implementation without expanding backend permissions.
