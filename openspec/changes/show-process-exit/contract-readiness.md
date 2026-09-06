# Backend contract readiness

Compared on 2026-08-23:

- Frontend pin: `/Users/ihippik/WebstormProjects/okoscope-web/openapi/okoscope-v1.yaml`
- Backend source: `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml`

## Ready in the backend contract

- `RuntimeEventKind` includes `process.exit`, `container.terminated`, `container.restart`, and `container.restart_loop`.
- `EvidenceSource` contains `kernel`, `kubernetes`, and `derived`.
- `ProcessTermination` is a closed `exited`/`signaled` union and labels `conventional_exit_code` separately.
- `ProcessExitPayload`, `ContainerTerminationPayload`, and `ContainerRestartPayload` are typed occurrence variants.
- Process-exit generation correlation distinguishes `observed` and `unresolved` with a bounded reason.
- Occurrences expose bounded `EventCorrelation` with `absent`, `qualified`, or `ambiguous` status, candidate count, tolerance, and at most one related event ID.
- Runtime semantic summaries cover process exit, container termination, container restart, and derived restart loop.
- Restart-loop summary includes provenance, projection version, threshold, window bounds, observed count, container, and optional latest lifecycle evidence.
- Restart gaps expose restart count, delta, `observation_gap`, previous termination, and waiting reason.

## Resolved backend additions

1. Attention enums and `AttentionRestartLoopFacts` now expose the restart-loop item and reason at Organization and Application scope.
2. Occurrences now return at most 20 typed `related_evidence` entries.
3. `RuntimeEventPayload` now includes typed `ContainerRestartLoopPayload`.
4. Occurrences now expose `received_at`; the page contract fixes ordering as `received_at DESC, observed_at DESC, id DESC`.
5. Runtime-group source/correlation filters remain intentionally absent for v1, so the frontend omits those controls rather than filtering cursor pages locally.

## Consequence

The backend file is now compatible and has been pinned. No handwritten DTO, timestamp/PID matching, client-side attention projection, or cursor-page filtering is required.

## Accepted v1 boundary

- Source/correlation list filters are not part of v1 and are not synthesized in the browser.
- The UI follows the server-declared receive-time ordering and does not reorder across cursor pages.
