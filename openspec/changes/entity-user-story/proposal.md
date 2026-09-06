## Why

Okoscope operators can inspect existing tenant data, but they cannot provision the Organization → Project → Application hierarchy or obtain and rotate the credentials required to connect an agent. The backend now publishes the required admin provisioning contract, so the Web UI can provide a secure end-to-end setup experience without duplicating backend behavior.

## What Changes

- Add an authenticated onboarding wizard that creates an Organization, Project, and Application in sequence and retains only returned entity identifiers between steps.
- Generate editable slugs from names and validate all names and slugs before mutation while preserving backend field and conflict errors.
- Present the initial Application token once, with copy actions for the token, a Kubernetes Secret manifest, and an agent workload selector fragment.
- Add admin hierarchy discovery so an operator can resume from existing Organizations, Projects, and Applications instead of recreating completed entities.
- Add an Application-level Agent credentials section for listing, issuing, and revoking credentials, including last-active-credential warnings and one-time token handling.
- Extend the shared API client for typed admin mutations, empty `204` responses, DELETE requests, safe field-level errors, mutation retry policy, and idempotency keys.
- Keep admin credentials and Application tokens out of URLs, query caches, browser storage, logs, analytics, and persistent error state.
- Add localized, accessible loading, disabled, retry, confirmation, copy-feedback, and failure states with unit, component, API-mock, and route coverage.

## Capabilities

### New Capabilities

- `entity-onboarding`: Admin discovery and guided Organization, Project, Application, and agent-connection setup.
- `application-credential-management`: Secret-safe listing, one-time issuance, copying, and revocation of Application credentials.

### Modified Capabilities

- `api-client-foundation`: Extend typed protected transport behavior for admin provisioning, DELETE/204 responses, field errors, idempotent mutations, and non-retryable client conflicts.
- `tenant-navigation`: Add onboarding entry/resume behavior and expose credential management from the Application context.

## Impact

- Affects root authentication flow, TanStack Router routes, tenant/Application pages, shared API types and client methods, TanStack Query keys and mutations, localization catalogs, shared form/modal/error UI, and frontend tests.
- Consumes the new `adminAuth` Organization, Project, Application, and credential operations from `openapi/okoscope-v1.yaml` and its generated declarations.
- Requires no new runtime dependency or server-side frontend component; admin credentials remain ephemeral because this deployment is a static SPA.
- Treats one-time token responses as component-local secret material and never places them in TanStack Query caches or persistent browser state.
