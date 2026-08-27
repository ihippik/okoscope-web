import { describe, expect, it } from 'vitest'
import type { components, paths } from './schema'
import contract from '../../../openapi/okoscope-v1.yaml?raw'

describe('authentication contract snapshot', () => {
  it('publishes browser session operations and bounded roles', () => {
    const operations: Array<keyof paths> = [
      '/api/v1/auth/register',
      '/api/v1/auth/login',
      '/api/v1/auth/me',
      '/api/v1/auth/logout',
    ]
    const roles: components['schemas']['OrganizationRole'][] = ['owner', 'member']
    const context: components['schemas']['AuthContext'] = {
      user: { id: 'user', email: 'owner@example.com' },
      organization: { id: 'organization', name: 'Acme', slug: 'acme' },
      role: 'owner',
    }
    expect(operations).toHaveLength(4)
    expect(roles).toEqual(['owner', 'member'])
    expect(context.organization.slug).toBe('acme')
  })

  it('does not publish legacy tenant bearer authentication', () => {
    expect(contract).not.toContain('bearerAuth:')
    expect(contract).toContain('sessionAuth:')
    expect(contract).toContain('adminAuth:')
  })
})
