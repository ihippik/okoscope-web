import { afterEach, describe, expect, it, vi } from 'vitest'
import { credentialSession, getSessionMode } from './session'

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

  it('keeps tenant and administrator development entry modes separate', () => {
    credentialSession.set('tenant-secret')
    expect(getSessionMode()).toBe('tenant')
    credentialSession.set('admin-secret', 'admin')
    expect(getSessionMode()).toBe('admin')
    credentialSession.clear()
    expect(getSessionMode()).toBe('tenant')
  })
})
