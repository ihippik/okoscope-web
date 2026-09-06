## Why

The Requires attention page currently receives policy totals and policy-related reason codes, but it does not explain how policies reduced noise or distinguish expected behavior from observations that need review. Users therefore see general discovery counts and recommendations without a clear policy-based path to the most relevant observations.

## What Changes

- Add a policy classification section to the Application-level observed-actions area using backend-provided attention policy totals.
- Show factual total, actionable total, expected, requires-review, unclassified, conflict, and pending counts with plain-language explanations that do not imply objective risk.
- Make actionable policy categories link to the corresponding Runtime Groups view with canonical policy filters.
- Present backend-provided policy recommendations and priority items with policy-specific titles, explanations, and destinations.
- Preserve backend authority: the frontend will not infer recommendations, actionable state, policy priority, or policy classification from raw observations.
- Add complete English and Russian UI copy, responsive behavior, accessibility coverage, and browser tests.

## Capabilities

### New Capabilities

- `policy-aware-attention`: Policy-derived observed-action facts, navigation, and review recommendations on the Requires attention page.

### Modified Capabilities

None.

## Impact

- Affected frontend areas: `src/features/attention`, attention routing, localization, attention fixtures, unit tests, and end-to-end tests.
- Existing attention summary fields under `totals.policy` become visible in the UI.
- Policy-specific recommendations require the backend attention summary to provide recommendation or priority items with documented policy reason codes and resource destinations. Missing backend items will not be synthesized in the frontend.
- No new frontend enrichment requests or duplicated policy business logic will be introduced.
