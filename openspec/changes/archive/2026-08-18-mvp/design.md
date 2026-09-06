## Context

This repository currently contains no frontend implementation. The separately deployed Okoscope backend publishes an OpenAPI 3.1 contract at `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml`; its first UI-facing operations provide public build metadata and authenticated Organization, Project, and Application reads. Responses are cache-disabled and correlated through `X-Request-Id`, while protected operations use bearer credentials.

The milestone must produce both a maintainable frontend foundation and a deployable production artifact. Environment-specific API endpoints cannot be compiled into the bundle because one immutable image must be promotable across environments.

## Goals / Non-Goals

**Goals:**

- Establish the requested React, TypeScript, Vite, TanStack, Tailwind, shadcn/ui, Vitest, and Playwright stack.
- Make API configuration and compatibility failures explicit before protected data loads.
- Provide resilient, accessible Organization → Projects → Applications navigation.
- Centralize API typing, authentication headers, request correlation, error normalization, and retry policy.
- Produce and verify a secure production container image.

**Non-Goals:**

- Creating or mutating Organizations, Projects, or Applications.
- Runtime-group, release, runtime-diff, webhook, and delivery-history UI.
- SSO, OAuth, refresh tokens, backend-for-frontend sessions, or durable credential storage.
- Changing or publishing the backend OpenAPI contract from this repository.
- Server-side rendering or offline/PWA support.

## Decisions

### Use a layered feature-oriented frontend

The application is divided into bootstrap/configuration, shared API infrastructure, route definitions, reusable UI primitives, and tenant-navigation features. Route loaders coordinate query prefetching, while TanStack Query remains the source of server state; React components do not create ad hoc fetch clients.

This keeps cross-cutting concerns centralized without imposing a larger framework. A single component-oriented folder or route-local fetch calls were rejected because they make credential clearing, error correlation, and cache invalidation inconsistent.

### Generate contract types and keep a small explicit HTTP adapter

TypeScript types are generated from the pinned OpenAPI document. A small fetch-based adapter owns base URL resolution, bearer and `X-Request-Id` headers, JSON decoding, response-header capture, and normalized errors. Query option factories use stable keys derived from resource scope and pagination inputs.

Generating a full framework-specific client is not required for the milestone: it increases generator coupling while the needed endpoint surface is small. Hand-written domain DTOs were rejected because they can drift from the backend contract. Generated output is committed and checked for freshness so builds do not depend on the backend repository being present.

### Gate protected queries through an explicit startup state machine

Startup progresses through runtime-config loading, build-info checking, credential acquisition, and authenticated application readiness:

```text
config loading → config error
       ↓
build-info loading → unreachable / incompatible
       ↓
credential required
       ↓
authenticated shell → credential rejected → credential required
```

Only `api_version === "v1"` is a compatibility pass for this frontend milestone. Service version, commit, and required migration are displayed as diagnostics; the UI cannot infer applied database migration state from the contract.

A warning-only compatibility check was rejected because continuing against an unknown API can misrender or misinterpret operational data.

### Keep the MVP credential in memory

The credential is entered by the operator and stored only in a React-owned external session store for the active page lifetime. It is never written to localStorage, sessionStorage, URLs, query keys, diagnostics, or logs. A 401 clears the credential and protected query cache before returning to the credential prompt.

Persistent browser storage was rejected for the MVP because there is no refresh/revocation flow and XSS would expose a long-lived credential. A reverse-proxy or SSO session can replace this boundary later without changing route components.

### Model hierarchy in routes using UUIDs

Canonical routes use IDs accepted by the API:

```text
/
/projects
/projects/$projectId
/projects/$projectId/applications/$applicationId
```

Names and slugs remain presentation data. UUID routes allow reliable deep links without adding a slug-resolution API and preserve Project scope for Application requests. Breadcrumb queries are independently cacheable so direct navigation does not depend on previously loaded lists.

### Normalize errors at the HTTP boundary

The adapter exposes discriminated API, network, configuration, compatibility, and invalid-response failures. Each outbound request gets a safe client request ID. Correlation chooses the response header first, then the documented body field, then the client value. Retry is disabled for 400, 401, and 404; bounded retries are allowed for transport and server failures. Background failures preserve successful cached data.

### Inject runtime configuration into an immutable container

Vite emits hashed assets. A multi-stage container copies them into an unprivileged static server image. Container startup validates the configured API URL and writes a small generated bootstrap file into a dedicated writable location. The application shell and configuration use no-cache semantics; hashed assets are immutable. SPA fallback excludes static files and health endpoints.

Build-time `.env` values were rejected for production because they require a separate image per environment. Same-origin `/api` remains the preferred deployment topology; absolute origins are supported when backend CORS is configured.

### Test boundaries according to failure cost

Vitest covers configuration, compatibility, request IDs, error normalization, query keys, and UI states. Playwright intercepts API calls for compatibility, credential, pagination, direct-link, 401, 404, 5xx, and network scenarios. A production smoke test verifies runtime configuration, health, cache headers, and SPA fallback against the built artifact.

## Risks / Trade-offs

- [OpenAPI 3.1 generator behavior differs around `type: [T, "null"]` and composed schemas] → Pin the generator version and add compile-time fixtures for nullable and `allOf` models.
- [A manually entered credential is inconvenient and disappears on reload] → Treat this as an explicit security-biased MVP boundary and keep the session interface replaceable.
- [The external backend contract path is unavailable in CI or container builds] → Commit the input snapshot or generated output with provenance and provide an explicit refresh/check workflow.
- [Cross-origin deployments fail despite correct UI configuration] → Document required exact backend CORS origin and prefer same-origin reverse proxy deployment.
- [64-bit API integers can exceed JavaScript's safe integer range] → Treat displayed counters defensively and avoid arithmetic that assumes lossless values; revisit serialization if backend counts can exceed the safe range.
- [A stale bootstrap file can point a new UI at an old backend] → Disable caching for the shell and runtime configuration and fail closed on API-version mismatch.

## Migration Plan

1. Add the frontend scaffold and deterministic dependency/tooling configuration.
2. Pin the backend OpenAPI input and establish generation/freshness checks.
3. Implement bootstrap, API adapter, compatibility, and ephemeral credential boundaries.
4. Add tenant routes and query-backed views.
5. Add production container packaging and the full verification suite.
6. Publish an immutable image tagged with version and commit, configure its API base URL, and smoke-test it against a compatible backend.

Rollback consists of restoring the previous image digest. The milestone makes no backend or persistent-data changes.

## Open Questions

- Which registry and image naming convention will publish the production image?
- Should the repository vendor a snapshot of the backend OpenAPI document or receive it through a release artifact in CI?
- Which static server base image is preferred by the deployment environment, provided it supports non-root operation and runtime bootstrap generation?
