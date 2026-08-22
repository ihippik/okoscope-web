import { describe, expect, it, vi } from 'vitest'
import type { ApiClient } from './client'
import { applicationWorkersOptions, queryKeys } from './queries'

describe('application worker queries', () => {
  it('scopes cache identity by Project and Application without credentials', () => {
    expect(queryKeys.applicationWorkers('project-a', 'application-a')).not.toEqual(
      queryKeys.applicationWorkers('project-a', 'application-b'),
    )
    expect(
      JSON.stringify(queryKeys.applicationWorkers('project-a', 'application-a')),
    ).not.toContain('credential')
  })

  it('uses a generated worker page query with an opaque next cursor', () => {
    const options = applicationWorkersOptions({ get: vi.fn() } as unknown as ApiClient, 'p', 'a')
    expect(options.initialPageParam).toBeNull()
    expect(options.getNextPageParam?.({ items: [], next_cursor: 'opaque' }, [], null, [])).toBe(
      'opaque',
    )
    expect(
      options.getNextPageParam?.({ items: [], next_cursor: null }, [], null, []),
    ).toBeUndefined()
  })
})
