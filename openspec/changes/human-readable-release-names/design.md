## Context

The automatic Release discovery change models an Okoscope Application as its selected Kubernetes workload. An observed Release identity is the immutable ordered set of application and init-container image digests; Kubernetes revisions and deployment episodes remain separate concepts. Today the backend stores `sha256:<full release digest>` in `Release.version`, and the frontend therefore exposes a machine identifier as the main operator-facing label.

The frontend already presents the complete identity components in expandable technical details. Operators do not yet need automatic image-to-image comparison, but they need a compact name that can be scanned consistently across Release browsing, comparison, inventory, and occurrence evidence. There is no production Release data or external user compatibility requirement, so the new response contract can be strict and omit legacy fallback behavior.

This change depends on `auto-release`: that change must be archived before this delta is archived so the shared `release-runtime-comparison` requirement is applied in the intended order.

## Goals / Non-Goals

**Goals:**

- Give every Release a required backend-owned human-readable `display_name`.
- Keep `identity_digest` as the immutable technical identity for observed Releases.
- Use the same name in every frontend surface that identifies a Release.
- Keep the complete application/init image composition inspectable.
- Make missing or empty names a contract failure rather than a frontend fallback case.

**Non-Goals:**

- Computing which container changed between Releases.
- Selecting or presenting one container as the primary application container.
- Adding editable aliases or renaming workflows.
- Removing the manual Release API.
- Changing which containers contribute to observed Release identity.

## Decisions

### Add a distinct required display field

The API adds required `display_name` rather than repurposing `version`. `version` remains the submitted/manual or legacy machine-facing value where existing APIs require it; `identity_digest` remains canonical observed identity. This avoids conflating mutable presentation with immutable identity and allows the naming convention to evolve without changing Release equality.

Using the digest prefix directly as `version` was rejected because it is not sufficiently human-readable. Replacing `version` everywhere was rejected because it mixes manual version input, observed identity, and presentation semantics.

### Use a neutral workload-level naming convention

For an observed Release, the backend produces:

```text
<application name> · <image count> image(s) · <digest prefix>
```

For example:

```text
payment-api · 3 images · a81f4c2e
```

The Application name is used instead of choosing a “primary” container. Image count includes every application and init container contributing to Release identity. The digest prefix is the first eight lowercase hexadecimal characters of `identity_digest`; the full digest remains available separately. Singular/plural presentation can be represented as structured display metadata or a fully formatted backend string, but the API's `display_name` is authoritative.

For a manual Release, `display_name` is required at creation or deterministically set from the submitted version by the backend. Because this repository has no existing Release data, no nullable migration or frontend fallback is introduced.

### Make presentation consistency part of the contract

Release-shaped responses expose `display_name`. Release attribution embedded in inventory evidence and occurrences exposes `release_display_name` alongside the Release ID. The frontend uses these fields in cards, target/baseline context, selectors, filters, evidence lists, and occurrence timelines. It does not parse `identity_components`, shorten digests, or reconstruct names.

The backend remains responsible for providing the display field on every relevant response. If a response omits it, generated type validation/build compatibility fails; the UI does not silently substitute `version`, ID, or digest.

### Preserve full composition as technical evidence

The existing expandable image-component view remains available for observed Releases and continues to show category, container name, image reference/tag, and immutable image digest as returned by the backend. No image diff is derived in the browser.

## Risks / Trade-offs

- [Application names can change] → Treat `display_name` as presentation rather than identity; backend responses may recompute or update it without altering Release IDs or digests.
- [The same image set may be observed through more than one workload selector for one Application] → Use the Application name, not the first observed workload name, so naming does not depend on arrival order.
- [Eight digest characters are not globally collision-proof] → The prefix is only a visual discriminator; Release ID and full identity digest remain canonical and available in details.
- [Adding display fields to nested attribution broadens the API change] → Update the OpenAPI contract and generated frontend types first, then let strict typecheck enumerate every required fixture and consumer.
- [Overlapping OpenSpec changes modify the same Release requirement] → Archive `auto-release` first and validate this delta against the resulting main spec before archiving it.

## Migration Plan

1. Complete and archive `auto-release` before applying or archiving this change's shared delta spec.
2. Add the strict backend display-name contract and tests, including observed and manual creation/response paths plus nested Release attribution.
3. Synchronize frontend OpenAPI and regenerate TypeScript types.
4. Replace Release-facing `version` presentation with contract-provided display fields across all frontend surfaces.
5. Update localization, fixtures, focused tests, and the complete quality gate.

Rollback requires reverting backend and frontend contract changes together. No compatibility window or nullable fallback is planned because no persisted production Release data exists.

## Open Questions

None. Removing the manual Release API remains a separate future scope decision.
