import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { localizeDocument } from './legacy'

export const supportedLocales = ['en', 'ru'] as const
export type Locale = (typeof supportedLocales)[number]
export type MessageValues = Record<string, string | number>

export const englishMessages = {
  language: 'Language',
  english: 'English',
  russian: 'Russian',
  projects: 'Projects',
  endSession: 'End session',
  primaryNavigation: 'Primary',
  checkingBackend: 'Checking backend compatibility…',
  backendUnavailable: 'Backend unavailable',
  incompatibleDeployment: 'Incompatible deployment',
  incompatibleBackend: 'Incompatible backend',
  expected: 'Expected',
  actual: 'Actual',
  service: 'Service',
  commit: 'Commit',
  requiredMigration: 'Required migration',
  actualMigration: 'Actual migration',
  orNewer: 'or newer',
  unknown: 'unknown',
  pageNotFound: 'Page not found',
  notFound: 'Not found',
  webVersion: 'Web {version} · {commit}',
  compatibleApi: 'Compatible API · v1',
  connect: 'Connect to Okoscope',
  credentialHelp: "Your bearer credential stays in this page's memory and disappears on reload.",
  bearerCredential: 'Bearer credential',
  startSession: 'Start session',
  configurationError: 'Configuration error',
  cannotStart: 'Okoscope cannot start',
  runtimeConfigFailed: 'Runtime configuration could not be loaded.',
  loading: 'Loading…',
  close: 'Close',
  somethingWrong: 'Something went wrong',
  unexpectedError: 'An unexpected error occurred.',
  errorCode: 'Error code: {code}',
  requestId: 'Request ID:',
  tryAgain: 'Try again',
} as const

export type MessageKey = keyof typeof englishMessages

export const russianMessages = {
  language: 'Язык',
  english: 'Английский',
  russian: 'Русский',
  projects: 'Проекты',
  endSession: 'Завершить сеанс',
  primaryNavigation: 'Основная навигация',
  checkingBackend: 'Проверяем совместимость сервера…',
  backendUnavailable: 'Сервер недоступен',
  incompatibleDeployment: 'Несовместимое развертывание',
  incompatibleBackend: 'Несовместимый сервер',
  expected: 'Ожидается',
  actual: 'Фактически',
  service: 'Сервис',
  commit: 'Коммит',
  requiredMigration: 'Требуемая миграция',
  actualMigration: 'Фактическая миграция',
  orNewer: 'или новее',
  unknown: 'неизвестно',
  pageNotFound: 'Страница не найдена',
  notFound: 'Не найдено',
  webVersion: 'Веб {version} · {commit}',
  compatibleApi: 'Совместимый API · v1',
  connect: 'Подключиться к Okoscope',
  credentialHelp:
    'Токен доступа хранится только в памяти этой страницы и исчезнет после перезагрузки.',
  bearerCredential: 'Токен доступа',
  startSession: 'Начать сеанс',
  configurationError: 'Ошибка конфигурации',
  cannotStart: 'Не удалось запустить Okoscope',
  runtimeConfigFailed: 'Не удалось загрузить конфигурацию среды выполнения.',
  loading: 'Загрузка…',
  close: 'Закрыть',
  somethingWrong: 'Что-то пошло не так',
  unexpectedError: 'Произошла непредвиденная ошибка.',
  errorCode: 'Код ошибки: {code}',
  requestId: 'ID запроса:',
  tryAgain: 'Повторить',
} as const satisfies Record<MessageKey, string>

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en: englishMessages,
  ru: russianMessages,
}
export const LANGUAGE_STORAGE_KEY = 'okoscope.locale'
let activeLocale: Locale = 'en'
export const getActiveLocale = () => activeLocale

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ru'
}

export function resolveLocale(
  storage: Pick<Storage, 'getItem'> | null = globalThis.localStorage,
  languages: readonly string[] = globalThis.navigator?.languages ?? [],
): Locale {
  try {
    const saved = storage?.getItem(LANGUAGE_STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* storage is optional */
  }
  for (const language of languages) {
    const locale = language.toLowerCase().split('-')[0]
    if (isLocale(locale)) return locale
  }
  return 'en'
}

export function translate(locale: Locale, key: MessageKey, values: MessageValues = {}): string {
  const template = messages[locale]?.[key] ?? englishMessages[key]
  if (!messages[locale]?.[key] && import.meta.env.DEV)
    console.warn(`Missing ${locale} translation: ${key}`)
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  )
}

type LocalizationValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, values?: MessageValues) => string
}
const defaultLocalization: LocalizationValue = {
  locale: 'en',
  setLocale: () => undefined,
  t: (key, values) => translate('en', key, values),
}
const LocalizationContext = createContext<LocalizationValue>(defaultLocalization)

export function LocalizationProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? resolveLocale())
  const setLocale = (next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next)
    } catch {
      /* keep in memory */
    }
  }
  useLayoutEffect(() => {
    activeLocale = locale
    document.documentElement.lang = locale
    return localizeDocument(locale)
  }, [locale])
  const value = useMemo<LocalizationValue>(
    () => ({ locale, setLocale, t: (key, values) => translate(locale, key, values) }),
    [locale],
  )
  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>
}

export function useLocalization() {
  return useContext(LocalizationContext)
}
export function useT() {
  return useLocalization().t
}

export const formatNumber = (locale: Locale, value: number) =>
  new Intl.NumberFormat(locale).format(value)
export const formatDateTime = (locale: Locale, value: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, options).format(value)
export const pluralCategory = (locale: Locale, value: number) =>
  new Intl.PluralRules(locale).select(value)
