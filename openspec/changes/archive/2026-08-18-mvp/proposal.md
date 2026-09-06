## Why

Okoscope exposes a stable browser API, but it has no deployable Web UI for operators to verify a deployment and navigate from their Organization to Projects and Applications. The first frontend milestone establishes the reusable API, routing, error, testing, and production-delivery foundations on which the remaining observability workflows can be built.

## What Changes

- Scaffold a standalone React and TypeScript application with Vite, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui, Vitest, and Playwright.
- Load and validate API configuration at runtime so the same production artifact can be promoted between environments.
- Check the public build-info endpoint before protected application data is loaded and block incompatible API versions with diagnostic build information.
- Accept an operator-provided bearer credential for the MVP session without persisting it beyond the active page lifetime.
- Provide Organization → Projects → Applications list and detail navigation with URL-addressable routes and cursor pagination.
- Normalize API, transport, and invalid-response failures and surface correlated request IDs in actionable error states.
- Build a hardened, unprivileged production container image with SPA routing, runtime configuration, health checking, and appropriate cache policy.
- Add unit, component, end-to-end, and container smoke coverage for the milestone's critical states.

## Capabilities

### New Capabilities

- `api-client-foundation`: Runtime API configuration, bearer session handling, build-info compatibility gating, generated contract types, and correlated API error behavior.
- `tenant-navigation`: URL-addressable Organization, Project, and Application browsing with scoped detail views and cursor pagination.
- `production-web-delivery`: Reproducible production build and container image with runtime configuration, SPA fallback, health behavior, security posture, and caching rules.

### Modified Capabilities

None.

## Impact

- Introduces the initial application source, build configuration, tests, and container packaging in this repository.
- Consumes `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml` as the source contract for generated TypeScript API types.
- Adds frontend and test dependencies for React, Vite, TanStack Router/Query, Tailwind CSS, shadcn/ui, Vitest, and Playwright.
- Requires a deployment-provided API base URL and, for cross-origin deployments, a matching backend CORS origin configuration.
- Does not change the backend API, create tenant resources, or implement runtime groups, releases, diffs, webhooks, or delivery-history screens.
