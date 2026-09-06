## ADDED Requirements

### Requirement: One immutable build supports multiple environments

The production Web UI SHALL be built once as hashed static assets and SHALL receive environment-specific API configuration when its container starts rather than during compilation.

#### Scenario: Image is promoted between environments

- **WHEN** the same image digest starts with a different API base URL
- **THEN** only the runtime configuration changes and the compiled asset bytes remain identical

### Requirement: Production container is safe for static delivery

The production image SHALL run as a non-root user, serve the SPA without development dependencies, expose a health endpoint, and support a read-only root filesystem with explicitly writable temporary locations only when required.

#### Scenario: Container starts with valid configuration

- **WHEN** the image starts with a valid API base URL
- **THEN** its health endpoint succeeds and browser routes serve the application shell

#### Scenario: Container starts with invalid configuration

- **WHEN** required runtime configuration is invalid
- **THEN** startup or application readiness fails visibly instead of serving a misleading operational UI

### Requirement: Static caching preserves deploy correctness

The production server SHALL permit long-lived immutable caching for content-hashed assets and MUST prevent stale caching of the application shell and runtime configuration.

#### Scenario: A new image is deployed

- **WHEN** a browser revisits the service after deployment
- **THEN** it obtains current bootstrap files while reusing only immutable assets whose content hashes are unchanged

### Requirement: Client-side routes survive direct requests

The production server SHALL return the application shell for valid frontend route paths while preserving dedicated static-file and health responses.

#### Scenario: Application deep link is requested

- **WHEN** a browser directly requests a Project or Application route
- **THEN** the server returns the SPA shell and the client router resolves the route

### Requirement: Critical production behavior is verified

Repository checks SHALL cover unit behavior, routed user journeys, API failure states, production compilation, and a smoke test of the built container or equivalent production server configuration.

#### Scenario: Milestone checks run

- **WHEN** continuous integration validates the Web UI
- **THEN** Vitest, Playwright, type checking, linting, OpenAPI generation checks, and production build verification complete successfully
