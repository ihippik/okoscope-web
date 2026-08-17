import { afterEach, describe, expect, it, vi } from 'vitest'
import { credentialSession } from '../auth/session'
import { ApiClient, ApiClientError, shouldRetry } from './client'

const response = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json', ...init.headers },
    ...init,
  })

describe('ApiClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    credentialSession.clear()
  })

  it('sends ephemeral authorization and request correlation', async () => {
    credentialSession.set('top-secret')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(response({ id: 'org' }, { headers: { 'x-request-id': 'server-id' } }))
    vi.stubGlobal('fetch', fetchMock)
    const api = new ApiClient({ apiBaseUrl: 'https://api.example' }, vi.fn())
    await expect(api.get('/api/v1/organization', { protected: true })).resolves.toEqual({
      id: 'org',
    })
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers
    expect(headers.get('authorization')).toBe('Bearer top-secret')
    expect(headers.get('x-request-id')).toBeTruthy()
    expect(JSON.stringify(fetchMock.mock.calls)).not.toContain('credential=')
  })

  it('sends lifecycle mutations as protected POST requests', async () => {
    credentialSession.set('token')
    const fetchMock = vi.fn().mockResolvedValue(response({ status: 'acknowledged' }))
    vi.stubGlobal('fetch', fetchMock)
    const api = new ApiClient({ apiBaseUrl: 'https://api.example' }, vi.fn())
    await api.post('/api/v1/runtime-groups/group/acknowledge', { protected: true })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example/api/v1/runtime-groups/group/acknowledge',
      expect.objectContaining({ method: 'POST' }),
    )
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers
    expect(headers.get('authorization')).toBe('Bearer token')
  })

  it('prefers response header request ID and clears on 401', async () => {
    credentialSession.set('bad')
    const unauthorized = vi.fn()
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          response(
            { error: 'unauthorized', message: 'No', request_id: 'body-id' },
            { status: 401, headers: { 'x-request-id': 'header-id' } },
          ),
        ),
    )
    const api = new ApiClient({ apiBaseUrl: 'https://api.example' }, unauthorized)
    await expect(api.get('/protected', { protected: true })).rejects.toMatchObject({
      detail: { kind: 'api', status: 401, requestId: 'header-id' },
    })
    expect(unauthorized).toHaveBeenCalledOnce()
  })

  it('normalizes network and malformed JSON failures', async () => {
    const api = new ApiClient({ apiBaseUrl: 'https://api.example' }, vi.fn())
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('secret internals')))
    await expect(api.get('/x')).rejects.toMatchObject({
      detail: { kind: 'network', message: 'The API could not be reached.' },
    })
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response('broken', { status: 200, headers: { 'x-request-id': 'bad-json' } }),
        ),
    )
    await expect(api.get('/x')).rejects.toMatchObject({
      detail: { kind: 'invalid-response', requestId: 'bad-json' },
    })
  })

  it('retries only bounded transient failures', () => {
    expect(shouldRetry(0, new Error())).toBe(true)
    expect(shouldRetry(2, new Error())).toBe(false)
    expect(
      shouldRetry(
        0,
        new ApiClientError({
          kind: 'api',
          status: 404,
          code: 'not_found',
          message: 'No',
          requestId: 'id',
        }),
      ),
    ).toBe(false)
  })
})
