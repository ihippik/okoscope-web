## 1. Establish the backend naming contract

- [x] 1.1 Complete and archive `auto-release` before applying this change so overlapping Release delta requirements have a stable base.
- [x] 1.2 Update the backend Release contract to require non-empty `display_name` on Release responses and `release_display_name` on nested inventory/occurrence attribution, without nullable or legacy fallback semantics.
- [x] 1.3 Implement and test the observed naming rule `<Application name> · <image count> image(s) · <digest8>` using every application/init image in Release identity and no primary-container heuristic.
- [x] 1.4 Ensure manual Release creation/responses satisfy the same required display-name contract while leaving removal of the manual API out of scope.
- [x] 1.5 Verify backend tests cover one and multiple images, Application rename without Release identity changes, strict missing-name rejection, and consistent nested attribution.

## 2. Synchronize generated frontend types

- [x] 2.1 Copy the completed backend OpenAPI schema into the frontend snapshot and regenerate `src/shared/api/schema.d.ts`.
- [x] 2.2 Verify generated Release, Runtime Diff, Runtime Inventory evidence, and occurrence attribution types expose required display-name fields and add no handwritten DTOs, casts, or fallback fields.
- [x] 2.3 Run API drift and strict type checks, stopping for backend contract completion if any Release-facing operation lacks the required name.

## 3. Use display names across Release workflows

- [x] 3.1 Replace Release-card headings with `display_name` while retaining source, deployed time, description, observed counts, full digest, and expandable image composition.
- [x] 3.2 Replace Runtime Diff target, baseline, and baseline-selector version labels with backend-provided display names while preserving Release IDs and URL behavior.
- [x] 3.3 Update Runtime Inventory Release filters and Release evidence to use backend-provided display names without parsing identity components or digests.
- [x] 3.4 Update occurrence and other Release-attribution presentation to use `release_display_name` consistently and remove version/ID/digest presentation fallbacks.

## 4. Verify strict human-readable presentation

- [x] 4.1 Update frontend fixtures and component tests for observed one-image and multi-image names plus manual names.
- [x] 4.2 Add cross-surface tests proving one Release has the same display name in the list, Runtime Diff, inventory filters/evidence, and occurrence attribution.
- [x] 4.3 Add tests proving the UI keeps complete image components and the full digest inspectable but does not derive a primary container or changed-container summary.
- [x] 4.4 Update English/Russian presentation coverage and pass the localization catalog guard.
- [x] 4.5 Run focused tests and the complete formatting, lint, strict typecheck, API drift, test, and production-build quality gate while preserving unrelated worktree changes.
