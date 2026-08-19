import { describe, expect, it } from 'vitest'
import { legacyRussian } from './legacy'

describe('translation catalog guardrails', () => {
  it('keeps translations centralized and covers the established UI vocabulary', () => {
    expect(Object.keys(legacyRussian).length).toBeGreaterThan(100)
    expect(new Set(Object.keys(legacyRussian)).size).toBe(Object.keys(legacyRussian).length)
    for (const [english, russian] of Object.entries(legacyRussian)) {
      expect(english.trim()).not.toBe('')
      expect(russian, english).toMatch(/[А-Яа-яЁё]/)
    }
  })
})
