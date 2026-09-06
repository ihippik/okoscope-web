## Why

Okoscope's backend now exposes experimental file-system activity through `file.activity.syscall-path/v1`, but the frontend cannot discover or safely inspect it. Operators need the same inventory, occurrence, group, and release-comparison workflow already available for process and network activity without overstating what syscall-reported paths mean.

## What Changes

- Add `file_activity` to Runtime Inventory navigation, filters, search presentation, summaries, and evidence navigation.
- Present create, modify, delete, and rename identities, including nullable rename replacement evidence and deliberately non-canonical path semantics.
- Render supported file occurrence payloads and unknown event kinds safely without assuming filesystem metadata absent from the contract.
- Present backend-classified file activity in release diff without recreating identity or fingerprint logic in the browser.
- Synchronize generated API types and add safety, behavior, navigation, and telemetry-regression tests.
- Explain that modify activity is aggregated into fixed five-second windows and does not represent every write or instantaneous visibility.

## Capabilities

### New Capabilities

- `file-activity-presentation`: Safe, contract-driven presentation of syscall-path file activity across inventory, groups, occurrences, and release diff.

### Modified Capabilities

- `runtime-inventory-exploration`: Runtime inventory accepts and searches the new file activity kind.
- `runtime-group-exploration`: Runtime groups present file activity summaries without assuming unavailable filesystem metadata.
- `runtime-occurrence-exploration`: Occurrence history safely presents file create, modify, delete, and rename payloads and unknown variants.
- `release-runtime-comparison`: Release comparison presents backend-classified file activity in new, unchanged, and disappeared states.
- `api-client-foundation`: The generated client contract includes the experimental file activity schema variants.

## Impact

The local OpenAPI document and generated TypeScript declarations change alongside runtime inventory and observability presentation components, URL parsing, fixtures, and unit/E2E coverage. Existing endpoints, tenant/project/application scope, pagination, query forwarding, and navigation remain unchanged; older backends that return no file activity continue to render zero/empty states.
