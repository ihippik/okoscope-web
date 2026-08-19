import { getActiveLocale } from '../../shared/i18n'

export const formatCount = (value: number) => new Intl.NumberFormat(getActiveLocale()).format(value)
export const formatTimestamp = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(getActiveLocale(), {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    : 'Never observed'
