## Why

The Web UI still gates protected navigation with hard-coded, in-memory bearer credentials even though the backend now authenticates people through email/password and revocable `HttpOnly` browser sessions. The startup and first-screen experience must adopt the published session contract so users can register, sign in, reload deep links, inspect their identity, and sign out without handling tenant access tokens.

## What Changes

- **BREAKING**: Replace the tenant bearer-credential prompt and in-memory credential session with cookie-based user-session discovery through `GET /api/v1/auth/me`.
- Add localized sign-in and Organization-registration forms to the first screen; registration remains visible unconditionally and submits directly to the documented backend operation without capability probes, frontend fallbacks, or duplicated registration policy.
- Send browser credentials on API requests, establish authenticated context from login/register/current-user responses, and treat protected `401` responses as session expiry while preserving correlated error handling.
- Restore authenticated deep links after reload and keep anonymous, compatibility, session-check, and session-error states distinct.
- Replace the profile's development-session presentation with the authenticated email, Organization, membership role, language selection, and authoritative backend logout.
- Remove the ordinary-user onboarding entry that depends on the system administrator bearer credential; keep system administration outside the user login flow.
- Synchronize the pinned backend OpenAPI contract and generated TypeScript declarations, including auth operations, cookie security, roles, and database migration 16.

## Capabilities

### New Capabilities

- `user-authentication`: Localized registration, sign-in, current-session restoration, authenticated identity presentation, session-expiry handling, and logout for browser users.

### Modified Capabilities

- `api-client-foundation`: Replace ephemeral tenant bearer credentials with credentialed cookie transport, auth-context bootstrap, and session-aware unauthorized handling against the current generated contract.
- `tenant-navigation`: Gate tenant routes on resolved user-session state, restore direct links after authentication or reload, and make navigation respect the authenticated membership role.

## Impact

- Affects the root application shell, first screen, profile, navigation, API client/context, query cache lifecycle, runtime configuration assumptions, localization catalog, and authentication tests/fixtures.
- Replaces the frontend's pinned OpenAPI input and generated declarations with the backend migration-16 contract.
- Removes tenant credential constants and ordinary-user reliance on the system-admin development credential; application ingestion credentials remain unchanged.
- Requires credentialed CORS for separately hosted UI/API deployments and same-origin or explicitly trusted origins for session-authenticated mutations, as already required by the backend contract.
