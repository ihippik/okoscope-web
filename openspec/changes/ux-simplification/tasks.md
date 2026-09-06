## 1. Product Vocabulary and Presentation Model

- [x] 1.1 Define centralized English and Russian message keys for Application Activity, Process launches, Network activity, Connections, Domains, New discoveries, Changes after release, Observation history, and Technical details
- [x] 1.2 Add typed mappings from inventory and event kinds to contextual item, action, and observation-count labels with safe unknown-kind fallbacks
- [x] 1.3 Extend localization catalog guards and unit tests to cover navigation, headings, controls, states, accessibility labels, and document titles in both locales

## 2. Application Overview and Navigation

- [x] 2.1 Redesign the Application overview to explain that Okoscope shows process launches, network activity, and changes after releases
- [x] 2.2 Replace primary Runtime Groups and Runtime Inventory actions and aggregates with Processes, Network, New discoveries, Releases, and release-change entry points while preserving existing route targets
- [x] 2.3 Verify breadcrumbs, document titles, keyboard focus, responsive layout, and direct/reload navigation for the revised Application entry points

## 3. Application Activity

- [x] 3.1 Present the existing runtime inventory route as Application Activity with Processes and Network as the primary areas
- [x] 3.2 Implement the Processes view with `kind=process`, contextual launch labels, existing filters, summary, pagination, and typed inert identity rendering
- [x] 3.3 Implement Network as separate Connections (`kind=destination`) and Domains (`kind=domain`) views with independent API state and pagination and no fabricated combined unique total
- [x] 3.4 Move Syscalls into progressively disclosed Technical details while preserving filtering, deep links, and typed inert identity rendering
- [x] 3.5 Update search, filter, loading, empty, error, invalid-cursor, stale, and detail copy to the new activity vocabulary without changing query semantics
- [x] 3.6 Update inventory component, URL-state, query, and accessibility tests for Processes, Network subsections, Technical details, filter preservation, and narrow viewports

## 4. Discoveries and Observation History

- [x] 4.1 Present Runtime Groups collection and detail routes as New discoveries with neutral explanatory copy and user-facing behavior labels
- [x] 4.2 Replace generic occurrence terminology with contextual observation counts while preserving lifecycle status, evidence, filters, and cursor behavior
- [x] 4.3 Restructure occurrence content as Observation history with time, activity, location, and release context before progressively disclosed raw event kind and JSON payload
- [x] 4.4 Update discovery and occurrence unit and end-to-end tests for neutral language, recent-first-seen treatment, inert content, deep links, and accessibility

## 5. Release Changes

- [x] 5.1 Present Runtime Diff routes and links as Changes after release while retaining baseline, target, cursor, ownership, and API behavior
- [x] 5.2 Map classifications to New, No longer observed, and Still observed with evidence-qualified guidance that avoids absence, safety, incident, or severity claims
- [x] 5.3 Update comparison loading, no-baseline, empty, error, entry, breadcrumb, document-title, unit, and end-to-end surfaces in both locales

## 6. Verification

- [x] 6.1 Run formatting, linting, type checking, and the complete unit test suite and resolve regressions without weakening existing API or ownership guarantees
- [x] 6.2 Run targeted and full end-to-end suites at wide and narrow viewports in English and Russian
- [x] 6.3 Audit all Application observability surfaces for remaining primary user-facing Runtime, Inventory, Group, Diff, Direction, Occurrence, and Evidence jargon and retain such terms only where explicitly marked as technical details
- [x] 6.4 Confirm no backend contract, generated schema, internal route, cursor, or query parameter was changed and document future API enhancements separately from this implementation
