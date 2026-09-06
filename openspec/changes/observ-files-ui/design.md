## Context

Runtime Inventory, Runtime Groups, Occurrences, and Release Diff share generated OpenAPI unions and presentation helpers. File activity is a new experimental backend capability (`file.activity.syscall-path/v1`) whose paths are process-reported syscall arguments, not resolved filesystem identities. Rename replacement evidence is nullable, and modify observations are aggregated in fixed five-second windows.

## Goals / Non-Goals

**Goals:**

- Extend existing APIs, routes, filters, components, and navigation with minimal new surface area.
- Render file activity safely and accessibly, including long/untrusted paths and unknown variants.
- Preserve backend identity and release classification semantics.
- Remain useful when an older backend returns no file activity.

**Non-Goals:**

- Client-side path normalization, resolution, fingerprinting, or diff classification.
- Claims about inode, mount, host path, file contents, bytes written, canonical paths, every write, or instantaneous visibility.
- A new endpoint or client-side cache separate from existing runtime queries.

## Decisions

1. Extend the checked-in OpenAPI contract with discriminated file payloads and file semantic summaries, then regenerate `schema.d.ts`. This keeps the frontend contract-driven; handwritten parallel domain types were rejected because they drift.
2. Add shared file presentation components and narrow records by field/type guards. Known file shapes receive structured rendering; malformed or future variants receive a text/JSON fallback without throwing.
3. Use a reusable path value component with CSS truncation, a plain-text `title`, accessible description, and clipboard action. React text interpolation prevents HTML interpretation. Clipboard errors remain generic and never interpolate the path.
4. Continue forwarding the existing inventory `search` and `kind` parameters. Backend query behavior supplies operation/path/new-path search; no client-side filtering or normalization is introduced.
5. Release Diff continues to render server-returned entries and classifications. Ordered rename paths and replacement state are displayed but never recomputed as an identity.
6. Capability copy explicitly calls paths “process-reported paths” and describes five-second modify aggregation so counts cannot be mistaken for individual writes.

## Risks / Trade-offs

- [Experimental contract can evolve] → Keep unknown event fallback and structural guards, and isolate file-specific presentation.
- [Long or hostile path text can disrupt layout] → Truncate visually, preserve plain-text full value in tooltip/copy, and test special characters.
- [Nullable replacement evidence can be mistaken for false] → Map `true`, `false`, and absent/null to distinct replaced, not replaced, and unknown states.
- [Older backend omits the kind entirely] → Summary navigation treats missing counts as zero and existing activity remains unchanged.
- [Clipboard/telemetry errors could leak path data] → Use constant error/status messages and never pass path values to analytics or error-reporting APIs.

## Migration Plan

Ship the OpenAPI/type and UI changes together. No data migration is required. Rollback is a frontend rollback because existing backend responses and endpoints remain compatible.

## Open Questions

None blocking. The UI intentionally reflects only fields present in the checked-in experimental contract.
