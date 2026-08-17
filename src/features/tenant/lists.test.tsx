import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'
import { ApiProvider } from '../../shared/api/context'
import type { ApiClient } from '../../shared/api/client'
import { ApplicationList } from './application-list'
import { ProjectList } from './project-list'

function renderWithProviders(node: React.ReactNode, get: ApiClient['get']) {
  const rootRoute = createRootRoute({ component: () => node })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const rendered = render(
    <QueryClientProvider client={client}>
      <ApiProvider value={{ get } as ApiClient}>
        <RouterProvider router={router} />
      </ApiProvider>
    </QueryClientProvider>,
  )
  return { ...rendered, client }
}

describe('tenant lists', () => {
  it('shows an explicit empty Project state', async () => {
    renderWithProviders(
      <ProjectList />,
      vi.fn().mockResolvedValue({ items: [], next_cursor: null }),
    )
    expect(await screen.findByText('No projects yet')).toBeInTheDocument()
  })

  it('formats an Application without observations', async () => {
    renderWithProviders(
      <ApplicationList projectId="project-1" />,
      vi.fn().mockResolvedValue({
        items: [
          {
            id: 'application-1',
            project_id: 'project-1',
            slug: 'api',
            name: 'API',
            created_at: '2026-08-17T12:00:00Z',
            release_count: 0,
            runtime_group_count: 0,
            latest_observed_at: null,
          },
        ],
        next_cursor: null,
      }),
    )
    expect(await screen.findByText('Never observed')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /API/ })).toHaveAttribute(
      'href',
      '/projects/project-1/applications/application-1',
    )
  })

  it('shows archive state and preserves Projects after a failed refresh', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce({
        items: [
          {
            id: 'project-1',
            slug: 'old',
            name: 'Legacy',
            created_at: '2026-08-17T12:00:00Z',
            archived_at: '2026-08-17T13:00:00Z',
            application_count: 1,
            runtime_group_count: 2,
          },
        ],
        next_cursor: null,
      })
      .mockRejectedValueOnce(new Error('refresh failed'))
    const { client } = renderWithProviders(<ProjectList />, get)
    expect(await screen.findByText('Archived')).toBeInTheDocument()
    await client.invalidateQueries({ queryKey: ['projects'] })
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2))
    expect(screen.getByText('Legacy')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Projects could not be refreshed' }),
    ).toBeInTheDocument()
  })
})
