## MODIFIED Requirements

### Requirement: Runtime Diff communicates classifications and evidence

The Runtime Diff SHALL separate and label entries as `NEW`, `DISAPPEARED`, or `UNCHANGED`, visually prioritize `NEW` without relying on color alone, display semantic summary and baseline/target occurrence counts, and link each entry to its Runtime Group Detail route. It SHALL additionally display server-derived complete classification totals and a bounded horizontal comparison of the largest absolute occurrence-count changes with baseline count, target count, and signed delta. The UI MUST NOT derive aggregate totals or rankings from the current diff page and MUST describe counts as recorded observations rather than duration, traffic, configured intent, or risk.

#### Scenario: Mixed classifications are returned

- **WHEN** a diff contains new, disappeared, and unchanged entries across one or more pages
- **THEN** every listed entry has the matching classification label and evidence, new behavior receives the primary emphasis, and aggregate classification totals represent the complete comparison

#### Scenario: Largest changes are displayed

- **WHEN** the aggregate contains ranked increases and decreases
- **THEN** the visualization identifies direction, baseline count, target count, signed delta, and typed behavior identity without relying on bar direction or color alone

#### Scenario: Operator follows a group link

- **WHEN** an operator activates a Runtime Diff entry's group link
- **THEN** navigation opens that group under the current Project and Application route context
