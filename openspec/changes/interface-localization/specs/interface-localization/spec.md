## ADDED Requirements

### Requirement: Supported interface languages

The application SHALL provide complete English (`en`) and Russian (`ru`) interface dictionaries, and every user-facing static phrase SHALL be resolved from the active-language dictionary rather than embedded in a component.

#### Scenario: English interface

- **WHEN** the active language is English
- **THEN** navigation, page content, forms, loading and empty states, errors, dialogs, accessibility labels, and document titles are displayed using the English dictionary

#### Scenario: Russian interface

- **WHEN** the active language is Russian
- **THEN** navigation, page content, forms, loading and empty states, errors, dialogs, accessibility labels, and document titles are displayed using the Russian dictionary

#### Scenario: Dynamic values in translated phrases

- **WHEN** a localized phrase contains an application name, count, identifier, status, or another runtime value
- **THEN** the surrounding words are resolved from the active dictionary and the runtime value is interpolated without translation or modification

### Requirement: Language selection

The application SHALL provide an English and Russian language selector in the site menu and on screens shown before a user session is established, and SHALL apply a selection immediately without reloading the page.

#### Scenario: User changes the language

- **WHEN** the user selects a language different from the active language
- **THEN** all currently rendered interface text and the document title change to the selected language without a page reload

#### Scenario: Language can be selected before authentication

- **WHEN** the credential prompt, compatibility state, configuration error, or another pre-session screen is displayed
- **THEN** the user can select English or Russian on that screen

### Requirement: Language preference resolution and persistence

The application SHALL determine the initial language from a valid saved preference, otherwise from the browser language, and otherwise use English, and SHALL persist an explicit user selection for later visits.

#### Scenario: Saved preference exists

- **WHEN** a saved preference contains `en` or `ru`
- **THEN** the application uses the saved language regardless of the browser language

#### Scenario: Russian browser without a saved preference

- **WHEN** no valid preference is saved and the browser's preferred languages include Russian as the highest supported language
- **THEN** the application uses Russian

#### Scenario: Unsupported browser language

- **WHEN** no valid preference is saved and the browser does not prefer a supported language
- **THEN** the application uses English

#### Scenario: Storage is unavailable

- **WHEN** browser preference storage cannot be read or written
- **THEN** the application remains usable and keeps the selected language for the current page lifetime

### Requirement: Locale metadata and formatting

The application SHALL synchronize the document language and locale-sensitive formatting with the active interface language.

#### Scenario: Document language changes

- **WHEN** the active language changes
- **THEN** the root HTML element's `lang` attribute is set to the corresponding supported language code

#### Scenario: Dates and numbers are rendered

- **WHEN** the interface renders a date, time, number, or count intended for human reading
- **THEN** it is formatted with `Intl` using the active language's locale

### Requirement: Translation fallback and dictionary integrity

The application SHALL use English as the fallback for a missing active-language entry and SHALL provide automated verification that the English and Russian dictionaries expose the same translation keys.

#### Scenario: Active-language entry is unavailable

- **WHEN** a requested translation key is unavailable in the Russian dictionary
- **THEN** the corresponding English entry is rendered and the application continues operating

#### Scenario: Dictionaries diverge during development

- **WHEN** automated checks detect that a supported dictionary is missing or adds a translation key relative to the canonical English dictionary
- **THEN** the checks fail and identify the inconsistent key

### Requirement: API values and errors

The application SHALL preserve API-provided names, identifiers, secrets, URLs, commands, request IDs, and free-form values, while known user-visible enum values and error codes SHALL be mapped to dictionary-backed labels.

#### Scenario: Technical value is displayed

- **WHEN** the interface displays an API-provided identifier, secret, URL, command, request ID, or user-defined name
- **THEN** the value is displayed unchanged within the localized surrounding interface text

#### Scenario: Known API code is displayed

- **WHEN** the interface displays a known status, enum value, or error code for which a localized label exists
- **THEN** it displays the active-language label and retains technical details needed for diagnosis

#### Scenario: Unknown API error is displayed

- **WHEN** an API error has no known localized mapping
- **THEN** the application displays a localized generic error message and preserves available server detail as technical information
