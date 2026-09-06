## 1. Contract and client foundation

- [x] 1.1 Add generated-schema aliases for destination requests/responses and delivery queries/details without duplicating transport types
- [x] 1.2 Extend the shared API client with JSON request bodies and PATCH while preserving normalized safe errors and request IDs
- [x] 1.3 Add project-scoped destination and delivery query keys/options plus mutation invalidation helpers

## 2. Destination operations

- [x] 2.1 Build accessible destination list, empty state, and create form
- [x] 2.2 Build destination detail and edit form using only OpenAPI-supported fields
- [x] 2.3 Implement one-time create/rotate secret dialog, copy feedback, and close-time state clearing
- [x] 2.4 Implement test delivery feedback and confirmed disable/rotate actions with duplicate-submit protection

## 3. Delivery operations

- [x] 3.1 Build cursor-paginated delivery history with cursor URL search state and no client-side filters
- [x] 3.2 Build safe delivery detail and attempt timeline that omit response excerpts and other sensitive fields

## 4. Routing and navigation

- [x] 4.1 Add notification index, destination detail, and delivery detail file routes with project-scoped breadcrumbs and document titles
- [x] 4.2 Add visible Notifications navigation from the Project page and notification screens
- [x] 4.3 Regenerate the TanStack route tree and verify deep-link typing

## 5. Verification and documentation

- [x] 5.1 Add unit/component coverage for create, secret clearing, test outcomes, confirmations, request-ID errors, and cursor pagination
- [x] 5.2 Add Playwright notification journey and axe coverage for screens and dialogs
- [x] 5.3 Document notification routes, cursor polling/security rules, supported contract fields, and explicit contract blockers
- [x] 5.4 Run formatting, lint, typecheck, API generation check, unit tests, Playwright, production build, and container compatibility checks

## 6. Notification health contract

- [x] 6.1 Add all health-state presentations, stale behavior, and adaptive visibility-aware polling after OpenAPI publishes the notification-health operation and response schema
