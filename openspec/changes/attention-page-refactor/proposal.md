## Why

The Application Requires attention page renders observed facts, policy classification, recommendations, and the priority queue as one long vertical document. These sections visually merge, make the page expensive to scan, and push the most useful action-oriented content far below the fold.

## What Changes

- Replace the four continuously stacked areas with three top-level tabs: Overview, Recommendations, and Priority queue.
- Keep Observed actions and Policy classification together in Overview because both describe the current attention snapshot rather than prescribe an action.
- Make Recommendations the default tab so the page leads with concrete next steps.
- Show backend-provided item counts in the Recommendations and Priority queue tab labels.
- Persist the selected tab in canonical URL search state so views are shareable and browser navigation is predictable.
- Add keyboard-operable, screen-reader-compatible tabs and a mobile treatment that does not introduce page-level horizontal overflow.
- Preserve all existing policy, recommendation, priority, routing, snapshot, empty-state, and backend-authority semantics.

## Capabilities

### New Capabilities

- `attention-page-sections`: URL-addressable, accessible tab navigation and section presentation for the Application Requires attention page.

### Modified Capabilities

None.

## Impact

- Affected frontend areas: the Application attention route, attention page composition, localization, URL-state parsing, unit tests, and end-to-end tests.
- No API or backend changes are required; counts come from the existing recommendation and priority item arrays.
- Existing deep links to the page without a section parameter continue to work and open Recommendations.
- No attention ranking, policy classification, recommendation synthesis, or additional data requests are introduced.
