import { afterEach, describe, expect, it, vi } from 'vitest'
import { credentialSession } from './session'

describe('credential session', () => {
  afterEach(() => credentialSession.clear())
  it('keeps credentials only inside the in-memory store', () => {
    const persistCredential = vi.spyOn(Storage.prototype, 'setItem')
    const listener = vi.fn()
    const unsubscribe = credentialSession.subscribe(listener)
    credentialSession.set('secret')
    expect(credentialSession.get()).toBe('secret')
    expect(persistCredential).not.toHaveBeenCalled()
    credentialSession.clear()
    expect(credentialSession.get()).toBeNull()
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
  })
})
