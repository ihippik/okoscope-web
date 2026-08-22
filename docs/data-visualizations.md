# Runtime data visualizations

Okoscope visualizes recorded runtime observations to help operators compare activity. A percentage is never a duration, byte volume, configured intent, prevalence across time, anomaly score, or risk score.

## Denominators

- Application activity kind share: the kind's `occurrence_count` divided by the complete filtered Runtime Inventory summary `occurrence_count`.
- Top behavior share: the entry's `occurrence_count` divided by the distribution response's `total_occurrence_count`.
- Rounded percentages are displayed independently and are not adjusted to force a total of 100%. Exact counts and the denominator remain visible.
- Runtime Diff bars compare absolute occurrence-count deltas. They do not display percentages.

## Inventory distribution API

`GET /api/v1/projects/{project_id}/applications/{application_id}/runtime-inventory/distribution`

The operation requires `kind`, accepts the same release, Kubernetes, observation-time, and search scope as the inventory summary, and accepts `limit` from 1 through 10 (default 5). The backend orders entries by `occurrence_count` descending and then opaque `identity_token` ascending. Returned top entries plus `other` account for the complete filtered totals; clients must not aggregate cursor pages.

Each entry contains a typed inert `semantic_summary` and a server-issued `identity_token`. Passing that token to the Runtime Inventory list selects the exact typed identity without parsing or reflecting identity fields into query syntax. Tokens are opaque and limited to the normalized scope understood by the backend.

## Runtime Diff summary API

`GET /api/v1/projects/{project_id}/applications/{application_id}/releases/{target_id}/runtime-diff/summary`

The operation accepts the optional `baseline_id` and a bounded `limit` from 1 through 10 (default 5). It returns complete `new`, `disappeared`, and `unchanged` totals plus entries ranked by absolute occurrence-count delta. Its result is independent of Runtime Diff cursor pagination. New and disappeared entries use zero on the unobserved side for delta calculation while retaining their classification.

## Presentation and accessibility

Visualizations use labelled semantic HTML with decorative CSS bars. Every entry exposes identity, exact count, percentage or signed delta, direction, and classification as text. Buttons are keyboard operable, have visible focus and selected states that do not rely on color, remain usable at narrow widths and zoom, and suppress nonessential transitions under reduced-motion preferences. Observed strings remain inert and are never interpreted as HTML, Markdown, or automatic links.

## Operational limits

The contract fixes top-N at a default of 5 and maximum of 10 to bound payload and rendering cost. Backend owners must validate aggregate query latency, deterministic ordering, ownership enforcement, and full-scope correctness on representative high-cardinality production data before deployment. Until backend performance evidence exists, the UI contract alone must not be interpreted as approval for unrestricted aggregate queries.

## Deployed development verification

Verified against `https://okoscope.com` service commit `a270f88385ded5f81d067dfbeac4dc14da9dbe30`, database migration 9, on 2026-08-20.

- Runtime Inventory summary: 46 identities and 367 observations. All four distribution totals matched the corresponding complete summary totals; top entries plus `other` matched both item and occurrence totals. The empty Syscall distribution returned zero totals, no entries, and `other: null`.
- Limits 0 and 11 returned HTTP 400 `invalid_request`; limit 1 and limit 10 returned bounded results.
- A server-issued Process identity token selected exactly the matching `dig` identity. A token with trailing or otherwise modified content returned HTTP 400 `invalid_identity_token`.
- Runtime Diff summary returned 47 identities: 44 new, 2 disappeared, and 1 unchanged. Classification totals summed to the complete total and ranked entries used zero baseline counts for new behavior.
- Twenty sequential Domain distribution requests with limit 10 produced a response of approximately 11,443 bytes: mean 211 ms, p50 111 ms, p95 525 ms, maximum 660 ms.
- Twenty sequential Runtime Diff summary requests with limit 10 produced a response of approximately 4,679 bytes: mean 152 ms, p50 91 ms, p95 356 ms, maximum 555 ms.

These measurements are deployment smoke evidence, not a high-cardinality capacity result: the available development dataset contains only 46 inventory identities and 47 diff identities. Query-plan and p99 evidence on a representative high-cardinality dataset remains a backend release requirement.
