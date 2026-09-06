## ADDED Requirements

### Requirement: Project webhook destinations are manageable

The Web UI SHALL list, create, view, and update project webhook destinations using the generated OpenAPI contract and SHALL provide an explicit empty state.

#### Scenario: Project has no destinations

- **WHEN** the destination list response is empty
- **THEN** the Notifications route explains that no webhook destination is configured and offers creation

#### Scenario: Operator creates or edits a destination

- **WHEN** the operator submits fields supported by the corresponding OpenAPI request schema
- **THEN** the UI sends the generated request shape, prevents duplicate submission, and refreshes affected server-authoritative queries after success

### Requirement: One-time signing secrets remain ephemeral

The Web UI MUST display signing secrets only from successful create or rotate responses, MUST warn that they cannot be retrieved again, and MUST clear them from component state when the one-time dialog closes. It MUST NOT place secrets in browser persistence, URLs, logs, or ordinary destination detail views.

#### Scenario: Creation returns a secret

- **WHEN** a destination creation response includes its one-time secret
- **THEN** an accessible dialog displays the secret with a copy action and irretrievability warning

#### Scenario: Secret dialog closes

- **WHEN** the operator dismisses the create or rotate secret dialog
- **THEN** the secret is removed from mounted UI state and no recoverable masked placeholder is displayed

### Requirement: Sensitive destination actions require confirmation

The Web UI MUST explain and confirm destination disable and secret rotation, SHALL disable repeated submission while pending, and SHALL invalidate destination list/detail, delivery history, and notification-health queries after success.

#### Scenario: Operator disables a destination

- **WHEN** the operator confirms disable
- **THEN** the destination is disabled once, affected queries are invalidated, and failures use the shared request-ID error UI

#### Scenario: Operator rotates a secret

- **WHEN** the operator confirms rotation
- **THEN** the previous secret is described as invalidated and the returned replacement is handled as a one-time secret

### Requirement: Test delivery gives accessible feedback

The Web UI SHALL let the operator request a test delivery and MUST announce success or failure through an `aria-live` region without exposing raw exception data.

#### Scenario: Test delivery completes

- **WHEN** the test operation succeeds or fails
- **THEN** the destination page announces a safe result and offers correlated diagnostics for an API failure

### Requirement: Delivery history is server-paginated and safe

The Web UI SHALL show a project delivery list using only documented fields and filters, SHALL persist the opaque cursor in URL search state, and MUST NOT substitute client-side filtering for undocumented server filters.

#### Scenario: More deliveries exist

- **WHEN** the current response has a non-null `next_cursor`
- **THEN** activating Next navigates to the same route with that cursor and loads the corresponding server page

#### Scenario: Delivery list is rendered

- **WHEN** deliveries are returned
- **THEN** a responsive table presents ID, event, destination, status, source, attempts, timestamps, available timing, and available terminal/error information with proper headers

### Requirement: Delivery details expose bounded diagnostics

The Web UI SHALL show documented delivery status, destination identifier, origin/source/event metadata, timing, terminal timestamp, and attempt timeline. It MUST NOT show signing secrets, signatures, bearer credentials, unrestricted response bodies, or stack traces.

#### Scenario: Operator opens a delivery

- **WHEN** the delivery detail response is available
- **THEN** the UI renders safe summary and attempt fields including HTTP status or error class, duration, and outcome while omitting `response_excerpt`

### Requirement: Notification operations are accessible

Notification screens and dialogs SHALL support keyboard navigation, visible focus, labelled controls, non-color-only statuses, correct table headings, live mutation results, and responsive narrow layouts.

#### Scenario: Operator uses a keyboard or mobile viewport

- **WHEN** the operator navigates lists, forms, confirmations, one-time dialogs, and details without a pointing device or at a narrow width
- **THEN** all required information and actions remain perceivable and operable
