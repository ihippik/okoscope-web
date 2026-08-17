export type RuntimeGroupSearch = {
  event_kind?: string | undefined
  status?: 'open' | undefined
  namespace?: string | undefined
  workload_kind?: string | undefined
  workload_name?: string | undefined
  since?: string | undefined
  cursor?: string | undefined
}
export type ReleaseSearch = { cursor?: string | undefined }
export type RuntimeDiffSearch = { baseline?: string | undefined; cursor?: string | undefined }

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined
const timestamp = (value: unknown) => {
  const parsed = text(value)
  return parsed && !Number.isNaN(Date.parse(parsed)) ? parsed : undefined
}

export function parseRuntimeGroupSearch(input: Record<string, unknown>): RuntimeGroupSearch {
  return compact({
    event_kind: text(input.event_kind),
    status: input.status === 'open' ? 'open' : undefined,
    namespace: text(input.namespace),
    workload_kind: text(input.workload_kind),
    workload_name: text(input.workload_name),
    since: timestamp(input.since),
    cursor: text(input.cursor),
  })
}
export const parseReleaseSearch = (input: Record<string, unknown>): ReleaseSearch =>
  compact({ cursor: text(input.cursor) })
export const parseRuntimeDiffSearch = (input: Record<string, unknown>): RuntimeDiffSearch =>
  compact({ baseline: text(input.baseline), cursor: text(input.cursor) })
export const changeRuntimeGroupFilters = (
  current: RuntimeGroupSearch,
  updates: Partial<RuntimeGroupSearch>,
) => {
  const withoutCursor = { ...current }
  delete withoutCursor.cursor
  return compact({ ...withoutCursor, ...updates, cursor: undefined })
}
export const changeBaseline = (
  current: RuntimeDiffSearch,
  baseline?: string,
): RuntimeDiffSearch => {
  const withoutCursor = { ...current }
  delete withoutCursor.cursor
  return compact({ ...withoutCursor, baseline })
}
function compact<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== ''),
  ) as T
}
