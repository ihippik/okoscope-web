## ADDED Requirements

### Requirement: File activity semantics are explicit and safe

The UI SHALL label paths as process-reported or syscall paths, SHALL explain that they may contain symlinks and are not canonical filesystem paths, and SHALL render path values as text with safe full-value tooltip and copy affordances.

#### Scenario: Long untrusted path

- **WHEN** a file path is long or contains HTML-special characters
- **THEN** it is visually truncated without HTML interpretation and its full plain-text value remains available by tooltip and copy

### Requirement: Supported file operations are presented

The UI SHALL present create, modify, delete, and rename operations with process command, applicable ordered paths, occurrence timing/counts, and rename replacement evidence.

#### Scenario: Rename replacement evidence is absent

- **WHEN** a rename semantic summary omits or nulls replacement evidence
- **THEN** the UI presents replacement state as unknown

### Requirement: Collection limitations are disclosed

The UI SHALL state that modify events are aggregated in fixed five-second windows and do not represent every individual write or instantaneous visibility.

#### Scenario: User views file activity

- **WHEN** file activity explanatory copy is shown
- **THEN** five-second aggregation and observation limitations are visible

### Requirement: Path values do not enter client telemetry

The UI MUST NOT include file path values in analytics, telemetry, or client-side error messages.

#### Scenario: Path copy fails

- **WHEN** copying a path fails
- **THEN** the user-facing and reportable error is generic and excludes the path
