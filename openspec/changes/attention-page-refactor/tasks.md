## 1. URL State and Test Foundation

- [x] 1.1 Add typed Application attention section parsing for `overview`, `recommendations`, and `priority`, defaulting missing or invalid values to Recommendations.
- [x] 1.2 Add unit tests for valid, missing, and invalid section state plus browser back/forward restoration expectations.
- [x] 1.3 Add English and Russian localization keys for Overview, tab labels with counts, and the Priority queue empty state.

## 2. Accessible Tab Navigation

- [x] 2.1 Implement the three-tab shell with semantic `tablist`, `tab`, `tabpanel`, selected state, labelled relationships, and roving focus.
- [x] 2.2 Implement Left, Right, Home, and End keyboard behavior that updates focus, URL state, and the active panel consistently.
- [x] 2.3 Display bounded recommendation and priority array lengths in their tab labels while leaving Overview uncounted.

## 3. Section Composition

- [x] 3.1 Move Observed actions and Policy classification into the Overview panel without changing their facts, links, or backend query boundary.
- [x] 3.2 Move the existing Recommendation list and empty state into the Recommendations panel and make it the deterministic default.
- [x] 3.3 Move the existing server-ranked Priority queue into its panel and add a localized empty state without reordering or synthesizing items.
- [x] 3.4 Ensure only the active panel is mounted and switching panels preserves cached snapshot and supporting-query behavior.

## 4. Responsive and Regression Verification

- [x] 4.1 Add component tests for tab semantics, counts, defaulting, empty panels, localization, keyboard navigation, and preservation of backend ordering.
- [x] 4.2 Add end-to-end tests for direct section links, reload, back/forward navigation, Russian UI, and 375-pixel layout without document overflow.
- [x] 4.3 Run formatting, lint, type checking, unit tests, focused Playwright tests, accessibility checks, and the production build; fix regressions within scope.
