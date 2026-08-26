import { describe, expect, it } from 'vitest'
import { isBuildCompatible } from './__root'

describe('backend compatibility', () => {
  it('requires API v1 and database migration 15 or newer', () => {
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 15 })).toBe(true)
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 14 })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v1', required_database_migration: 11 })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v1' })).toBe(false)
    expect(isBuildCompatible({ api_version: 'v2', required_database_migration: 15 })).toBe(false)
  })
})
