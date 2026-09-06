## 1. Contract and Compatibility

- [x] 1.1 Synchronize the backend OpenAPI snapshot containing `listApplicationWorkers`, regenerate the committed TypeScript schema, and confirm the generated worker and pagination types contain no local substitutes.
- [x] 1.2 Add compile-time contract fixtures covering heterogeneous kernel releases, architectures, nullable legacy platform metadata, timestamps, and an opaque next cursor.
- [x] 1.3 Raise the required backend database migration from 7 to 12 and update compatibility unit tests for accepted, outdated, and missing migration values.

## 2. Worker Data Access

- [x] 2.1 Add exported Application worker types and an infinite-query option keyed by Project and Application identity with a bounded page limit and opaque cursor forwarding.
- [x] 2.2 Add query tests proving cache-scope separation, generated response use, first-page requests, next-cursor forwarding, and credentials excluded from query identity.

## 3. Worker Platform Presentation

- [x] 3.1 Build a responsive worker-platform component that renders Cluster, node, kernel release, architecture, Application observation recency, agent version, and agent last-seen detail as inert text.
- [x] 3.2 Represent null platform metadata explicitly, preserve heterogeneous worker rows and server ordering, and add a localized empty state.
- [x] 3.3 Add isolated initial loading, correlated retryable error, non-destructive background-refresh failure, and incremental load-more states.
- [x] 3.4 Integrate the worker section into the Application overview without making the Project or Application detail state depend on the worker query.

## 4. Localization and Accessibility

- [x] 4.1 Add guarded English and Russian catalog entries for all worker headings, field labels, loading, empty, unavailable, retry, refresh, and pagination text.
- [x] 4.2 Verify semantic table/card labeling, keyboard operation, focus visibility, long-value wrapping, narrow-screen layout, and absence of online or compatibility claims.

## 5. Verification and Handoff

- [x] 5.1 Add component and route tests for heterogeneous kernels, nullable metadata, empty results, initial and refresh failures, retry, pagination append behavior, and locale switching.
- [x] 5.2 Add or update browser fixtures and Playwright coverage for desktop and narrow-screen Application overview states.
- [x] 5.3 Run formatting, linting, TypeScript, generated-contract, unit, browser, and production-build checks and update the verification matrix with the resulting coverage.
