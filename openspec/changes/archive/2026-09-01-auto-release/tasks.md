## 1. Synchronize the API contract

- [x] 1.1 Copy the current backend `openapi/okoscope-v1.yaml` into the frontend contract snapshot and verify Release metadata, deployment episode operations/schemas, and Runtime Diff `baseline_selection_source` are present.
- [x] 1.2 Regenerate `src/shared/api/schema.d.ts` with `npm run api:generate` and export the contract-derived deployment episode types and query parameter types from `src/shared/api/types.ts`.
- [x] 1.3 Run the API drift check and strict typecheck before UI changes, stopping for backend correction rather than adding a frontend workaround if the current response contract is incomplete.

## 2. Add scoped episode data access

- [x] 2.1 Add an episode-history query key containing Project, Application, Release, and normalized cursor inputs.
- [x] 2.2 Add the bounded generated-contract episode request with opaque cursor and limit parameters, enabled only for an operator-opened Release history.
- [x] 2.3 Add query tests proving scope/cursor key separation, correct encoded request construction, lazy enablement, and independent episode pagination.

## 3. Present immutable Release metadata

- [x] 3.1 Update Release cards to distinguish immutable Release source as `manual` or `observed` and preserve existing version, description, deployed time, and Runtime Diff navigation.
- [x] 3.2 Add bounded inert image identity presentation for observed Releases using returned identity components and digest, without client-side identity reconstruction.
- [x] 3.3 Show observed revision and active-episode counts while keeping manual Releases with null identity and zero Kubernetes counts usable without fabricated metadata.

## 4. Present deployment episode history

- [x] 4.1 Add an accessible operator-controlled Release history panel that lazily loads episodes and provides loading, empty, retryable error, ownership-mismatch, and paginated success states.
- [x] 4.2 Render each episode as distinct from its Release and revision, including revision ID, occurrence number, state, transition kind, first/last observation, first Ready time, end time, snapshot time, Ready Pod count, workload Ready Pod count, and nullable Ready Pod share.
- [x] 4.3 Map `concurrent` and `rollback_candidate` to evidence-qualified labels, retaining “rollback candidate” wording and never claiming a completed rollback.
- [x] 4.4 Place explanatory copy adjacent to readiness evidence stating that Ready Pod share is not traffic share and does not confirm canary or A/B intent.

## 5. Explain Runtime Diff baseline selection

- [x] 5.1 Add operator-facing presentation for every `baseline_selection_source` value returned by Runtime Diff: explicit, transition, concurrent transition fallback, legacy deployment order, and none.
- [x] 5.2 Preserve explicit baseline URL selection and cursor reset behavior, and verify the UI presents the backend-returned `explicit` source after selection.
- [x] 5.3 Validate target/baseline ownership and agreement between main diff and summary baseline-selection provenance before rendering combined comparison data.

## 6. Verify required scenarios

- [x] 6.1 Add component tests for legacy manual Releases with null identity/zero counts and observed Releases with image identity, revision count, and active-episode count.
- [x] 6.2 Add episode-history tests for repeated episodes, multiple and concurrent revisions, nullable lifecycle/readiness metadata, independent pagination, ownership mismatch, and inert dynamic identity content.
- [x] 6.3 Add wording tests proving Ready Pod share is not presented as traffic/canary/A/B evidence and `rollback_candidate` is not presented as a confirmed rollback.
- [x] 6.4 Add Runtime Diff tests for all baseline-selection sources and retained explicit baseline selection.
- [x] 6.5 Run focused Vitest suites, formatting, lint, strict typecheck, API drift check, production build, and the complete repository quality gate while preserving unrelated existing worktree changes.
