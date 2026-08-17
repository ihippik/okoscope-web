# MVP verification matrix

| Capability scenario                                                                                  | Verification                                                                  |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Valid and invalid runtime API configuration                                                          | `runtime-config.test.ts`, Playwright configuration test, container smoke test |
| Generated OpenAPI contract freshness and nullable/composed types                                     | `npm run api:check`, compile-time fixtures in `types.ts`                      |
| Compatible, incompatible, unreachable, and malformed build info                                      | `client.test.ts`, Playwright compatibility and malformed-response tests       |
| Ephemeral bearer credential and 401 reset                                                            | `session.test.ts`, `client.test.ts`, Playwright rejected-credential test      |
| Correlated API/network failures                                                                      | `client.test.ts`, Playwright error tests                                      |
| Organization, Project, Application hierarchy and deep links                                          | Playwright primary journey                                                    |
| Empty collections, null timestamps, and scoped links                                                 | `lists.test.tsx`                                                              |
| Cursor pagination without duplicate items                                                            | query implementation plus Playwright pagination journey                       |
| Keyboard semantics, focus, labels, and document titles                                               | component semantics plus Playwright and axe checks                            |
| Immutable runtime-configured image, health, cache policy, SPA fallback, invalid startup              | `scripts/container-smoke.sh`                                                  |
| Migration 7 compatibility and notification operations                                                | `root-compatibility.test.ts`, compile-time fixtures, `npm run api:check`      |
| Runtime Group filters, first-seen detail, notification state, and bounded occurrences                | observability unit/component tests and Playwright first-seen journey          |
| Notification destinations, one-time secrets, delivery history/detail, confirmations, and request IDs | notification component tests and Playwright notification journey with axe     |
| Acknowledge, resolve confirmation, reopen, and cache invalidation                                    | lifecycle component/integration coverage and Playwright first-seen journey    |

## Production first-seen smoke fixture

Use these identifiers only for manual production verification against `https://okoscope.com/api`:

- Application: Payment API
- Project ID: `018f4f9c-3f9a-7de1-8000-000000000001`
- Application ID: `018f4f9c-3f9a-7de1-8000-000000000002`
- Runtime Group (`busybox`): `a2a69436-f722-48bf-acdd-436a0d678c7c` (at least three occurrences)
