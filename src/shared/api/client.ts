import { credentialSession } from '../auth/session'
import type { RuntimeConfig } from '../config/runtime-config'
import type { ErrorEnvelope } from './types'

export type ClientError =
  | { kind: 'api'; status: number; code: string; message: string; requestId: string }
  | { kind: 'network'; message: string; requestId: string }
  | { kind: 'invalid-response'; message: string; requestId: string }

export class ApiClientError extends Error {
  constructor(readonly detail: ClientError) {
    super(detail.message)
  }
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (!value || typeof value !== 'object') return false
  const object = value as Record<string, unknown>
  return ['error', 'message', 'request_id'].every((key) => typeof object[key] === 'string')
}

export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false
  return !(
    error instanceof ApiClientError &&
    error.detail.kind === 'api' &&
    [400, 401, 404].includes(error.detail.status)
  )
}

export class ApiClient {
  constructor(
    private readonly config: RuntimeConfig,
    private readonly onUnauthorized: () => void,
  ) {}

  async get<T>(
    path: string,
    options: { protected?: boolean; signal?: AbortSignal; headers?: Record<string, string> } = {},
  ): Promise<T> {
    return this.request<T>('GET', path, options)
  }

  async post<T>(
    path: string,
    options: {
      protected?: boolean
      signal?: AbortSignal
      body?: unknown
      headers?: Record<string, string>
    } = {},
  ): Promise<T> {
    return this.request<T>('POST', path, options)
  }

  async patch<T>(
    path: string,
    options: {
      protected?: boolean
      signal?: AbortSignal
      body: unknown
      headers?: Record<string, string>
    },
  ): Promise<T> {
    return this.request<T>('PATCH', path, options)
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PATCH',
    path: string,
    options: {
      protected?: boolean
      signal?: AbortSignal
      body?: unknown
      headers?: Record<string, string>
    },
  ): Promise<T> {
    const requestId = crypto.randomUUID()
    const headers = new Headers({ Accept: 'application/json', 'X-Request-Id': requestId })
    for (const [name, value] of Object.entries(options.headers ?? {})) headers.set(name, value)
    if (options.body !== undefined) headers.set('Content-Type', 'application/json')
    if (options.protected) {
      const credential = credentialSession.get()
      if (credential) headers.set('Authorization', `Bearer ${credential}`)
    }
    let response: Response
    try {
      response = await fetch(`${this.config.apiBaseUrl}${path}`, {
        method,
        headers,
        ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
        ...(options.signal ? { signal: options.signal } : {}),
      })
    } catch {
      throw new ApiClientError({
        kind: 'network',
        message: 'The API could not be reached.',
        requestId,
      })
    }
    const headerId = response.headers.get('x-request-id')
    let body: unknown
    try {
      body = await response.json()
    } catch {
      throw new ApiClientError({
        kind: 'invalid-response',
        message: 'The API returned invalid JSON.',
        requestId: headerId ?? requestId,
      })
    }
    if (!response.ok) {
      const envelope = isErrorEnvelope(body) ? body : null
      const detail: ClientError = {
        kind: 'api',
        status: response.status,
        code: envelope?.error ?? 'request_failed',
        message: envelope?.message ?? `Request failed (${response.status}).`,
        requestId: headerId ?? envelope?.request_id ?? requestId,
      }
      if (response.status === 401) this.onUnauthorized()
      throw new ApiClientError(detail)
    }
    if (!body || typeof body !== 'object')
      throw new ApiClientError({
        kind: 'invalid-response',
        message: 'The API returned an unexpected response.',
        requestId: headerId ?? requestId,
      })
    return body as T
  }
}
