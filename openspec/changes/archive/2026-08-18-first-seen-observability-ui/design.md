## Context

Okoscope Web already has contract generation, runtime configuration, a build-info gate, ephemeral bearer credentials, TanStack Router/Query, correlated errors, and Application-scoped Runtime Groups list/detail routes. The next API v1 contract (backend commit `76ff32fe913ccce4a4392262b286df75dae013c6`, required database migration 6) adds first-seen metadata, occurrence pagination, notification state, and lifecycle mutations. The implementation is frontend-only and must retain strict generated typing, tenant ownership checks, URL-addressable navigation, and the current visual/accessibility conventions.

## Goals / Non-Goals

**Goals:**

- Complete the discover → inspect occurrences → acknowledge → resolve → reopen workflow.
- Make collection filters and cursor position reproducible through deep links and browser history.
- Keep successful payloads and operation inputs derived from the refreshed OpenAPI contract.
- Present lifecycle and notification state accurately, accessibly, and independently of risk.
- Bound network and rendering work for occurrence history and dynamic payloads.

**Non-Goals:**

- Risk/severity scoring, recommendations, enforcement, or blocking.
- Backend changes, webhook destination creation, or notification retry controls.
- OIDC/login redesign or browser persistence of bearer credentials.
- Embedding production smoke fixture UUIDs in application code.

## Decisions

### Refresh the contract before adapting consumers

Copy the authoritative backend OpenAPI document into the repository's pinned input and regenerate the TypeScript declaration/client artifacts with existing scripts. Compilation and a focused contract regression test will prove that new fields, filters, occurrence operation, and lifecycle operations exist with typed success responses. Local DTOs, handwritten fetches, `any`, and casts used to compensate for stale output are rejected because they bypass contract drift detection.

The compatibility gate will continue to require API version `v1` and additionally require `database_migration >= 6`. A lower or absent migration value is an incompatible backend and uses the existing blocking diagnostic UI.

### Extend canonical URL search state without replacing existing filters

The Runtime Groups search schema will retain currently supported filters and add release, lifecycle status, first-seen from/to, and last-seen values exactly as supported by generated operation parameters. Search parsing normalizes empty/invalid inputs; every accepted filter and the cursor participates in the query key and generated request. Changing any filter removes the cursor. List-to-detail navigation carries the canonical list search as return-search state (or an encoded search subset supported by the router), so the detail Back link and browser Back restore both filters and cursor without a global store.

### Keep recency factual and deterministic

A centralized presentation helper compares `first_seen_at` with an explicit product threshold and an injectable clock. The resulting “Recently first seen” label uses text/icon plus styling and does not assign severity, risk, or ordering. Invalid timestamps receive no recency treatment. This keeps tests deterministic and prevents client inference from masquerading as backend risk analysis.

### Separate detail, occurrences, and mutations by query identity

Detail and occurrence pages/hooks use distinct query-option factories. Occurrence identity includes project, application, group, cursor, and bounded limit; each request loads one page only and renders the generated response. Existing ownership validation runs before any group-related payload is shown, and occurrence attribution is not used to weaken route ownership.

Lifecycle mutation hooks call only the generated acknowledge/resolve/reopen operations. Controls are derived from the current generated status: open permits acknowledge or resolve, acknowledged permits resolve or reopen, and resolved permits reopen, subject to the contract's actual transition rules. A mutation disables lifecycle controls until settled. Resolve uses the existing accessible confirmation/dialog pattern with focus return; acknowledge and reopen execute directly. On success, the client invalidates the group detail, all Runtime Groups collections for its Application scope, and other cached group views whose summary can contain the status.

### Model notification state as delivery information

A total mapping over generated notification states supplies a visible label and explanatory copy for `pending`, `not_configured`, `delivering`, `delivered`, `terminally_failed`, and `backfill_suppressed`. Pending copy states that delivery has not completed and never implies success when a worker is disabled; not-configured copy explicitly identifies the missing webhook destination. Presentation does not reuse risk/severity components. Unknown values caused by contract skew use a neutral fallback without exposing raw secrets.

### Reuse safe evidence and error primitives

Representative events, semantic summaries, and occurrence payloads reuse the bounded, text-only JSON viewer. Detail adapters whitelist contract fields intended for operators; credentials, webhook signing material, and other secret-like internal fields are never rendered through generic object dumping. Loading skeletons, empty states, request-ID-aware error panels, semantic labels, focus handling, and responsive cards/tables extend existing shared components.

## Risks / Trade-offs

- [The copied contract differs from the deployed backend] → Pin its source commit in documentation, run generation freshness/contract tests, and block the UI through build-info migration compatibility.
- [Exact filter names or transition response shapes differ from assumptions] → Treat the generated operation signatures as authoritative and adjust URL adapters/query invalidation around them before UI implementation.
- [Return-search duplication can drift] → Use one canonical parse/serialize helper for route search and navigation links; cover direct links and browser Back in Playwright.
- [Opaque cursors cannot reconstruct arbitrary previous pages] → Preserve visited cursor URLs in browser history and expose only server-provided next transitions rather than synthesizing cursors.
- [Large occurrence payloads degrade responsiveness] → Enforce a bounded page-size constant and reuse bounded JSON rendering; never accumulate all pages automatically.
- [Mutation succeeds but invalidation refetch fails] → Treat the mutation result as success, keep controls guarded while settling, and surface subsequent refresh failures non-destructively with request IDs.
- [Secret-like fields appear in future schemas] → Render an explicit allowlist of operator-facing fields rather than arbitrary detail objects.

## Migration Plan

1. Refresh and regenerate the API contract; raise the compatibility threshold and land contract regression coverage.
2. Extend URL state, query keys/options, presentation mappings, detail fields, and occurrence pagination.
3. Add lifecycle mutations and confirmation/invalidation behavior.
4. Complete unit, integration, Playwright, axe, and any necessary container smoke updates.
5. Deploy the frontend only after the backend reports API `v1` and migration 6 or newer. Rollback restores the previous frontend image; no persistent frontend data needs migration.

## Open Questions

- Confirm the product threshold and timezone-inclusive wording for “Recently first seen”; until product configuration exists, centralize a documented constant.
- Confirm whether the generated contract exposes worker-disabled context separately from `pending`; if it does, include it in pending explanatory copy without treating it as success.
