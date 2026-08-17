import { useSyncExternalStore } from 'react'

let credential: string | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const credentialSession = {
  get: () => credential,
  set: (value: string) => {
    credential = value.trim() || null
    emit()
  },
  clear: () => {
    credential = null
    emit()
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useCredential() {
  return useSyncExternalStore(
    credentialSession.subscribe,
    credentialSession.get,
    credentialSession.get,
  )
}
