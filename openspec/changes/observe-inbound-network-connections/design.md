## Context

The frontend consumes a generated TypeScript schema from `openapi/okoscope-v1.yaml` and shares presentation components across runtime groups, raw occurrences, application inventory, and release comparison. The backend repository now defines `network.listen`, `network.accept`, an inbound semantic summary containing only the receiving process and local endpoint, and `inbound_endpoint` inventory evidence.

Remote endpoints in accepted-connection payloads are sensitive, high-cardinality occurrence evidence. They must remain reachable for investigation without leaking through aggregation, navigation state, notification presentation, diagnostics, or visualizations. The frontend working tree also contains ongoing visualization and localization work, so implementation must extend those patterns without overwriting unrelated changes.

Two requirement/contract differences are intentional constraints: release diff's generated classification currently contains only `new`, `disappeared`, and `unchanged`, although backend specifications discuss unknown evidence; and both inventory evidence flags are required booleans even though malformed-response fallback must tolerate a missing flag.

## Goals / Non-Goals

**Goals:**

- Consume inbound variants exclusively through regenerated OpenAPI types.
- Give local endpoints one consistent, unambiguous IPv4/IPv6 presentation everywhere.
- Make listener, accepted connection, and inbound inventory evidence understandable without exposing remote clients in aggregate UI.
- Preserve existing query, ownership, pagination, filter, loading, empty, error, and safe-rendering behavior.
- Treat backend identities and release classifications as authoritative.

**Non-Goals:**

- Changing the backend contract, grouping fingerprints, inventory projection, or release classification.
- Performing DNS, Kubernetes identity, hostname, geolocation, or reachability enrichment.
- Inferring that IPv4 and IPv6 wildcards are equivalent.
- Computing listener behavior from accepted-connection counts.
- Adding remote endpoints to routes, filters, search, telemetry, logs, notifications, or visualizations.

## Decisions

### 1. Synchronize and generate the contract before UI work

The backend OpenAPI file and contract fixtures are copied into the frontend's established contract locations, then `npm run api:generate` regenerates `schema.d.ts`. `types.ts` exports aliases for generated inbound schemas but defines no structurally duplicated DTOs.

Handwritten inbound DTOs were rejected because they can silently diverge from closed OpenAPI unions and weaken contract tests.

### 2. Separate event-kind labels from payload dispatch

Presentation maps API `event_kind` values such as `network.listen` and `network.accept` to localized user labels. Occurrence rendering dispatches on payload discriminators `NetworkListen` and `NetworkAccept`. Semantic-summary narrowing uses stable field combinations and the enclosing event or inventory kind where available.

Treating event kinds and payload discriminators as interchangeable was rejected because the existing code already receives both dotted and PascalCase namespaces.

### 3. Use one pure endpoint formatter plus separate wildcard metadata

`formatEndpoint(addressFamily, address, port)` returns only the canonical display string: `address:port` for IPv4 and `[address]:port` for IPv6. A companion presentation helper identifies `0.0.0.0` and `::` and supplies localized “all interfaces” copy. It never validates by DNS lookup, rewrites hostnames, or emits markup/links.

Embedding wildcard prose into the identity string was rejected because identity is used in headings, tests, and compact layouts while the description is optional supporting copy.

### 4. Enforce remote-client privacy by component boundaries

Only the `NetworkAccept` branch inside the expanded occurrence technical-details component receives and renders `remote_address` and `remote_port`. Group semantic summaries, group cards, inventory identities, release diff cards, visualizations, and notification helpers operate only on `InboundNetworkSemanticSummary` or inventory identity, neither of which contains remote fields.

Generic JSON rendering remains text-only through React. The raw occurrence copy action may copy the payload because it is an explicit action inside authorized raw detail; no automatic logging or URL serialization is introduced.

### 5. Keep backend aggregation and classification authoritative

The frontend displays one group or inventory row for every item returned by the API and does not regroup by client, process, deployment, or endpoint. Release comparison renders inbound entries returned by the backend and never derives classification from occurrence counts. `network.accept` traffic is not promoted into listener behavior.

Client-side deduplication was rejected because it could merge distinct trusted scopes or conceal backend identity defects.

### 6. Model evidence flags as independent required states with defensive fallback

For contract-valid inventory responses, both booleans are rendered independently, allowing none, listener only, accept only, or both. Runtime guards used by unknown/malformed fallback tolerate a missing property without inventing positive evidence and render an unavailable-evidence message.

Changing generated flags to optional was rejected because OpenAPI requires them. Missing-property behavior is defensive rendering, not a new API model.

### 7. Preserve forward compatibility for unknown values

Unknown event payloads use inert JSON fallback, unknown event kinds use a neutral activity label, and unsupported inventory identities use a text-only unavailable identity rather than throwing. If a future server returns a release classification outside the generated union, a boundary-level fallback can label it unknown without adding that value to the generated type prematurely.

## Risks / Trade-offs

- **Backend OpenAPI changes while frontend work is underway** → Regenerate first and run `api:check` and compile-time fixtures before component changes.
- **Remote data leaks through a generic summary helper** → Test every aggregate surface with a unique remote sentinel and assert its absence.
- **Existing destination formatting remains inconsistent** → Reuse the formatter for endpoint-shaped inbound output first and migrate outbound endpoint formatting only where it does not change established semantics.
- **Long commands or IPv6 values break cards** → Apply `min-width: 0`, wrapping, and text-only rendering and verify narrow viewport fixtures.
- **Unknown classification is returned ahead of OpenAPI** → Render a neutral runtime fallback while reporting the contract mismatch; do not alter generated types manually.
- **Concurrent localization/visualization edits conflict** → Inspect and preserve the dirty worktree, making narrowly scoped changes and running regression suites.

## Migration Plan

1. Synchronize the backend OpenAPI and supporting contract fixtures into the frontend.
2. Regenerate the API schema and add compile-time inbound fixtures.
3. Add shared endpoint and presentation primitives with unit tests.
4. Extend occurrences and groups, then inventory, then release comparison and visualizations.
5. Add privacy, malformed-data, search, pagination, and regression coverage.
6. Run formatting, lint, typecheck, API generation check, unit/component tests, build, and relevant end-to-end tests.

Rollback consists of reverting frontend presentation changes while retaining the additive generated contract; older event kinds and inventory kinds remain valid.

## Open Questions

- Should the backend extend `RuntimeDiffEntry.classification` with `unknown`, or is unknown represented only through absence/summary evidence?
- Should malformed inventory evidence with one missing flag display “unknown” per flag or one neutral unavailable-evidence message?
- Should wildcard descriptions appear inline beside every endpoint or only in detail-oriented surfaces?
