import { describe, expect, it } from 'vitest'
import { isBuildCompatible } from './__root'

describe('backend compatibility', () => {
  it('requires API v1 and database migration 16 or newer', () => {
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 16 })).toBe(true)
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 15 })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 11 })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v1' })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v2', required_database_migration: 16 })).toBe(false)
  })
})
