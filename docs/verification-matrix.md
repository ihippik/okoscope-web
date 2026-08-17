# MVP verification matrix

| Capability scenario                                                                     | Verification                                                                  |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Valid and invalid runtime API configuration                                             | `runtime-config.test.ts`, Playwright configuration test, container smoke test |
| Generated OpenAPI contract freshness and nullable/composed types                        | `npm run api:check`, compile-time fixtures in `types.ts`                      |
| Compatible, incompatible, unreachable, and malformed build info                         | `client.test.ts`, Playwright compatibility and malformed-response tests       |
| Ephemeral bearer credential and 401 reset                                               | `session.test.ts`, `client.test.ts`, Playwright rejected-credential test      |
| Correlated API/network failures                                                         | `client.test.ts`, Playwright error tests                                      |
| Organization, Project, Application hierarchy and deep links                             | Playwright primary journey                                                    |
| Empty collections, null timestamps, and scoped links                                    | `lists.test.tsx`                                                              |
| Cursor pagination without duplicate items                                               | query implementation plus Playwright pagination journey                       |
| Keyboard semantics, focus, labels, and document titles                                  | component semantics plus Playwright and axe checks                            |
| Immutable runtime-configured image, health, cache policy, SPA fallback, invalid startup | `scripts/container-smoke.sh`                                                  |
