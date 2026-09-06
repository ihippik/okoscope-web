## Context

Okoscope Web is a static React 19/Vite SPA using file-based TanStack Router, TanStack Query, a generated OpenAPI declaration, an in-memory bearer session, and small shared UI primitives. It currently assumes an existing tenant hierarchy and has no server-side runtime in which an admin credential could be hidden. The backend contract now distinguishes `adminAuth`, provides admin hierarchy discovery, entity creation, one-time Application credential issuance, and idempotent credential revocation.

The security-sensitive part of this change is not token encryption in the browser; it is minimizing plaintext lifetime and ensuring secret-bearing mutation results never enter reusable caches, navigation state, diagnostics, or persistence.

## Goals / Non-Goals

**Goals:**

- Provide a resumable Organization → Project → Application → Connect agent setup journey.
- Reuse existing routing, API client, TanStack Query, localization, and UI patterns.
- Keep admin and Application credentials ephemeral and make one-time semantics explicit.
- Support safe credential listing, issuance, and revocation from Application context.
- Preserve backend validation and error semantics without duplicating business rules.
- Make empty responses, field errors, and mutation retry behavior explicit in shared transport code.

**Non-Goals:**

- Adding a BFF, server session, or persistent browser credential store.
- Recovering a previously issued plaintext Application token.
- Implementing backend fallbacks, client-side uniqueness checks, or additional enrichment calls absent from the contract.
- Managing Organizations, Projects, or Applications beyond the create/select workflow.
- Deploying the Kubernetes manifest or modifying an agent installation automatically.

## Decisions

### Use a dedicated admin onboarding route with discovery-driven state

The wizard will begin from `GET /api/v1/admin/organizations`, then load Projects and Applications only for the selected parent. Its state machine is:

```text
discover organizations
  ├─ none ───────────────▶ create organization
  └─ select existing ────▶ discover projects
                              ├─ none ─────────▶ create project
                              └─ select ───────▶ discover applications
                                                   ├─ none ─▶ create application
                                                   │           └─▶ connect agent (secret present)
                                                   └─ select ─▶ application (no secret)
```

Returned IDs, not slugs or names, scope later API calls. Non-secret progress may remain in mounted route state, but creation inputs and token responses will not enter URL search parameters. A dedicated route is preferable to overloading the current tenant root because admin discovery and tenant observability have distinct API surfaces and empty-state semantics.

### Keep one-time responses outside TanStack Query caches

Creation and issuance use `useMutation`; their callbacks immediately copy the typed response into narrowly scoped component state. Query invalidation stores only secret-free entity or credential metadata. Closing or unmounting the one-time view sets that state to `null`, and mutation reset removes any residual `data` reference.

Alternatives considered:

- Query-cache storage was rejected because it extends secret lifetime and permits later retrieval.
- Router state, URL state, sessionStorage, and localStorage were rejected because they survive component transitions or expose token material.
- Automatic clipboard writes were rejected because they are surprising and may fail without a user gesture.

### Separate admin hierarchy data from tenant observability models

The generated `ProvisionedProject` and `ProvisionedApplication` shapes intentionally differ from existing tenant summary shapes. Admin onboarding and credential management will use the admin-safe operations rather than enrich them through tenant endpoints. Existing observability navigation remains unchanged where its credential authorizes those APIs.

This avoids frontend fallback/enrichment behavior and respects the backend boundary. Application credential management can be rendered as an admin-scoped section or route that resolves metadata through `getAdminApplication`; it must not require the tenant Application summary query to succeed.

### Extend the shared client with explicit response modes

`ApiClient` will add DELETE and handle `204`/empty successful responses before JSON parsing. JSON success responses remain validated at the current coarse transport boundary and typed from generated schemas. Normalized errors will retain only documented envelope properties, including an optional string-to-string `fields` map.

Mutation retry will be configured per mutation or through a dedicated helper so provisioning POST/DELETE operations do not inherit read-query retry behavior. A UUID `Idempotency-Key` is generated for each intentional create/issue submission and remains stable only for that in-flight attempt. The UI will not attempt a secret-bearing replay after an ambiguous network result; it will refresh secret-free admin metadata and explain that a new credential may need to be issued.

### Centralize reusable entity-field behavior without a new form dependency

A small shared form component/hook will own name/slug values, dirty-slug state, client validation, field association, and pending controls. Slug derivation performs lowercase ASCII transliteration where deterministic, converts unsupported runs to hyphens, collapses hyphens, trims boundaries, and never overwrites a manually edited slug.

Backend field messages remain authoritative after submission. Local validation mirrors the published syntactic constraints only; uniqueness stays on the backend.

### Generate Kubernetes examples as transient pure strings

Pure formatting functions receive Application slug, plaintext token, and workload namespace and return exact YAML strings. They do not store values or log failures. Rendering and copy controls exist only while the token-bearing view is mounted. Tests will assert correct escaping/validation assumptions and absence of persistence calls.

### Derive credential status in presentation code

Status precedence is `revoked_at` → Revoked, otherwise `last_used_at == null` → Never used, otherwise Active. The last-active warning counts credentials with no `revoked_at`. Revocation is still allowed when the count is one; only confirmation copy changes.

## Risks / Trade-offs

- **[Static SPA exposes the admin bearer credential to the browser process]** → Keep it only in memory, explain the limitation, require HTTPS/same-origin deployment, and never embed it in compiled or runtime public configuration.
- **[React mutation objects can retain token responses]** → Transfer token into local modal state, call mutation reset after transfer/close, avoid query caching, and test unmount and close behavior.
- **[Ambiguous network completion can create an entity while hiding its one-time token]** → Use idempotency keys, refresh secret-free hierarchy metadata, never blindly replay a one-time response, and direct the operator to issue a replacement credential.
- **[Admin and tenant credentials may authorize different API surfaces]** → Keep admin provisioning queries isolated from tenant observability queries and do not add fallback requests.
- **[Clipboard access may be unavailable]** → Preserve visible selectable content while presenting accessible copy success/failure feedback.
- **[Existing generic Modal lacks full focus management]** → Improve or wrap it consistently for focus placement, keyboard dismissal policy, and restoration, with secret modals requiring deliberate close behavior.

## Migration Plan

1. Commit the updated OpenAPI snapshot and regenerated declarations with the frontend change.
2. Extend transport and error normalization with regression tests before adding UI consumers.
3. Add admin query/mutation adapters and onboarding route behind the existing compatibility and credential gates.
4. Add Application credential management and one-time token views.
5. Add localization, accessibility, security persistence, component, route, and API-mock coverage.
6. Run formatting, lint, typecheck, API contract checks, unit/component tests, build, and focused Playwright coverage.

Rollback removes the new routes and UI while leaving additive client support harmless. Backend operations and existing observability routes remain compatible.

## Open Questions

- Product copy should clarify whether the single in-memory bearer prompt is explicitly labelled “admin credential” for the whole UI or whether admin provisioning receives a distinct session entry point.
- The backend contract states that idempotency replays for secret-bearing operations never return plaintext, but does not expose a distinct replay success schema. The frontend will treat an ambiguous response as secret unavailable and rely on metadata refresh plus replacement issuance unless the contract is extended.
