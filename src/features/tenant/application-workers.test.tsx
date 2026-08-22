import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '../../shared/api/client'
import { ApiProvider } from '../../shared/api/context'
import { LocalizationProvider } from '../../shared/i18n'
import { ApplicationWorkers } from './application-workers'

const worker = (overrides: Record<string, unknown> = {}) => ({
  agent_id: 'agent-1',
  cluster_id: 'cluster-1',
  cluster_name: 'Production',
  node_name: 'worker-amd64-01',
  agent_version: '0.1.0',
  architecture: 'x86_64',
  kernel_release: '6.9.2',
  first_observed_at: '2026-08-20T10:00:00Z',
  last_observed_at: '2026-08-22T09:30:00Z',
  agent_last_seen_at: '2026-08-22T09:30:12Z',
  ...overrides,
})

function renderWorkers(get: ApiClient['get'], locale: 'en' | 'ru' = 'en') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const rendered = render(
    <QueryClientProvider client={client}>
      <ApiProvider value={{ get } as ApiClient}>
        <LocalizationProvider initialLocale={locale}>
          <ApplicationWorkers projectId="project / one" applicationId="application / one" />
        </LocalizationProvider>
      </ApiProvider>
    </QueryClientProvider>,
  )
  return { ...rendered, client }
}

describe('ApplicationWorkers', () => {
  it('renders heterogeneous and unavailable platform values as inert text', async () => {
    renderWorkers(
      vi.fn().mockResolvedValue({
        items: [
          worker(),
          worker({
            agent_id: 'agent-2',
            node_name: '<img src=x onerror=alert(1)>',
            architecture: null,
            kernel_release: null,
          }),
        ],
        next_cursor: null,
      }),
    )
    expect(await screen.findByText('6.9.2')).toBeVisible()
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeVisible()
    expect(screen.getAllByText('Not reported')).toHaveLength(2)
    expect(document.querySelector('img')).toBeNull()
    expect(screen.queryByText(/online|compatible/i)).not.toBeInTheDocument()
  })

  it('localizes the empty state', async () => {
    renderWorkers(vi.fn().mockResolvedValue({ items: [], next_cursor: null }), 'ru')
    expect(await screen.findByRole('heading', { name: 'Рабочие узлы' })).toBeVisible()
    expect(screen.getByText('Наблюдений рабочих узлов пока нет.')).toBeVisible()
  })

  it('isolates initial failures and retries', async () => {
    const get = vi
      .fn()
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValueOnce({ items: [worker()], next_cursor: null })
    renderWorkers(get)
    expect(
      await screen.findByRole('heading', { name: 'Worker nodes could not be loaded' }),
    ).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('6.9.2')).toBeVisible()
  })

  it('forwards opaque cursors and appends the next page', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce({ items: [worker()], next_cursor: 'opaque / cursor' })
      .mockResolvedValueOnce({
        items: [worker({ agent_id: 'agent-2', node_name: 'worker-arm64-02' })],
        next_cursor: null,
      })
    renderWorkers(get)
    await userEvent.click(await screen.findByRole('button', { name: 'Load more workers' }))
    expect(await screen.findByText('worker-arm64-02')).toBeVisible()
    expect(get).toHaveBeenNthCalledWith(
      2,
      '/api/v1/projects/project%20%2F%20one/applications/application%20%2F%20one/workers?limit=50&cursor=opaque%20%2F%20cursor',
      { protected: true },
    )
  })

  it('preserves workers after a failed background refresh', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce({ items: [worker()], next_cursor: null })
      .mockRejectedValueOnce(new Error('refresh failed'))
    const { client } = renderWorkers(get)
    expect(await screen.findByText('6.9.2')).toBeVisible()
    await client.invalidateQueries({
      queryKey: ['projects', 'project / one', 'applications', 'application / one', 'workers'],
    })
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2))
    expect(screen.getByText('6.9.2')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('Worker nodes could not be refreshed.')
  })
})
