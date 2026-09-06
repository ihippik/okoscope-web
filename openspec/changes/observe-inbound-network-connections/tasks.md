## 1. Contract Synchronization

- [x] 1.1 Synchronize `openapi/okoscope-v1.yaml`, `docs/fixtures/runtime-inventory.json`, and `docs/inbound-network-observation.md` from the backend source of truth without modifying backend schemas.
- [x] 1.2 Regenerate `src/shared/api/schema.d.ts` with `npm run api:generate` and export generated inbound schema aliases from the existing API type boundary.
- [x] 1.3 Add compile-time and API contract fixtures for `NetworkListen`, `NetworkAccept`, safe inbound summaries, `inbound_endpoint`, IPv4/IPv6, and all boolean evidence combinations.
- [x] 1.4 Verify `npm run api:check` and explicitly document the OpenAPI limitation that release diff classification does not currently include `unknown`.

## 2. Shared Endpoint and Presentation Primitives

- [x] 2.1 Implement pure `formatEndpoint(addressFamily, address, port)` behavior for IPv4 and bracketed IPv6 with numeric ports.
- [x] 2.2 Implement wildcard-interface presentation for `0.0.0.0` and `::` without merging identities, DNS lookup, hostname replacement, or automatic links.
- [x] 2.3 Add localized `network.listen` and `network.accept` labels plus distinct icons or badges while preserving neutral unknown-kind fallback.
- [x] 2.4 Add unit tests for IPv4, IPv6, both wildcards, long values, unknown kinds, and inert unsafe strings.

## 3. Runtime Groups and Occurrences

- [x] 3.1 Extend runtime event filters and group presentation for `network.listen` and `network.accept` with process, TCP, family, local endpoint, lifecycle counts, workload, and release context.
- [x] 3.2 Add typed `NetworkListen` occurrence details containing only local endpoint data.
- [x] 3.3 Add typed `NetworkAccept` occurrence details that reveal the remote endpoint only inside the expanded technical/raw detail.
- [x] 3.4 Add component tests proving different clients remain one receiving group and remote sentinels are absent from collapsed occurrences, group list/detail, notification preview, URLs, and visualizations.
- [x] 3.5 Add malformed and unknown payload fallback tests and verify unsafe payload strings remain inert.

## 4. Application Inventory

- [x] 4.1 Add `inbound_endpoint` to inventory URL parsing, kind filters, summary cards, labels, query keys, and visualization presentation.
- [x] 4.2 Render inbound identity from TCP, address family, local address, and local port without process, workload, release, deployment, or client fields.
- [x] 4.3 Render listener-observed and accept-observed evidence independently for false/false, true/false, false/true, and true/true, with defensive missing-property fallback.
- [x] 4.4 Extend inbound endpoint list/detail evidence navigation, facets, search, loading, empty, error, ownership, and pagination behavior using existing inventory mechanisms.
- [x] 4.5 Add tests for local-address and local-port search requests, cursor preservation, unsafe values, remote-sentinel absence, and responsive long endpoint/command layouts.
- [x] 4.6 Run regression tests for process, destination, domain, and syscall inventory behavior.

## 5. Release Comparison

- [x] 5.1 Present backend-returned `network.listen` diff entries with classification, process, TCP family, and local endpoint without client-side diff computation.
- [x] 5.2 Add a safe neutral fallback for an unrecognized runtime classification without editing the generated classification union.
- [x] 5.3 Ensure `network.accept` counts and clients are not promoted into release behavior presentation and remote endpoints are absent from diff cards and visualizations.
- [x] 5.4 Add component tests for new, disappeared, unchanged, unknown fallback, and accepted-traffic privacy/regression behavior.

## 6. Integrated Verification

- [x] 6.1 Add or update frontend contract fixtures and end-to-end scenarios for inbound filters, group-to-occurrence navigation, inventory search/detail/pagination, IPv4, IPv6, wildcard, and unsafe text.
- [x] 6.2 Audit routes, analytics/telemetry hooks, console usage, notification helpers, copy actions, and browser-visible URLs to verify remote endpoints occur only in explicit raw occurrence detail.
- [x] 6.3 Run formatting check, lint, typecheck, API generation check, unit/component tests, production build, and relevant Playwright suites; resolve inbound regressions without overwriting unrelated worktree changes.
