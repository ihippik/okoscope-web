## 1. Contract and types

- [x] 1.1 Add file activity inventory, semantic summary, and payload schemas to the checked-in OpenAPI contract
- [x] 1.2 Regenerate TypeScript API declarations and export file activity types and compile-time fixtures

## 2. Runtime Inventory

- [x] 2.1 Add `file_activity` navigation, URL parsing, filters, search copy, and backward-compatible empty behavior
- [x] 2.2 Add safe file identity/path/replacement presentation with explicit syscall-path and aggregation help
- [x] 2.3 Preserve release, group, occurrence, scope, and pagination navigation for file inventory items

## 3. Groups, Occurrences, and Release Diff

- [x] 3.1 Present file semantic summaries in runtime group list/detail with safe unknown fallback
- [x] 3.2 Present create, modify, delete, and rename occurrence payloads using only contracted fields
- [x] 3.3 Present backend-classified file activity in release diff without client identity calculations

## 4. Verification

- [x] 4.1 Add unit/component coverage for all operations, replacement states, long/special paths, optional fields, unknown kinds, filters/search, navigation, diff states, and telemetry exclusion
- [x] 4.2 Update E2E/contract fixtures and cover inventory-to-group-to-occurrence navigation
- [x] 4.3 Run formatter, lint, typecheck, API generation check, unit/component tests, build, and available E2E tests
