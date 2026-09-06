## Why

The Application overview does not show which Linux kernels back the workers that have observed the Application, leaving operators without platform context needed during runtime investigation. The backend now publishes a bounded Application worker collection with heterogeneous and nullable kernel metadata, so the Web UI can expose that information without inventing a single Application-level kernel.

## What Changes

- Add a worker-platform section to the Application overview that lists each observed worker's Cluster, node, Linux kernel release, architecture, and observation recency.
- Preserve heterogeneous worker values, render unavailable platform metadata explicitly, and avoid inferring online status, Linux distribution, vulnerability state, support, or eBPF compatibility.
- Load and paginate worker data independently so failures do not replace otherwise usable Application details.
- Synchronize the backend OpenAPI contract and generated TypeScript declarations for Application worker discovery.
- Raise the minimum compatible backend database migration from 7 to 12 so every admitted backend provides the worker endpoint and platform metadata storage contract.
- Localize all new operator-facing states in English and Russian.

## Capabilities

### New Capabilities

- `application-worker-platform-visibility`: Defines bounded, localized display of worker identity, Linux kernel metadata, architecture, observation timestamps, pagination, and isolated loading, empty, and error states on the Application overview.

### Modified Capabilities

- `api-client-foundation`: Adds generated Application worker discovery queries and raises the required backend database migration to 12.

## Impact

- Affects the Application overview route, shared API query definitions and generated types, localization catalogs, compatibility tests, component tests, and browser coverage.
- Consumes `GET /api/v1/projects/{project_id}/applications/{application_id}/workers` from the backend OpenAPI contract.
- Requires a backend reporting API version `v1` with required database migration 12 or newer.
- Introduces no mutation, credential persistence, or client-side platform inference.
