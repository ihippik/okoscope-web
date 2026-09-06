## 1. Localization Foundation

- [x] 1.1 Create the supported-locale contract and canonical English and shape-compatible Russian dictionaries for static and parameterized messages.
- [x] 1.2 Implement locale resolution from saved preference and browser languages, defensive persistence, English fallback, and development-time missing-key reporting.
- [x] 1.3 Implement the localization provider and hooks, including immediate locale updates and synchronization of the HTML `lang` attribute.
- [x] 1.4 Add locale-explicit date, time, number, and plural-selection helpers and unit tests for English and Russian formatting.
- [x] 1.5 Add tests for dictionary parity, message interpolation, fallback behavior, locale resolution, persistence, and unavailable storage.

## 2. Application Shell and Shared UI

- [x] 2.1 Mount localization above application startup and routing, and refactor runtime-configuration failure rendering so it uses the localization context.
- [x] 2.2 Implement an accessible English/Russian language selector for the authenticated site menu and reusable placement on pre-session screens.
- [x] 2.3 Localize root navigation, credential prompt, backend loading/error/compatibility states, not-found UI, footer wording, and their document or accessibility metadata.
- [x] 2.4 Localize shared loading, error, modal, and other reusable UI defaults, including known API error-code labels and unknown-error technical-detail behavior.
- [x] 2.5 Add shell and shared-component tests for switching without reload, preference persistence, pre-session selection, titles, accessibility labels, and unchanged dynamic values.

## 3. Tenant and Runtime Surfaces

- [x] 3.1 Migrate organization, project, and application routes and tenant list components so all static copy, breadcrumbs, empty/error states, and titles use dictionary entries.
- [x] 3.2 Migrate runtime group list/detail and lifecycle surfaces, including statuses, action dialogs, accessibility text, and dynamic messages.
- [x] 3.3 Migrate runtime inventory list/detail surfaces, including filters, placeholders, tabs, summaries, evidence labels, and titles.
- [x] 3.4 Migrate release and runtime-diff surfaces, including comparison labels, statuses, breadcrumbs, and titles.
- [x] 3.5 Update tenant, runtime inventory, and observability tests to render with an explicit locale and verify representative Russian and English behavior.

## 4. Notification Surfaces

- [x] 4.1 Migrate notification health and shared navigation/formatting to dictionary entries and the active locale.
- [x] 4.2 Migrate destination list/detail, forms, validation, secret dialog, clipboard announcements, and document titles.
- [x] 4.3 Migrate delivery list/detail, pagination, status and error labels, accessibility text, and document titles.
- [x] 4.4 Migrate single and bulk recovery actions, filters, confirmation/result dialogs, recovery history/detail, and document titles.
- [x] 4.5 Update notification component and route tests to cover both locales, interpolation, preserved technical values, and mapped versus unknown API errors.

## 5. Coverage and Verification

- [x] 5.1 Inventory remaining rendered text, `aria-*` content, placeholders, live announcements, and `document.title` assignments under `src/`, and migrate every user-facing static phrase to the dictionaries.
- [x] 5.2 Add an automated guardrail that rejects newly embedded user-facing copy while documenting narrow exclusions for non-UI constants and fixtures.
- [x] 5.3 Update Playwright flows for deterministic locale setup and add end-to-end coverage for language selection, persistence, and representative Russian navigation.
- [x] 5.4 Run formatting, lint, type checking, unit tests, end-to-end tests, and production build; resolve every localization-related failure.

## 6. Translation Quality Remediation

- [x] 6.1 Replace substring-based DOM translation with exact dictionary messages so a phrase can never mix Russian and English fragments.
- [x] 6.2 Complete the Russian catalog for every route, form, dialog, empty state, status label, accessibility label, and document title.
- [x] 6.3 Add full-message handling for dynamic phrases while preserving only their runtime values.
- [x] 6.4 Add Russian end-to-end coverage across tenant, runtime, and notification surfaces and fail on untranslated interface copy.
- [x] 6.5 Run the complete verification suite and manually audit representative Russian pages.

## 7. Configured Label Coverage

- [x] 7.1 Translate runtime inventory category labels and extend catalog checks and Russian e2e coverage for labels declared in configuration arrays.

## 8. Formatter Fallback Coverage

- [x] 8.1 Localize the never-observed formatter fallback and cover formatter-returned UI strings.

## 9. Navigation Label Refinement

- [x] 9.1 Remove the redundant open/view verb from application navigation button labels in both languages and update dependent tests.
