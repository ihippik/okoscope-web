## ADDED Requirements

### Requirement: Policy attention facts are visible

The Application Requires attention page SHALL present backend-provided policy attention totals as observed-action facts, including factual total, actionable total, expected, requires review, unclassified, policy conflict, and evaluation pending.

#### Scenario: Policy facts are available

- **WHEN** the Application attention summary loads successfully
- **THEN** the page displays every policy total from the same attention snapshot
- **AND** identifies the factual and actionable totals separately from the verdict breakdown

#### Scenario: Policy facts are all zero

- **WHEN** every backend-provided policy total is zero
- **THEN** the policy attention section remains understandable and does not claim that policy data is unavailable

### Requirement: Policy attention wording is bounded

The page SHALL describe policy classifications as application intent and operational review state, and MUST NOT present expected, actionable, unclassified, or conflict totals as objective cause, severity, or security risk.

#### Scenario: User reads policy guidance

- **WHEN** the policy attention section is displayed
- **THEN** supporting text explains that policies prioritize review without deleting observed facts or establishing risk

### Requirement: Policy fact categories link to reviewable observations

The page SHALL link policy categories to Runtime Groups using canonical URL filters supported by the backend contract and existing URL state.

#### Scenario: User opens observations requiring review

- **WHEN** the user activates the requires-review category
- **THEN** navigation opens Runtime Groups with `verdict=requires_review` and `suppressed=false`

#### Scenario: User opens policy conflicts

- **WHEN** the user activates the policy-conflict category
- **THEN** navigation opens Runtime Groups with `verdict=policy_conflict` and `suppressed=false`

#### Scenario: User opens unclassified observations

- **WHEN** the user activates the unclassified category
- **THEN** navigation opens Runtime Groups with `verdict=unclassified` and `suppressed=false`

#### Scenario: User opens pending evaluations

- **WHEN** the user activates the evaluation-pending category
- **THEN** navigation opens Runtime Groups with `evaluation_pending=true`

#### Scenario: User inspects expected observations

- **WHEN** the user activates the expected category
- **THEN** navigation opens Runtime Groups with `verdict=expected`

### Requirement: Backend-provided policy recommendations have specific presentation

The page SHALL recognize the documented policy reason codes `policy_review_required`, `policy_conflict`, `policy_unclassified`, and `policy_evaluation_pending` in backend-provided recommendations and priority items.

#### Scenario: Policy recommendation is returned

- **WHEN** the backend returns an attention recommendation with a policy reason code
- **THEN** the page displays localized policy-specific explanation text and the backend-provided count
- **AND** does not fall back to generic open-discovery wording

#### Scenario: Policy priority item is returned

- **WHEN** the backend returns a priority item with a policy reason code
- **THEN** the priority queue displays the corresponding localized policy-specific explanation

### Requirement: Policy recommendation destinations are deterministic

The page SHALL derive navigation only from the backend-provided resource reference and documented policy reason code.

#### Scenario: Application policy recommendation is actionable

- **WHEN** a policy recommendation references an Application resource
- **THEN** its action opens Runtime Groups with the filter corresponding to its policy reason code

#### Scenario: Exact Runtime Group is provided

- **WHEN** a policy recommendation or priority item references a Runtime Group resource
- **THEN** its action opens that exact Runtime Group

#### Scenario: Policy recommendation lacks a supported destination

- **WHEN** a policy item has no supported resource reference
- **THEN** the page shows that the action is unavailable and does not guess a destination

### Requirement: Frontend does not synthesize policy recommendations

The frontend MUST NOT create policy recommendations, priority, actionable state, or classifications from policy totals or raw observation data.

#### Scenario: Totals exist without a recommendation

- **WHEN** policy attention totals are nonzero and the backend returns no policy recommendation
- **THEN** the page displays the totals
- **AND** does not add a generated recommendation

### Requirement: Policy attention presentation is localized and accessible

The policy attention section and policy-specific recommendation copy SHALL be available in English and Russian and SHALL preserve semantic headings, keyboard navigation, visible focus, and narrow-viewport usability.

#### Scenario: Russian locale is active

- **WHEN** the user views the Application Requires attention page in Russian
- **THEN** policy facts, explanations, actions, and reason text contain no untranslated English UI copy

#### Scenario: Keyboard and narrow viewport

- **WHEN** the page is used by keyboard at a narrow supported viewport
- **THEN** every policy category action remains reachable, named, visible, and free of horizontal page overflow
