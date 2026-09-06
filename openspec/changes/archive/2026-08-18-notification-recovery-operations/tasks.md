## 1. Contract foundation

- [x] 1.1 Add generated-schema aliases and query options for recovery commands, history, and detail
- [x] 1.2 Extend the shared API client with explicit safe request headers for idempotency keys

## 2. Recovery commands

- [x] 2.1 Add confirmed retry and cancel actions to delivery detail using server capability flags
- [x] 2.2 Add bounded bulk retry form and typed result feedback to notification history
- [x] 2.3 Invalidate health, delivery, and recovery queries after successful commands and present correlated conflicts

## 3. Recovery audit

- [x] 3.1 Add cursor-paginated and command-filtered recovery history with URL search state
- [x] 3.2 Add safe recovery operation detail with affected-delivery audit records
- [x] 3.3 Add recovery history/detail routes, breadcrumbs, document titles, and navigation entry points

## 4. Verification

- [x] 4.1 Add unit coverage for eligibility, idempotency headers, confirmations, conflicts, bulk limits, and pagination
- [x] 4.2 Add Playwright and axe coverage for retry, cancel, bulk retry, and recovery audit navigation
- [x] 4.3 Document recovery routes, idempotency, conflicts, filters, and sensitive-data boundaries
- [x] 4.4 Run formatting, lint, typecheck, contract generation check, unit tests, Playwright, build, and container smoke
