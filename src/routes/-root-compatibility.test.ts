import { describe, expect, it } from 'vitest'
import { isBuildCompatible } from './__root'

describe('backend compatibility', () => {
  it('requires API v1 and database migration 7 or newer', () => {
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 7 })).toBe(true)
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 9 })).toBe(true)
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 6 })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v1' })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v2', required_database_migration: 7 })).toBe(false)
  })
})
