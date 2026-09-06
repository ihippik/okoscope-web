## 1. Contract and Presentation Foundation

- [x] 1.1 Verify the attention summary fixtures cover all `totals.policy` fields and add representative backend-provided items for every documented policy reason code without changing the API contract.
- [x] 1.2 Add English and Russian localization keys for policy attention facts, bounded guidance, policy-specific reasons, and review actions.
- [x] 1.3 Add unit tests for policy reason text and zero/nonzero policy total presentation before implementing the UI.

## 2. Observed-Action Policy Facts

- [x] 2.1 Implement a responsive, semantic policy attention facts section using only `summary.totals.policy`.
- [x] 2.2 Add canonical links for expected, requires-review, unclassified, conflict, and evaluation-pending categories using existing Runtime Group URL filters.
- [x] 2.3 Integrate the policy facts into the Application Requires attention observed-actions area with bounded intent-versus-risk guidance and zero-state behavior.

## 3. Policy-Aware Review Recommendations

- [x] 3.1 Extend shared attention reason presentation for `policy_review_required`, `policy_conflict`, `policy_unclassified`, and `policy_evaluation_pending`.
- [x] 3.2 Extend attention destinations so Application policy items route to filtered Runtime Groups while exact Runtime Group resources retain their deep links.
- [x] 3.3 Verify that nonzero policy totals without backend recommendations do not create synthesized frontend recommendations.

## 4. Verification

- [x] 4.1 Add component tests for all policy totals, policy reason codes, deterministic destinations, unsupported destinations, and the no-synthesis boundary.
- [x] 4.2 Add end-to-end coverage for policy fact navigation, Russian localization, keyboard access, and narrow-viewport layout.
- [x] 4.3 Run formatting, lint, type checking, unit tests, focused browser tests, and the production build; fix all regressions within the change scope.
