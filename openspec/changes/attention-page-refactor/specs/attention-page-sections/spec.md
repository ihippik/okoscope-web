## ADDED Requirements

### Requirement: Application attention content is divided into three tabs

The Application Requires attention page SHALL expose Overview, Recommendations, and Priority queue as its top-level content tabs and SHALL display only the selected tab panel.

#### Scenario: User opens Overview

- **WHEN** Overview is selected
- **THEN** the panel contains Observed actions and Policy classification
- **AND** Recommendations and Priority queue content is not rendered in the active panel

#### Scenario: User opens Recommendations

- **WHEN** Recommendations is selected
- **THEN** the panel contains the existing backend-provided recommendations and their existing empty state

#### Scenario: User opens Priority queue

- **WHEN** Priority queue is selected
- **THEN** the panel contains the existing backend-ranked priority items and an understandable empty state when none were returned

### Requirement: Recommendations is the deterministic default

The page SHALL select Recommendations when section state is absent or invalid and MUST NOT choose a tab from attention priority, urgency, counts, or policy classification.

#### Scenario: Existing link has no section

- **WHEN** the user opens an Application attention URL without `section`
- **THEN** Recommendations is selected

#### Scenario: Section value is invalid

- **WHEN** the user opens an Application attention URL with an unsupported `section` value
- **THEN** Recommendations is selected without displaying an error page

#### Scenario: Urgent queue items exist

- **WHEN** the snapshot contains urgent priority items and the URL has no section
- **THEN** Recommendations remains selected

### Requirement: Selected tab is URL-addressable

The page SHALL represent explicit tab selection with `section=overview`, `section=recommendations`, or `section=priority` in validated route search state.

#### Scenario: User selects a tab

- **WHEN** the user activates a different tab
- **THEN** the URL records the selected section
- **AND** reload restores the same panel

#### Scenario: User navigates browser history

- **WHEN** the user selects multiple tabs and then uses Back or Forward
- **THEN** the selected panel follows the restored URL state

#### Scenario: User opens a shared section link

- **WHEN** the user opens a valid URL containing a section value
- **THEN** the corresponding tab and panel are selected directly

### Requirement: Tab labels expose bounded item counts

The Recommendations and Priority queue tabs SHALL display the length of their respective backend-provided snapshot arrays, while Overview SHALL NOT display a combined count.

#### Scenario: Snapshot contains recommendations and priority items

- **WHEN** the tab list is rendered
- **THEN** Recommendations displays `recommendations.length`
- **AND** Priority queue displays `priority_items.length`
- **AND** the labels do not describe those bounded array lengths as organization-wide totals

#### Scenario: A counted section is empty

- **WHEN** a recommendations or priority array is empty
- **THEN** its tab displays zero and remains selectable

### Requirement: Tabs follow accessible keyboard semantics

The tab control SHALL expose the WAI-ARIA tab relationships and SHALL support keyboard navigation with Left, Right, Home, and End.

#### Scenario: Screen reader inspects tabs

- **WHEN** the tab list is rendered
- **THEN** each tab exposes selected state and controls exactly one labelled tab panel

#### Scenario: User navigates with arrow keys

- **WHEN** keyboard focus is on a tab and the user presses Left or Right
- **THEN** focus and selection move to the previous or next tab with wrapping behavior
- **AND** the URL and active panel update consistently

#### Scenario: User presses Home or End

- **WHEN** keyboard focus is on a tab and the user presses Home or End
- **THEN** focus and selection move to the first or last tab respectively

### Requirement: Tab layout remains usable on narrow viewports

The tab list and active panel SHALL remain usable at supported narrow widths without document-level horizontal overflow.

#### Scenario: Mobile-width page

- **WHEN** the Application attention page is displayed at 375 CSS pixels wide
- **THEN** every tab remains reachable
- **AND** any horizontal scrolling is constrained to the tab-list container
- **AND** the active panel fits the document viewport

### Requirement: Existing attention semantics are preserved

The refactor MUST preserve backend authority, attention snapshot facts, policy classification, recommendation and priority ordering, destinations, localization, loading behavior, stale-snapshot behavior, and empty states.

#### Scenario: User switches sections

- **WHEN** the user moves between tabs
- **THEN** the frontend does not synthesize, reorder, merge, or deduplicate backend attention items
- **AND** no new enrichment endpoint is requested

#### Scenario: Russian locale is active

- **WHEN** any tab or panel is displayed in Russian
- **THEN** tab labels, counts, panel headings, and empty states contain no untranslated English UI copy
