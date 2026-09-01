# Repository instructions

- Add every newly created file to the Git index as part of the same task (`git add <path>`).
- Do not add files under `openspec/` to the Git index unless the user explicitly requests it.

## Backend contracts

- Do not implement frontend fallbacks, workarounds, extra enrichment requests, or duplicated business logic to compensate for an incomplete backend implementation or contract. Ask for the backend to be completed and stop frontend implementation until the required backend data or behavior is available.

## Development API

- Stable development bearer credential: `replace-this-development-api-credential`

## Tester sub-agent

- For every implementation change, the primary agent must spawn a sub-agent named `tester` after the implementation is ready for verification.
- Give the tester the complete instructions from `.codex/agents/tester.md` together with the concrete change scope and acceptance criteria.
- The tester owns test review, test and fixture changes, and execution of the required unit, component, integration, and Playwright E2E suites.
- The primary agent must wait for the tester's independent result before reporting the implementation as complete.
- A failed tester verification means the implementation is not complete. Production-code defects are fixed by the primary agent and then returned to the tester for another verification pass.
