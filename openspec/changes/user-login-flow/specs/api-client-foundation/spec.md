## MODIFIED Requirements

### Requirement: Backend compatibility is checked before protected loading

The Web UI MUST request the unauthenticated build-info operation before loading session context or protected tenant data and SHALL proceed only when the reported API version is supported by the frontend build and the required database migration is 16 or newer.

#### Scenario: Backend API is compatible

- **WHEN** build info is reachable and reports API version `v1` and database migration 16 or newer
- **THEN** the application permits current-session lookup followed by anonymous authentication or protected tenant queries as appropriate

#### Scenario: Backend API is incompatible

- **WHEN** build info reports an unsupported API version
- **THEN** the application blocks authentication and tenant navigation and displays expected and actual API versions, service version, Git commit, and request ID when available

#### Scenario: Backend migration is incompatible

- **WHEN** build info reports database migration below 16 or omits a required migration value
- **THEN** the application blocks authentication and tenant navigation and displays the required and actual migration values with safe diagnostics

#### Scenario: Build-info cannot be loaded

- **WHEN** the build-info request fails because of transport, HTTP, or response-decoding failure
- **THEN** the application displays a retryable startup error with safe diagnostics

## ADDED Requirements

### Requirement: Browser user sessions use credentialed cookie transport

The Web UI SHALL send API requests with browser credentials enabled so the backend can establish and authenticate the opaque `HttpOnly` session cookie. It MUST NOT read, reproduce, persist, log, place in URLs, or add session material to query identity, and tenant requests MUST NOT attach the removed Organization bearer credential.

#### Scenario: Authentication establishes a session

- **WHEN** login or registration returns a valid `Set-Cookie` response under same-origin or configured credentialed CORS rules
- **THEN** the browser accepts the cookie and subsequent protected requests present it without application code reading the opaque value

#### Scenario: API is hosted at an absolute configured origin

- **WHEN** runtime configuration points to a permitted cross-origin backend
- **THEN** every auth and tenant request uses credentialed fetch while retaining the validated base URL, exact-origin CORS, correlation, and safe failure behavior

#### Scenario: System-admin operation is separate

- **WHEN** a route requires the documented `adminAuth` bearer scheme
- **THEN** an ordinary user session or owner role is not presented as equivalent system-administrator authority

## REMOVED Requirements

### Requirement: MVP bearer credentials remain ephemeral

**Reason**: Backend migration 16 removes Organization-wide tenant bearer authentication in favor of individual revocable browser user sessions.

**Migration**: Replace credential entry, in-memory token storage, `Authorization` attachment, and reload loss with generated registration/login/current-user/logout operations and browser-managed cookie transport. Application ingestion and system-administrator credentials remain confined to their separate documented trust domains.
