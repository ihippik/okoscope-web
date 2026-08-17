# Okoscope Web UI

Operator-facing React UI for Okoscope. The MVP verifies backend compatibility and provides Organization → Projects → Applications navigation.

## Local development

Requirements: Node.js 22 and npm 10.

```sh
npm ci
npm run dev
```

`public/config.js` configures the local API base URL. Its default `/` is same-origin; use an absolute backend URL when the backend allows the UI's exact origin through CORS. The browser sends bearer authentication through the `Authorization` header. Credentials exist only in memory and must be re-entered after reload.

## OpenAPI contract

Generated TypeScript is committed at `src/shared/api/schema.d.ts`. The source contract is the backend repository's `openapi/okoscope-v1.yaml`; locally it defaults to `/Users/ihippik/RustroverProjects/okoscope/openapi/okoscope-v1.yaml` and can be overridden:

```sh
OKOSCOPE_OPENAPI_SOURCE=/path/to/okoscope-v1.yaml npm run api:generate
OKOSCOPE_OPENAPI_SOURCE=/path/to/okoscope-v1.yaml npm run api:check
```

`api:check` fails on generated drift when the source is available. In isolated frontend CI, it verifies that committed generated output is present; release automation should provide the backend contract artifact through `OKOSCOPE_OPENAPI_SOURCE` for cross-repository drift detection.

## Verification

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

The quality gate includes formatting, linting, strict type checking, contract freshness, Vitest, Playwright, and the production build.

## Production image

```sh
docker build --build-arg OKOSCOPE_WEB_GIT_COMMIT="$(git rev-parse HEAD)" -t okoscope-web:local .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp:rw,noexec,nosuid,size=32m -e OKOSCOPE_API_BASE_URL=https://api.example.com okoscope-web:local
```

`OKOSCOPE_API_BASE_URL` accepts a same-origin path or an absolute HTTP(S) URL without credentials. `config.js` and `index.html` are not cached; hashed assets are immutable. `/healthz` is the health endpoint and client-side deep links use SPA fallback.

Prefer a same-origin deployment with `/api` reverse-proxied to the backend. For a separate origin, configure the backend's exact CORS allowlist entry for the UI origin; wildcard and credentialed CORS are intentionally unsupported.

Build and run the container smoke suite:

```sh
docker build -t okoscope-web:smoke .
npm run container:smoke
```

Images should be published by immutable digest with OCI version/commit labels added by release automation. Roll back by restoring the previous image digest; the Web UI performs no database migrations.
