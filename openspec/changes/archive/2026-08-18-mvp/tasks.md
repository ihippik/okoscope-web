## 1. Frontend foundation

- [x] 1.1 Scaffold the React and TypeScript Vite application with strict compiler settings and deterministic package scripts
- [x] 1.2 Install and configure TanStack Router, TanStack Query, Tailwind CSS, and the initial shadcn/ui primitives
- [x] 1.3 Configure linting, formatting, Vitest, Testing Library, and Playwright with shared test utilities
- [x] 1.4 Establish the feature-oriented source layout, application providers, global styles, accessible shell, and generated route tree workflow

## 2. OpenAPI contract integration

- [x] 2.1 Add a pinned frontend copy or reproducible import workflow for `okoscope-v1.yaml` with backend source provenance
- [x] 2.2 Configure OpenAPI 3.1 TypeScript generation and commit the generated contract types
- [x] 2.3 Add scripts and CI checks that regenerate types and fail when committed output is stale
- [x] 2.4 Add compile-time or unit fixtures covering nullable schemas, composed detail types, pages, errors, and build-info literals

## 3. Runtime bootstrap and compatibility

- [x] 3.1 Define the external runtime configuration bootstrap contract and validate same-origin and absolute HTTP/HTTPS API base URLs
- [x] 3.2 Implement blocking configuration loading and safe configuration-error UI without production localhost fallback
- [x] 3.3 Implement the shared fetch adapter with normalized URLs, JSON decoding, generated request IDs, response correlation, and discriminated failures
- [x] 3.4 Implement the public build-info query and startup compatibility state machine for supported API version `v1`
- [x] 3.5 Build retryable unavailable and blocking incompatible screens with service version, commit, migration, API-version, and request-ID diagnostics
- [x] 3.6 Add Vitest coverage for configuration validation, compatibility decisions, malformed responses, request-ID precedence, and retry classification

## 4. Ephemeral authentication and shared errors

- [x] 4.1 Implement an in-memory credential session interface that never writes credentials to persistence, URLs, logs, diagnostics, or query keys
- [x] 4.2 Build the accessible bearer credential prompt and gate protected queries until a credential is present
- [x] 4.3 Attach bearer credentials to protected operations and clear both credential and protected query cache on HTTP 401
- [x] 4.4 Implement reusable route, inline, and background-refresh error presentation with safe messages, retry actions, and copyable request IDs
- [x] 4.5 Add tests proving credential ephemerality, 401 reset behavior, secret redaction, and preservation of cached data after refetch failure

## 5. Organization and Project navigation

- [x] 5.1 Define stable query keys and typed query factories for current Organization, Project pages, and Project details
- [x] 5.2 Implement root and `/projects` routes with Organization context, breadcrumbs, document titles, and loading/error/empty states
- [x] 5.3 Implement Project cursor pagination that appends pages without duplicates and stops on a null cursor
- [x] 5.4 Implement `/projects/$projectId` with Project summary, archive state, counts, direct-link loading, and scoped 404 recovery
- [x] 5.5 Add component and route tests for Organization loading, empty Projects, pagination, archived Projects, deep links, and failures

## 6. Application navigation

- [x] 6.1 Define stable query keys and typed query factories for Project-scoped Application pages and details
- [x] 6.2 Add the Project Application collection with cursor pagination, counts, latest-observation formatting, and empty state
- [x] 6.3 Implement `/projects/$projectId/applications/$applicationId` with direct-link breadcrumb reconstruction and scoped 404 recovery
- [x] 6.4 Verify keyboard navigation, visible focus, semantic landmarks, labels, and meaningful titles across all milestone routes
- [x] 6.5 Add component and route tests for Application pagination, null observation times, direct links, scoping, and not-found states

## 7. End-to-end verification

- [x] 7.1 Build Playwright API fixtures for build info, authentication, Organization, paginated Projects, and paginated Applications
- [x] 7.2 Cover the compatible startup, credential entry, hierarchy navigation, pagination, and direct deep-link journeys
- [x] 7.3 Cover invalid configuration, unreachable and incompatible backend, malformed response, 401, 404, 5xx, and request-ID presentation journeys
- [x] 7.4 Add automated accessibility checks for the credential flow and primary navigation states

## 8. Production image and delivery

- [x] 8.1 Add a reproducible Vite production build with version and Git commit metadata that excludes credentials and environment-specific API URLs
- [x] 8.2 Add a multi-stage production container running an unprivileged static server without development dependencies
- [x] 8.3 Implement startup-time API configuration generation and validation compatible with a read-only root filesystem
- [x] 8.4 Configure SPA fallback, a dedicated health endpoint, no-cache bootstrap responses, and immutable caching for hashed assets
- [x] 8.5 Add container smoke tests for health, runtime configuration, cache headers, direct routes, invalid startup configuration, and absence of embedded secrets
- [x] 8.6 Document local development, contract refresh, credential behavior, same-origin and CORS deployment, image configuration, verification, and rollback

## 9. Milestone quality gate

- [x] 9.1 Run formatting, linting, type checking, OpenAPI freshness, Vitest, Playwright, and production build checks and resolve all failures
- [x] 9.2 Build and smoke-test the production image for the supported target architecture or architectures
- [x] 9.3 Verify every `api-client-foundation`, `tenant-navigation`, and `production-web-delivery` scenario has automated coverage or an explicit documented verification step
