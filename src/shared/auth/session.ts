import { useSyncExternalStore } from 'react'

export const DEVELOPMENT_API_CREDENTIAL = 'replace-this-development-api-credential'
export const DEVELOPMENT_ADMIN_API_CREDENTIAL =
  '60f94c8a33b05d068b75e935ee5d526e60fa2cc7b19b0badd7bdd0871de6ca46'

let credential: string | null = null
let sessionMode: 'tenant' | 'admin' = 'tenant'
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const credentialSession = {
  get: () => credential,
  set: (value: string, mode: 'tenant' | 'admin' = 'tenant') => {
    credential = value.trim() || null
    sessionMode = mode
    emit()
  },
  clear: () => {
    credential = null
    sessionMode = 'tenant'
    emit()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export const getSessionMode = () => sessionMode

export function useCredential() {
  return useSyncExternalStore(
    credentialSession.subscribe,
    credentialSession.get,
    credentialSession.get,
  )
}
