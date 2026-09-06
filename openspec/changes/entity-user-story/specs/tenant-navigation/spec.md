## ADDED Requirements

### Requirement: Provisioning hierarchy has resumable navigation

The Web UI SHALL expose an accessible onboarding route and admin hierarchy selection that can reconstruct the next setup step from typed admin discovery responses without placing entity creation payloads or tokens in URL state.

#### Scenario: Operator enters onboarding

- **WHEN** the authenticated operator opens the onboarding route
- **THEN** the UI discovers available Organizations and lets the operator resume or begin provisioning

#### Scenario: Operator selects existing hierarchy

- **WHEN** the operator selects an existing Organization, Project, or Application
- **THEN** the UI loads only the next scoped admin collection and retains identifiers in memory or route path parameters without retaining secrets

#### Scenario: Browser history is traversed

- **WHEN** the operator leaves a one-time token view or traverses browser history
- **THEN** plaintext token material is not reconstructed or re-rendered

### Requirement: Application navigation exposes Agent credentials

The Application context SHALL provide a visible, keyboard-operable Agent credentials section for an Application resolved through an admin-safe Application operation.

#### Scenario: Admin opens an Application

- **WHEN** the operator follows an existing or newly created Application link
- **THEN** the page preserves Project and Application identity and loads credential metadata without requiring prior onboarding navigation

#### Scenario: Credential data cannot be loaded

- **WHEN** the credential operation returns a safe normalized failure
- **THEN** the Application remains navigable and the Agent credentials section provides a scoped retry state
