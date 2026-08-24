import type { AttentionWindowKind } from '../../shared/api/types'

export type AttentionSearch = { window: AttentionWindowKind }

export const parseAttentionSearch = (search: Record<string, unknown>): AttentionSearch => ({
  window: search.window === '7d' ? '7d' : '24h',
})
