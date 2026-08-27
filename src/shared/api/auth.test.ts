import { describe, expect, it, vi } from 'vitest'
import { getCurrentUser, login, logout, register } from './auth'
import type { ApiClient } from './client'

describe('generated authentication operations', () => {
  it('uses the published paths and endpoint-specific unauthorized behavior', async () => {
    const context = {
      user: { id: 'user', email: 'owner@example.com' },
      organization: { id: 'organization', name: 'Acme', slug: 'acme' },
      role: 'owner' as const,
    }
    const get = vi.fn().mockResolvedValue(context)
    const post = vi
      .fn()
      .mockResolvedValueOnce(context)
      .mockResolvedValueOnce(context)
      .mockResolvedValueOnce(undefined)
    const api = {
      get,
      post,
    } as unknown as ApiClient
    await getCurrentUser(api)
    await login(api, { email: 'owner@example.com', password: 'password' })
    await register(api, {
      email: 'owner@example.com',
      password: 'long password',
      organization_name: 'Acme',
      organization_slug: 'acme',
    })
    await logout(api)
    expect(get).toHaveBeenCalledWith('/api/v1/auth/me', { protected: true, unauthorized: 'ignore' })
    expect(post).toHaveBeenNthCalledWith(
      1,
      '/api/v1/auth/login',
      expect.objectContaining({ unauthorized: 'ignore' }),
    )
    expect(post).toHaveBeenNthCalledWith(
      2,
      '/api/v1/auth/register',
      expect.objectContaining({ unauthorized: 'ignore' }),
    )
    expect(post).toHaveBeenNthCalledWith(3, '/api/v1/auth/logout', {
      protected: true,
      unauthorized: 'ignore',
    })
  })
})
