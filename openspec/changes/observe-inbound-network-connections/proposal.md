## Why

Okoscope's frontend can explain outbound runtime behavior, but it cannot yet show TCP ports that an application actually listens on or connections that it actually accepts. The backend now exposes typed inbound events and application inventory evidence, so the UI needs contract-driven presentation that preserves local endpoint identity while keeping remote client data out of aggregated surfaces.

## What Changes

- Regenerate the frontend API schema from the backend OpenAPI contract and consume the typed `network.listen`, `network.accept`, and `inbound_endpoint` variants without parallel handwritten DTOs.
- Present listener and accepted-connection events and groups with distinct labels, local endpoint formatting, workload/release context, and safe unknown-payload fallbacks.
- Reveal accepted remote endpoints only inside authorized raw occurrence details; exclude them from group summaries, inventory, release comparison, notifications, URLs, analytics, telemetry, and browser logs.
- Add an application inventory view and filter for inbound TCP endpoints, including independent listener-observed and accept-observed evidence.
- Present backend-classified listener behavior in release comparison while excluding accepted-client traffic variation from release behavior.
- Introduce a shared IPv4/IPv6 endpoint formatter with explicit wildcard-interface descriptions and no DNS or hyperlink transformation.
- Cover loading, empty, error, malformed, unsafe-text, pagination, search, responsive-layout, and regression states with unit, component, contract, and end-to-end tests.

## Capabilities

### New Capabilities

- `inbound-network-presentation`: Defines endpoint formatting, inbound-event labels and visual distinctions, privacy boundaries for remote clients, wildcard presentation, and safe fallback behavior shared across frontend surfaces.

### Modified Capabilities

- `api-client-foundation`: Extends the generated frontend contract with inbound runtime payloads, summaries, inventory identity, fixtures, and compatibility checks.
- `runtime-group-exploration`: Adds listener and accepted-connection groups based on process and local endpoint while keeping clients in raw occurrences.
- `runtime-occurrence-exploration`: Adds typed listener details and accepted-client details with remote endpoints confined to the expanded raw occurrence view.
- `runtime-inventory-exploration`: Adds application-scoped inbound endpoint browsing, evidence states, filtering, search, pagination, facets, and detail navigation.
- `release-runtime-comparison`: Adds backend-classified listener behavior without deriving changes from accepted-connection counts on the client.

## Impact

- Affects the generated API schema and its compile-time contract fixtures.
- Affects runtime group lists/details, occurrence timelines, application inventory lists/details, release comparison, event/inventory filters, shared presentation helpers, localization catalogs, and visualizations.
- Adds frontend fixtures and tests derived from the backend OpenAPI contract and runtime inventory fixture.
- Depends on the backend contract being synchronized from `/Users/ihippik/RustroverProjects/okoscope`; it does not change backend behavior or schemas.
