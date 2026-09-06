## ADDED Requirements

### Requirement: Anonymous users receive a localized authentication entry point

After backend compatibility succeeds and current-session lookup establishes that no valid session exists, the Web UI SHALL present a responsive, keyboard-operable first screen with product context, language selection, sign-in, and Organization-registration modes. Registration MUST remain available without a capability probe or frontend inference about backend registration configuration.

#### Scenario: Anonymous user reaches the application

- **WHEN** `GET /api/v1/auth/me` returns HTTP 401 after a compatible startup check
- **THEN** the UI displays sign-in by default and an operable control for switching to registration without changing or discarding the requested URL

#### Scenario: Language is changed before authentication

- **WHEN** an anonymous user changes the interface language on either authentication mode
- **THEN** all authentication labels, guidance, validation, actions, and safe errors update immediately without a page reload

#### Scenario: Registration is configured off on the backend

- **WHEN** the visible registration form is submitted and the backend returns `registration_disabled`
- **THEN** the UI displays the safe correlated server error and MUST NOT hide registration, issue a capability request, attempt login, or provide a client-side fallback

### Requirement: Users can register an Organization owner account

The Web UI SHALL submit email, password, Organization name, and Organization slug through the generated `registerUser` operation and SHALL use a successful returned authentication context as the active session. It MUST NOT persist password or session material or place it in URLs, logs, query keys, diagnostics, or generic error output.

#### Scenario: Registration succeeds

- **WHEN** a user submits contract-valid unique registration fields and the backend returns the created user, Organization, owner role, and session cookie
- **THEN** the UI clears the password input, establishes the returned authenticated context, clears identity-sensitive cached data, and reveals the originally requested tenant route

#### Scenario: Registration input is invalid

- **WHEN** required input violates documented email, password, Organization-name, or slug constraints
- **THEN** the form identifies actionable fields accessibly and submits no request until client-detectable structural errors are corrected

#### Scenario: Registration conflicts or fails

- **WHEN** registration returns a documented API, network, or invalid-response failure
- **THEN** the form preserves non-secret user input, clears or avoids retaining password state as appropriate, and presents only the safe message, code, and request ID without inferring which identity already exists

### Requirement: Users can sign in with email and password

The Web UI SHALL authenticate through the generated `loginUser` operation and SHALL establish session context only from a successful response. It MUST treat the uniform invalid-credentials response as a form failure without disclosing whether an email, password, user state, or membership caused rejection.

#### Scenario: Sign-in succeeds

- **WHEN** a user submits valid credentials and the backend returns authentication context with a session cookie
- **THEN** the UI clears the password, publishes the returned context, clears identity-sensitive cached data, and reveals the originally requested route

#### Scenario: Credentials are rejected

- **WHEN** login returns HTTP 401 `invalid_credentials`
- **THEN** the UI remains on sign-in and displays one localized uniform credentials error with correlated request ID and no global session-expired transition

#### Scenario: Duplicate sign-in submission is attempted

- **WHEN** a login or registration request is in flight
- **THEN** its form prevents duplicate submission and exposes a comprehensible busy state

### Requirement: Existing browser sessions are restored authoritatively

After compatibility succeeds, the Web UI MUST resolve `GET /api/v1/auth/me` before rendering anonymous or protected tenant content. It SHALL distinguish an absent session from a retryable session-check failure and MUST NOT persist authentication context as a substitute for current-user lookup.

#### Scenario: Reload carries a valid cookie

- **WHEN** current-user lookup returns authenticated user, Organization, and role for the browser's valid session
- **THEN** the UI renders the requested protected route using that context without asking the user to sign in again

#### Scenario: No valid cookie exists

- **WHEN** current-user lookup returns HTTP 401
- **THEN** the UI resolves to anonymous state without presenting that expected response as a startup error

#### Scenario: Session lookup cannot be completed

- **WHEN** current-user lookup fails because of a network, server, or invalid-response error
- **THEN** the UI displays a correlated retryable session-check error and renders neither anonymous forms nor protected tenant data until resolution

### Requirement: Session expiry isolates protected data

The Web UI SHALL transition to anonymous state when an authenticated protected request returns HTTP 401, remove all protected query data before another identity can authenticate, and explain that the session ended. Authentication-operation failures MUST NOT incorrectly trigger this global transition.

#### Scenario: Protected request detects an expired session

- **WHEN** a protected tenant request returns HTTP 401 after authenticated content was available
- **THEN** the UI removes protected cache data, returns to sign-in at the current URL, and presents a localized session-expired notice without exposing stale tenant content

#### Scenario: A different user signs in afterward

- **WHEN** authentication succeeds after logout or expiry
- **THEN** no protected response cached for the prior identity is rendered to the new identity

### Requirement: Users can inspect and terminate their session

The authenticated profile SHALL display the current normalized email, Organization name and slug, membership role, and language control from authentication context. Logout MUST invoke the generated backend operation and SHALL claim completion only when the server authoritatively expires or confirms absence of the session.

#### Scenario: User opens profile

- **WHEN** authenticated context is available
- **THEN** profile displays safe identity, Organization, and localized role information without displaying cookie, session identifier, password, or bearer material

#### Scenario: Logout succeeds

- **WHEN** the user activates logout and the backend completes the operation
- **THEN** the UI removes protected cached data and authentication context and presents the anonymous sign-in surface at the current URL

#### Scenario: Logout fails transiently

- **WHEN** logout returns a network, server, or invalid-response failure that does not establish session absence
- **THEN** the UI retains authenticated context, prevents false success, and provides a correlated retry path
