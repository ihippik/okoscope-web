## Context

The current Releases route treats the backend `Release` object as a manual deployment record and renders only version, description, and deployment time. The backend contract has evolved: a Release is now immutable and can be manual or derived from observed image identity; Kubernetes workload revisions refer to that Release; and a single revision can participate in multiple deployment episodes over time. Runtime Diff also returns the provenance of its automatically selected baseline.

The backend already owns image identity construction, revision grouping, episode lifecycle, transition classification, Ready Pod observations, concurrency, rollback candidacy, and baseline selection. Repository policy forbids compensating for incomplete contracts with frontend enrichment or duplicated business logic. The frontend therefore consumes these fields exactly as contract-derived evidence and keeps legacy manual Releases usable when their Kubernetes identity metadata is nullable or empty.

## Goals / Non-Goals

**Goals:**

- Make immutable Release, Kubernetes revision, and deployment episode distinct concepts in operator-facing presentation.
- Present observed image identity and episode history using generated API types and bounded backend endpoints.
- Preserve manual Release browsing and Runtime Diff behavior.
- Communicate uncertainty precisely for concurrency, Ready Pod share, rollback candidates, and baseline selection.
- Keep pagination, ownership validation, loading/error/empty states, and URL behavior consistent with existing observability patterns.

**Non-Goals:**

- Inferring image identity, rollout intent, traffic distribution, canary/A/B strategy, rollback completion, or baseline provenance in the browser.
- Adding Release creation/editing or Kubernetes deployment controls.
- Fetching Kubernetes revision details through extra enrichment requests not present in the backend contract.
- Treating absent required response fields as a legacy wire format; the backend must satisfy its OpenAPI contract.

## Decisions

### Synchronize the backend contract before UI work

Copy the current backend OpenAPI document into the repository snapshot, regenerate `schema.d.ts`, and export the generated episode types. This establishes the backend operation and schemas as the implementation boundary. Handwritten DTOs or permissive casts would hide contract drift and are rejected.

### Keep Release summary and episode history as separate data lifecycles

The Release page continues to load one cursor-paginated Release page. Episode history uses the dedicated Release-scoped endpoint and an independent query key containing Project, Application, Release, and episode cursor. History is loaded only for the Release whose history the operator opens, preventing an N+1 request across every list row. Each response is checked against route scope and requested Release before rendering.

An always-eager episode request was considered, but it increases list latency and request volume. A separate top-level episode route was also considered; an expandable/detail presentation retains Release context with less navigation complexity while still supporting independently paginated history.

### Render image identity as bounded evidence

Observed Releases show a stable, text-only image identity summary derived only from returned `identity_components`, with the returned digest available as the stable technical identity. Components remain inert and bounded; unknown component shapes use the existing safe structured-data presentation rather than frontend interpretation. Manual Releases do not show an empty image identity section. Null observed identity is rendered as unavailable evidence, not reconstructed client-side.

### Preserve semantic uncertainty in labels and explanatory copy

Episode `transition_kind` maps directly to neutral labels. `rollback_candidate` is never shortened to “rollback”. Concurrent episodes receive a concurrency indicator plus persistent explanatory copy. Ready Pod share is formatted as a percentage only when non-null and is always accompanied by copy stating that it is not traffic share and does not establish canary/A/B intent. The UI does not compare shares to invent rollout phases.

### Treat baseline selection provenance as response data

Runtime Diff renders `baseline_selection_source` returned by the main response and keeps the existing baseline selector. Selecting a baseline continues to place `baseline_id` in validated URL state and resets the cursor; the resulting `explicit` source confirms backend handling. Summary provenance must agree with the main diff when both responses are available; a mismatch is surfaced as incompatible scoped data rather than silently choosing one.

### Define legacy compatibility through nullable identity and empty Kubernetes evidence

Manual Releases remain fully renderable with `identity_version`, `identity_digest`, and `identity_components` set to null and revision/active-episode counts set to zero. Episode history is not presented as required manual metadata. If a server omits fields that the synchronized schema marks required, that is a backend contract violation and implementation stops rather than adding frontend fallbacks.

## Risks / Trade-offs

- [Opaque `identity_components` objects can vary by backend identity version] → Render a concise known text summary only where the contract makes it safe, retain digest as canonical technical identity, and use inert structured details for remaining components.
- [Expandable histories create multiple cached cursor states] → Scope query keys by all server inputs and reset only the affected Release history cursor.
- [Ready Pod percentages can be mistaken for traffic allocation] → Place the disclaimer adjacent to readiness evidence, not solely in documentation or a tooltip.
- [A Release may have concurrent active episodes across revisions] → Present each episode independently and use backend transition labels; never collapse episodes into one rollout state.
- [Frontend and backend OpenAPI snapshots can drift] → Regenerate committed types from the backend source and run `api:check` in the quality gate.
- [Existing dirty worktree changes may overlap observability files] → Inspect and preserve user changes before implementation, limiting edits to the planned surfaces.

## Migration Plan

1. Synchronize OpenAPI and regenerate types; verify the new endpoint and required response fields compile.
2. Add contract-derived type exports and episode queries with tests.
3. Add Release metadata and lazy episode-history presentation.
4. Add baseline provenance presentation and consistency validation.
5. Run focused component/query tests followed by the repository quality gate.

Rollback is frontend-only: revert the UI and contract snapshot together. No data migration or backend write is introduced.

## Open Questions

- The OpenAPI schema intentionally leaves `identity_components` item structure open. The first implementation should confirm representative backend payloads before choosing which component fields deserve a compact primary label; the full digest remains a safe identity fallback.
