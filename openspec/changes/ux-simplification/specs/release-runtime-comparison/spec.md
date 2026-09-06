## MODIFIED Requirements

### Requirement: Runtime Diff communicates classifications and evidence

The Web UI SHALL present Runtime Diff as Changes after release and SHALL label entries as `NEW` using “New”, `DISAPPEARED` using evidence-qualified “No longer observed”, and `UNCHANGED` using “Still observed”. It SHALL visually prioritize New without relying on color alone, explain that observed changes are not automatically problems, display semantic summary and baseline/target observation counts, and link each entry to its New discovery detail route. It MUST NOT describe `DISAPPEARED` as removed, impossible, or proven absent.

#### Scenario: Mixed classifications are returned

- **WHEN** a comparison page contains new, disappeared, and unchanged entries
- **THEN** every entry has the matching plain-language classification and evidence, with newly observed behavior receiving the primary emphasis

#### Scenario: Operator reviews comparison meaning

- **WHEN** Changes after release is displayed
- **THEN** the UI identifies the compared releases and explains that results describe observed behavior rather than confirmed application configuration or risk

#### Scenario: Operator follows a discovery link

- **WHEN** an operator activates a comparison entry's discovery link
- **THEN** navigation opens that group under the current Project and Application route context
