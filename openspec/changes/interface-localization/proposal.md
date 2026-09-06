## Why

The web interface currently exposes English text directly from React components, which prevents Russian-speaking users from using the product in their preferred language and makes additional languages difficult to add consistently. The interface needs a single localization mechanism so all user-facing static wording can be translated while dynamic values remain intact.

## What Changes

- Add English and Russian interface dictionaries with interpolation for dynamic values.
- Route all user-facing static text, including navigation, forms, status and error states, accessibility labels, and document titles, through the localization layer.
- Add a language selector to the site menu and make language selection available on pre-session and startup screens.
- Select an initial language from a saved preference or the browser language, persist explicit choices, and update the interface without a page reload.
- Format dates and numbers according to the selected interface language.
- Keep API-provided names, identifiers, secrets, URLs, commands, and other dynamic values unchanged; map known user-visible API enums and error codes to localized labels.

## Capabilities

### New Capabilities

- `interface-localization`: Covers supported interface languages, dictionary-backed text, locale-aware formatting, language selection and persistence, accessibility metadata, and fallback behavior.

### Modified Capabilities

None.

## Impact

- Affects the application root, routes, feature components, shared UI components, page titles, accessibility metadata, and locale-sensitive formatters under `src/`.
- Adds shared localization state, dictionaries, translation helpers, and a language selector component.
- Existing component and end-to-end tests that assert English copy will need localization-aware updates, plus coverage for switching, persistence, interpolation, formatting, and fallbacks.
- No backend or public API changes are required. A lightweight in-repository localization implementation is expected; no runtime localization dependency is required unless implementation reveals a concrete need.
