## ADDED Requirements

### Requirement: Application credential metadata is listed without secrets

The Application view SHALL provide an Agent credentials section backed by the typed admin credential-list operation and MUST render only name, token hint, creation time, last-used time, and derived status.

#### Scenario: Active credential has been used

- **WHEN** a credential has no `revoked_at` value and has a `last_used_at` value
- **THEN** the table labels it Active and displays the last-used timestamp

#### Scenario: Active credential has never been used

- **WHEN** a credential has neither `revoked_at` nor `last_used_at`
- **THEN** the table labels it Never used

#### Scenario: Credential is revoked

- **WHEN** a credential has a `revoked_at` value
- **THEN** the table labels it Revoked and does not offer a Revoke action

#### Scenario: Credential list is rendered

- **WHEN** credential metadata loads successfully
- **THEN** no row, accessible label, DOM attribute, URL, cache key, or diagnostic contains a full Application token

### Requirement: Admin can issue a named credential

The Agent credentials section SHALL allow issuing a credential with a required backend-compatible unique name and SHALL prevent automatic or concurrent duplicate submissions.

#### Scenario: Issue dialog is submitted

- **WHEN** the operator submits a locally valid credential name
- **THEN** exactly one typed issue mutation is sent for the current Project and Application while the form remains disabled until completion

#### Scenario: Credential name conflicts

- **WHEN** issuance returns HTTP 409
- **THEN** the dialog shows a name conflict error and does not automatically retry

#### Scenario: Issuance succeeds

- **WHEN** issuance returns a new one-time credential
- **THEN** the metadata list is refreshed and the plaintext token is placed only in a mounted one-time modal

### Requirement: Issued credential token is handled once

The Web UI SHALL warn that a newly issued token is shown once, SHALL provide a Copy token action, and MUST destroy the plaintext token when its modal closes or unmounts.

#### Scenario: One-time credential modal opens

- **WHEN** credential issuance succeeds with `shown_once` true
- **THEN** the modal displays the token and explicit save-now warning without copying automatically

#### Scenario: Token is copied

- **WHEN** the operator activates Copy token
- **THEN** the Clipboard API receives the exact token and accessible copy feedback is announced

#### Scenario: Modal closes

- **WHEN** the operator closes the modal or navigates away
- **THEN** plaintext is removed from component and mutation state and cannot be recovered from cache, URL, browser persistence, logs, analytics, or error reporting

### Requirement: Active credentials can be revoked

The Agent credentials section SHALL provide Revoke only for active credentials, SHALL require explicit confirmation, and SHALL refresh credential metadata after a successful idempotent revocation.

#### Scenario: Credential is not the last active credential

- **WHEN** the operator requests revocation while another active credential exists
- **THEN** the confirmation identifies the credential and explains that its token will stop authenticating

#### Scenario: Credential is the last active credential

- **WHEN** the operator requests revocation of the only active credential
- **THEN** the confirmation additionally warns that Application ingestion will stop

#### Scenario: Operator confirms revocation

- **WHEN** the DELETE operation returns HTTP 204, including repeated revocation
- **THEN** the dialog closes and the credential list refreshes to display the revoked state

#### Scenario: Revocation fails

- **WHEN** the DELETE operation fails
- **THEN** the confirmation remains recoverable and displays only safe correlated error information
