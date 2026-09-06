## Why

The current interface exposes internal observability vocabulary such as “Runtime Groups”, “Runtime Inventory”, and “Runtime Diff”, making users learn the eBPF data model before they can understand the product’s value. The product should instead answer the immediate questions “what processes does this application start?”, “where does it connect?”, and “what changed after a release?” using plain, task-oriented language.

## What Changes

- Reframe the Application experience around **Application Activity** with two primary areas: **Process launches** and **Network activity**.
- Present destinations and domains as understandable subsections of Network activity while continuing to use the existing single-kind inventory API requests.
- Move syscalls and raw occurrence payloads out of the primary journey and into clearly labelled technical details.
- Rename operator-facing Runtime Groups to **New discoveries** without implying that a discovery is a threat, incident, or severity finding.
- Rename Runtime Diff to **Changes after release** and translate its classifications into plain language while preserving their evidence-qualified meaning.
- Replace generic labels such as Direction, Occurrences, and Evidence with context-specific copy such as Incoming/Outgoing, Launches/Connections/Observations, and Observation history.
- Redesign the Application overview to explain Okoscope’s purpose and provide direct entry points into Processes, Network, New discoveries, and release changes.
- Preserve existing routes, generated API contracts, ownership checks, cursor behavior, accessibility, localization, and safe inert rendering.
- Treat combined Process/Network backend aggregation and full connection direction support as future API enhancements, not prerequisites for this change.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `tenant-navigation`: Replace implementation-oriented Application actions with a value-oriented overview and activity navigation.
- `runtime-inventory-exploration`: Present inventory as Application Activity organized into Processes, Network, and secondary technical details while retaining API-compatible typed views.
- `runtime-group-exploration`: Present runtime groups as New discoveries with neutral, user-oriented terminology.
- `release-runtime-comparison`: Present runtime differences as Changes after release with plain-language classifications and guidance.
- `runtime-occurrence-exploration`: Present occurrences as contextual observation history and keep raw payloads subordinate to user-facing evidence.

## Impact

- Affects Application, runtime inventory, runtime group, runtime occurrence, release comparison, navigation, localization, and end-to-end test UI surfaces.
- Reuses the current OpenAPI operations and response types; no backend migration or breaking API change is required.
- Existing deep links remain valid. Internal route names, query parameters, and generated schema identifiers may remain unchanged.
- Network activity initially requires separate `destination` and `domain` requests/views; the UI must not sum them as unique network actions or claim complete inbound/outbound coverage.
