## Context

The React application currently embeds English copy throughout route components, feature components, shared UI, startup failure handling, accessibility attributes, and `document.title` effects. Locale-sensitive formatting uses the browser default rather than an explicitly selected interface locale. The change is cross-cutting but remains entirely client-side and must work before credentials or runtime configuration are available.

## Goals / Non-Goals

**Goals:**

- Establish one typed localization boundary for all static interface wording.
- Support complete English and Russian dictionaries with safe dynamic-value interpolation.
- Make the language selectable throughout the application and persistent across visits.
- Keep accessibility metadata, page titles, dates, and numbers synchronized with the active language.
- Make missing translations and dictionary drift detectable in tests and development.

**Non-Goals:**

- Translating user-authored data or arbitrary text returned by the backend.
- Negotiating backend response languages or changing API contracts.
- Supporting languages other than English and Russian in this change.
- Translating product names, identifiers, URLs, commands, secrets, or log-like technical values.
- Introducing localized routes or language codes in URLs.

## Decisions

### Use a small in-repository localization layer

Create a shared localization module containing the supported locale type, English and Russian dictionaries, a provider, and hooks for translation and locale access. Static entries are strings; messages containing variables are dictionary functions that receive named values. This keeps full sentences in each language, lets Russian change word order, and avoids parsing ad-hoc template syntax.

The English dictionary is the canonical key and value-shape contract. TypeScript `satisfies` checks and focused tests enforce that Russian has the same keys and compatible message signatures. At runtime, lookup falls back to English if an active-locale entry is unavailable and reports the missing key in development.

Alternative considered: add a full i18n framework. The current two-language, client-only scope does not require namespaces loaded over the network, ICU catalogs, or server rendering, so a dependency would add configuration and migration cost without a demonstrated need. The dictionary API can be adapted later if pluralization or translation tooling outgrows the local layer.

### Mount localization above startup and routing

Mount the localization provider at the outer application boundary so the normal route tree, credential prompt, backend compatibility states, and runtime-configuration failure UI can all consume the same locale. Startup errors must be rendered through a localized component rather than hard-coded text in the bootstrap catch path.

The provider owns the active locale and synchronizes `document.documentElement.lang`. Components use localization hooks; they do not read browser language or storage directly.

Alternative considered: keep locale state inside the root route. That would leave configuration failures and other UI rendered before the router outside the localization boundary.

### Resolve and persist the locale defensively

On initialization, accept only `en` or `ru` from a dedicated local-storage key. With no valid saved value, inspect browser-preferred languages in priority order, choose Russian for a `ru` language tag, choose English for an `en` tag, and fall back to English when no supported language matches. Explicit selections are saved, while storage access is wrapped so privacy settings or storage failures never prevent rendering.

Alternative considered: always default to English. Browser detection gives first-time Russian users the intended experience while an explicit saved choice remains authoritative.

### Reuse the selected locale for human-readable formatting

Replace formatters that use an implicit locale with helpers or hooks that accept the active locale explicitly. Use `Intl.DateTimeFormat`, `Intl.NumberFormat`, and, where grammatically needed, `Intl.PluralRules`. Machine-oriented values remain unformatted.

Alternative considered: leave formatting on the browser default. That can produce Russian text with English date and number formats after a user explicitly selects Russian, or the reverse.

### Treat server content according to semantics

User-defined and diagnostic values pass through unchanged. Known enums, statuses, and structured API error codes map to dictionary keys at the presentation boundary. Unknown server errors receive a localized generic heading/message while any useful server-provided detail remains visible as technical detail rather than being mistaken for translated copy.

Alternative considered: translate raw server messages. Free-form text is not a stable translation key and string matching would be incomplete and fragile.

### Migrate by UI surface with guardrail tests

Introduce the localization infrastructure first, then migrate shared UI and root/startup states, followed by routes and feature areas. Tests receive a localization-aware render helper with an explicit locale so existing assertions remain deterministic. A source scan or lint-style test will guard against newly embedded user-facing phrases, with narrowly documented exclusions for non-UI constants and test fixtures.

### Translate complete messages, never substrings

Translation lookup operates on complete UI messages. It MUST NOT replace arbitrary English words inside rendered text because that creates mixed-language phrases and can alter runtime data. Parameterized messages are matched as complete templates and only their named runtime values are preserved. The compatibility DOM translator introduced during the first implementation is removed once all component surfaces use the catalog.

## Risks / Trade-offs

- [A custom layer may become insufficient for complex pluralization] → Keep full dynamic messages in dictionary functions and use `Intl.PluralRules`; reevaluate an ICU-capable library before adding more languages.
- [A broad text migration can miss accessibility or rare error copy] → Inventory visible text, attributes, titles, announcements, and conditional branches; add coverage and a hard-coded-copy guardrail.
- [Tests coupled to English copy may fail extensively] → Add locale-explicit test providers and update assertions surface by surface rather than weakening semantic checks.
- [English fallback can conceal an incomplete Russian dictionary] → Enforce compile-time shape parity and tests; retain runtime fallback only as a resilience measure.
- [Persisted browser state can make tests nondeterministic] → Allow provider initialization with an explicit locale and reset the preference key in shared test setup.

## Migration Plan

1. Add the localization contract, dictionaries, locale resolution/persistence, provider, formatting helpers, and focused unit tests.
2. Mount the provider above bootstrap UI and migrate shared components, root navigation, startup states, and the language selector.
3. Migrate route and feature surfaces, including titles, accessibility text, status mappings, and dynamic messages.
4. Update component and end-to-end tests, add dictionary parity and hard-coded-copy guardrails, and run the full project checks.
5. Deploy as a client-only change with English-compatible initial behavior for non-Russian browsers. Rollback consists of reverting the frontend release; the persisted preference is harmless to older versions.

## Open Questions

None. The implementation can proceed with English as the canonical fallback, browser-derived initial selection, and an explicit persisted user preference.
