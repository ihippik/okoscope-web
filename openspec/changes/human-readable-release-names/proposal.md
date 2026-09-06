## Why

Automatically observed Releases currently use a full `sha256:` identity as their visible version, which is precise for machines but difficult for operators to scan or discuss. Because an Okoscope Application represents the selected Kubernetes workload as a whole, each Release needs a stable human-readable name while retaining its immutable multi-container identity separately.

## What Changes

- **BREAKING**: Require every Release response to contain a backend-owned, non-empty `display_name`; the frontend will not synthesize a name or provide a legacy fallback.
- Generate observed Release names from workload-level release evidence using a deterministic human-readable convention, while preserving the immutable `identity_digest` as technical identity.
- Use `display_name` consistently wherever a Release is presented or selected, including Releases, Runtime Diff target/baseline context, baseline selectors, Runtime Inventory release filters/evidence, and occurrence attribution.
- Keep the complete application/init container image composition available in Release details so operators can inspect image references, tags, and digests themselves.
- Update the committed OpenAPI snapshot, generated TypeScript types, localization, fixtures, and automated tests for the strict naming contract.
- Do not add automatic per-container image diffing, editable aliases, a “primary container” heuristic, or change the existing immutable Release identity.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `release-runtime-comparison`: Require and consistently present backend-provided human-readable Release names while retaining immutable identity and full image composition as supporting technical evidence.

## Impact

- Requires a backend contract and persistence/projection change that supplies `Release.display_name` for both observed and manual Release responses.
- Affects the frontend OpenAPI snapshot and generated API types, Release cards, Runtime Diff labels and baseline options, Runtime Inventory Release options/evidence, occurrence Release attribution, localized presentation, and fixtures/tests.
- Builds on the completed `auto-release` implementation and should be archived/applied after that change to avoid overlapping delta-spec ordering.
- Does not remove the manual Release API; manual creation must also satisfy the new required display-name contract if retained.
