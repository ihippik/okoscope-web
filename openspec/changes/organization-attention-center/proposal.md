## Why

The authenticated landing page currently introduces the Organization and sends operators into the Project hierarchy, but it does not identify what changed, what remains unreviewed, or which operational problem should be handled next. The backend now publishes bounded Organization- and Application-level attention summaries, so the Web UI can provide an accurate command center without client-side fan-out or inference from paginated collections.

## What Changes

- Replace the authenticated Organization landing content with a localized **Requires attention** command center driven by `GET /api/v1/attention-summary`.
- Let operators switch the server-defined attention window between 24 hours and 7 days while keeping the selected window URL-addressable.
- Present complete Organization totals for new and open discoveries, changed Applications, notification problems, and failed deliveries with direct, scope-preserving investigation actions.
- Render the bounded priority queue, changed-Application comparisons, notification problems, and deterministic recommended actions using the API's typed priorities, reason codes, facts, and resource references.
- Translate resource references into existing ownership-safe Project, Application, discovery, release-comparison, and notification routes without accepting server-provided navigation URLs.
- Replace the disabled Application Recommendations placeholder with an Application attention summary backed by the new Application endpoint, while preserving the existing activity, discovery, and release entry points.
- Add independent loading, empty, error, stale-refresh, accessibility, localization, responsive-layout, and contract-regression coverage for the attention surfaces.
- Preserve neutral evidence language: operational priority is not presented as security severity, and behavior that disappeared is described only as no longer observed.

## Capabilities

### New Capabilities

- `organization-attention-triage`: Organization command center totals, priority queue, changed Applications, notification problems, recommendations, time-window navigation, and typed investigation links.
- `application-attention-guidance`: Application-level release comparison, discovery totals, priority items, and deterministic recommendations that replace the disabled Recommendations placeholder.

### Modified Capabilities

- `tenant-navigation`: Change the authenticated root from a simple Organization introduction into the Organization attention command center and add attention-aware Application overview navigation while retaining the existing tenant hierarchy and deep links.

## Impact

- Regenerates `src/shared/api/schema.d.ts` from the updated backend OpenAPI contract and adds generated-type-backed attention queries and cache keys.
- Changes the root Organization route and the Application overview presentation, plus shared routing helpers for typed attention resource references.
- Extends English and Russian localization, responsive styling, accessible status presentation, unit/component tests, and Playwright journeys.
- Depends on the implemented but not yet deployed `getOrganizationAttentionSummary` and `getApplicationAttentionSummary` API operations; no new frontend dependency or breaking route change is required.
