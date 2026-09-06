## 1. Contract and Data Layer

- [x] 1.1 Regenerate `src/shared/api/schema.d.ts` from the local backend OpenAPI contract and verify the Organization/Application attention operations, discriminated resource references, enums, query parameters, and response types
- [x] 1.2 Export the generated attention response and component aliases needed by presentation code without introducing handwritten transport types
- [x] 1.3 Add normalized Organization and Application attention query keys/options with contract-bounded constants, stable cache identity, and previous-snapshot preservation
- [x] 1.4 Add generated-contract-shaped Organization and Application fixtures covering populated, all-clear, unavailable-comparison, hostile-text, and boundary-count responses
- [x] 1.5 Add query and API contract-regression tests for default/custom windows, exact paths and parameters, protected requests, and response decoding failures

## 2. URL and Safe Navigation

- [x] 2.1 Add validated root search parsing for `24h` and `7d`, default invalid/absent values to `24h`, and cover direct links and window changes with tests
- [x] 2.2 Implement an exhaustive pure resource-reference routing adapter for Project, Application, Runtime Group, and Runtime Diff variants, including baseline search preservation
- [x] 2.3 Define action-context routing for notification configuration/history and broad Project/Application references without accepting backend-provided URLs
- [x] 2.4 Test every supported resource/action combination, ownership identifier propagation, unknown-reference fail-closed behavior, and inert hostile display values

## 3. Shared Attention Presentation

- [x] 3.1 Add typed English and Russian catalog entries for attention metrics, windows, priorities, item/reason kinds, recommendations, actions, explanations, timestamps, loading, empty, error, and stale states
- [x] 3.2 Implement shared priority, reason/fact, snapshot-time, recommendation-action, and evidence-qualified release-comparison presentation helpers/components
- [x] 3.3 Ensure operational priority uses text plus non-color-only treatment and add copy assertions prohibiting risk, incident, vulnerability, deletion, and AI-advice claims
- [x] 3.4 Add component tests for all enum variants, plural/count formatting, missing optional facts, long untrusted values, locale switching, keyboard focus, and accessible names

## 4. Organization Command Center

- [x] 4.1 Replace the authenticated root introduction with Organization identity, Requires attention heading, generated time, and a URL-backed 24-hour/7-day window control while retaining Project navigation
- [x] 4.2 Implement exact summary metric cards and truthful section navigation without linking Organization totals to misleading partial Application collections
- [x] 4.3 Implement the bounded priority queue with Project/Application context, localized explanations, safe typed actions, and an explicit bounded-result label
- [x] 4.4 Implement deterministic recommended-action presentation that preserves server order and remains visually distinct from priority events
- [x] 4.5 Implement changed-Application comparison highlights with baseline/target context, exact classifications, bounded largest changes, and links to exact Runtime Diff routes
- [x] 4.6 Implement Project-scoped notification-problem summaries with health facts, observation time, and safe links to Notifications/destination management
- [x] 4.7 Implement a positive all-clear state that suppresses empty warning panels and keeps Project exploration available
- [x] 4.8 Implement stable initial loading, correlated initial error, retained stale-snapshot refresh failure, and manual retry states without substituting zero totals
- [x] 4.9 Simplify the Organization landing hierarchy to summary metrics plus one concrete recommendation list, removing duplicated detail sections after user review

## 5. Application Attention Guidance

- [x] 5.1 Load Application attention independently on the existing overview and validate returned Project/Application ownership against route parameters before rendering
- [x] 5.2 Replace the disabled Recommendations Coming soon placeholder with actionable recommendations or a neutral no-action-needed state
- [x] 5.3 Add compact discovery totals, priority guidance, and evidence-qualified release comparison linked to the exact existing investigation routes
- [x] 5.4 Keep Application identity, activity, discovery, release, and worker workflows usable when the attention request is pending or fails, with a region-scoped correlated retry state
- [x] 5.5 Remove the duplicated Application priority queue and release-comparison section after user review, retaining compact totals and recommendations
- [x] 5.6 Add Requires attention as the fourth Application workflow card and move the scoped summary to a dedicated route with more specific metric and recommendation context
- [x] 5.7 Add evidence-qualified deleted-file counts and outbound-internet facts with snapshot-bounded investigation links
- [x] 5.8 Add newly observed inbound ports, largest bounded activity increase, and a tested green-to-red event-volume scale

## 6. Responsive, Accessibility, and Integration Verification

- [x] 6.1 Implement wide and narrow semantic layouts with summary cards, priority queue, recommendation rail, changed Applications, and notification problems stacking without horizontal page scrolling
- [x] 6.2 Verify heading hierarchy, landmarks, lists, `time` semantics, keyboard order, visible focus, non-color status communication, live/stale announcements, and reduced-motion behavior
- [x] 6.3 Add routed tests for all-clear, populated, initial failure, stale refresh, invalid window, unavailable release comparison, unsupported resource action, and attention/API ownership mismatch states
- [x] 6.4 Add Playwright journeys for English and Russian Organization triage, window deep links, Runtime Group/Runtime Diff/Notifications actions, Application recommendations, browser Back, and narrow viewport operation
- [x] 6.5 Run format check, lint, typecheck, OpenAPI drift check, unit/component tests, Playwright tests, production build, and local-backend smoke verification; document any backend deployment ordering constraint
