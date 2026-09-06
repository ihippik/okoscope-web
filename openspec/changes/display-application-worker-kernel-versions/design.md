## Context

The Application overview currently loads only Project and Application summaries. The backend now exposes an authenticated, cursor-paginated worker collection at `GET /api/v1/projects/{project_id}/applications/{application_id}/workers`. Each item represents one agent-backed node with current reported platform metadata and the time bounds in which that worker produced accepted runtime-event evidence for the Application.

An Application can span multiple Clusters and nodes with different kernels and architectures. Platform fields are nullable for legacy agents and rows. The endpoint does not assert that a worker is online, and reported strings are untrusted display data. The Web UI already has generated OpenAPI types, normalized API failures, infinite-query pagination, responsive cards and tables, and English/Russian localization patterns.

## Goals / Non-Goals

**Goals:**

- Show every returned worker without collapsing heterogeneous kernels into one Application value.
- Keep the Application overview usable while worker data loads or fails.
- Distinguish Application observation recency from agent heartbeat recency.
- Use only generated contract types and bounded cursor pagination.
- Render nullable and reported values safely and consistently in English and Russian.
- Admit only backend deployments that guarantee migration 12 and the worker discovery contract.

**Non-Goals:**

- Determining whether a worker is online.
- Inferring Linux distribution, kernel support, vulnerabilities, or eBPF compatibility.
- Keeping or presenting kernel-upgrade history.
- Filtering, sorting, or searching workers client-side in the first version.
- Adding worker detail routes or mutations.

## Decisions

### Present workers as a collection on the Application overview

Add a dedicated "Worker nodes" section below the Application summary and before the navigation cards. Each entry shows Cluster, node, Linux kernel, architecture, and relative or formatted Application observation recency. Agent version and agent last-seen time remain available as secondary details so the primary surface stays scannable.

A responsive table is used at wider breakpoints and stacked worker cards at narrow breakpoints. Both representations preserve the same semantic labels and DOM text. A single Application-level kernel badge was rejected because simultaneous workers can legitimately disagree.

### Query workers independently with incremental cursor pagination

Define a generated-type-backed infinite query keyed by Project and Application identity, with credentials excluded from the cache key. Request a bounded initial page and append pages using the opaque `next_cursor` unchanged. The backend ordering by descending `last_observed_at` remains authoritative.

The worker query renders inside its own loading, empty, error, and background-refresh states. It does not participate in the route's blocking Project/Application load condition. Reusing the Application response or eagerly loading all pages was rejected because it would couple unrelated availability and weaken backend bounds.

### Treat platform and identity fields as inert text

Render `cluster_name`, `node_name`, `agent_version`, `architecture`, and `kernel_release` through ordinary text nodes with wrapping for long bounded values. Null platform values use an explicit localized "Not reported" label. No value becomes a link or HTML, and no parsing derives distribution or compatibility claims.

`last_observed_at` is labeled as Application activity. `agent_last_seen_at` is labeled as the last agent signal and MUST NOT produce an online/offline badge. `first_observed_at` is secondary detail. This preserves the backend's evidence semantics.

### Require backend migration 12

Update the startup compatibility threshold from database migration 7 to 12. Although the endpoint could be treated as optional on older `v1` deployments, doing so would make the same frontend build expose inconsistent core functionality and reinterpret a tenant-safe `404` as feature negotiation. The existing Web UI already uses a strict minimum-migration compatibility gate, so raising that gate is the simpler and testable contract.

### Synchronize the backend contract before adding consumers

Copy the published backend OpenAPI snapshot containing `listApplicationWorkers`, regenerate committed declarations, and add compile-time fixtures for heterogeneous and nullable metadata. Production code must not define a parallel hand-written worker type.

## Risks / Trade-offs

- **A worker with old Application evidence may no longer run the Application** → Label timestamps as observation evidence, order by recency, and avoid current/online claims.
- **Current agent metadata can differ from metadata at historical event time** → Describe kernel and architecture as the worker's latest reported metadata; immutable per-event platform history remains out of scope.
- **Large worker sets increase page height** → Fetch bounded pages incrementally and expose an explicit localized load-more action.
- **Worker request failure could obscure useful Application data** → Isolate the query and retry control within the worker section.
- **Raising the migration gate blocks the whole Web UI against older backends** → Show the existing compatibility diagnostic with expected migration 12; deploy backend migration before the new Web build and roll back the Web build if necessary.
- **Long or hostile platform strings could damage layout or safety** → Rely on backend bounds, render inert text, and apply wrapping without URL or markup interpretation.

## Migration Plan

1. Deploy backend migration 12 and the worker endpoint before deploying this Web build.
2. Synchronize and regenerate the frontend OpenAPI declarations.
3. Raise the compatibility constant and its tests to migration 12.
4. Deploy the worker section and verify heterogeneous, nullable, empty, paginated, and failure states.
5. Roll back the Web build if necessary; the additive backend endpoint and nullable columns can remain deployed.

## Open Questions

None required for the initial implementation. Worker filtering and historical platform snapshots can be proposed separately if operational use demonstrates a need.
