export const formatCount = (value: number) => new Intl.NumberFormat().format(value)
export const formatTimestamp = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
      )
    : 'Never observed'
