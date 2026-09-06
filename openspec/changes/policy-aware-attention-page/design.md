## Context

Application attention summaries already expose `totals.policy` with factual, actionable, pending, expected, requires-review, conflict, and unclassified counts. Attention recommendations and priority items can also carry the documented policy reason codes. The current page ignores the policy totals, uses generic discovery copy for policy reasons, and routes Application resources back to the Application overview rather than to a policy-filtered review list.

The frontend must treat the backend response as authoritative. It cannot derive actionable observations, recommendation priority, or policy recommendations from inventory and Runtime Group data.

## Goals / Non-Goals

**Goals:**

- Explain how policy classification changes the attention workload without describing a policy verdict as an objective risk assessment.
- Add an accessible policy breakdown to the Application-level observed-actions area.
- Give each reviewable policy category a direct, canonical route to filtered Runtime Groups.
- Render backend-provided policy reason codes with specific, localized recommendation and priority copy.
- Keep all facts snapshot-consistent with the attention summary.

**Non-Goals:**

- Computing policy totals, actionable state, priorities, or recommendations in the browser.
- Adding enrichment requests to reproduce or complete attention summary data.
- Changing policy evaluation, suppression, notification, or discovery lifecycle semantics.
- Adding policy editing controls to the attention page.
- Changing the organization-level attention page in this change.

## Decisions

### Use `totals.policy` as the sole source for the observed-action policy section

The page will present two headline facts—observed (`factual_total`) and requiring attention (`actionable_total`)—followed by the backend breakdown: expected, requires review, unclassified, conflict, and evaluation pending. This makes noise reduction visible while keeping all values from one snapshot.

Alternative considered: query Runtime Groups once per verdict and calculate counts. Rejected because it adds enrichment traffic, can produce snapshot skew, and duplicates backend aggregation.

### Treat classifications as operational intent, not severity

Copy and visual treatment will say “expected”, “requires review”, “unclassified”, “policy conflict”, and “evaluation pending”. It will explicitly state that these classifications guide review and do not establish cause or risk.

Alternative considered: label all actionable observations as alerts. Rejected because unclassified and conflicting behavior is not inherently malicious or erroneous.

### Route categories through canonical Runtime Group URL filters

Policy breakdown links will use existing URL state:

- `expected` → `verdict=expected`
- `requires_review` → `verdict=requires_review&suppressed=false`
- `unclassified` → `verdict=unclassified&suppressed=false`
- `policy_conflict` → `verdict=policy_conflict&suppressed=false`
- `evaluation_pending` → `evaluation_pending=true`

The factual and actionable headline values are explanatory totals rather than new client-calculated filters. Existing URL parsing and query construction remain authoritative for list behavior.

### Render, but do not invent, policy recommendations

`RecommendationList` and `PriorityList` will recognize all documented policy reason codes and render policy-specific explanation text. When a backend item uses an Application resource with a policy reason code, attention routing will target Runtime Groups with the corresponding policy filter. Runtime Group resources will continue to deep-link to the exact group.

If the backend returns no policy recommendation, the frontend will not synthesize one from `totals.policy`. This preserves the backend contract boundary even when nonzero policy totals are visible.

### Extend shared attention presentation instead of creating a parallel recommendation component

Policy reasons will be added to the existing reason-to-copy and destination mapping. This keeps priority items and recommendations semantically aligned and avoids divergent behavior between the two lists.

## Risks / Trade-offs

- **[Policy totals are nonzero but no recommendation is returned]** → Show the factual breakdown and no fabricated recommendation; cover this state in tests.
- **[Users interpret actionable as dangerous]** → Include explicit intent/review wording and avoid security severity language.
- **[Suppressed observations appear in review links]** → Add `suppressed=false` to actionable verdict destinations; leave pending evaluation independent because it has no verdict yet.
- **[Backend policy reason codes lack a routable resource]** → Render the item and show the existing unavailable-action treatment rather than guessing identifiers.
- **[Large counts dominate the existing observed-action layout]** → Use a compact responsive card group and preserve the current page hierarchy.

## Migration Plan

1. Add localized policy fact and policy reason presentation behind the existing attention response contract.
2. Add policy-aware attention destinations using existing Runtime Group search parameters.
3. Add fixture coverage for all policy totals and policy reason codes.
4. Deploy the frontend independently where the backend already supplies the documented fields.
5. Roll back by reverting the presentation and routing changes; no stored data or API migration is required.

## Open Questions

- The backend team must confirm which policy reason codes can appear in `recommendations` versus only in `priority_items` and ensure each review recommendation includes a supported resource reference.
- Product copy should confirm whether `unclassified` belongs in `actionable_total` in every deployment; the frontend will display the backend total without recomputing it.
