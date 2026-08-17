import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '../../shared/api/client'
import { ApiProvider } from '../../shared/api/context'
import {
  getHealthPollingInterval,
  notificationHealthOptions,
  queryKeys,
} from '../../shared/api/queries'
import type { NotificationHealth } from '../../shared/api/types'
import { DeliveryHistory } from './deliveries'
import { DestinationList } from './destinations'
import { healthPresentation, NotificationHealthPanel } from './health'
import { SecretDialog } from './secret-dialog'

function renderWithProviders(node: React.ReactNode, api: Partial<ApiClient>) {
  const rootRoute = createRootRoute({ component: () => node })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const rendered = render(
    <QueryClientProvider client={queryClient}>
      <ApiProvider value={api as ApiClient}>
        <RouterProvider router={router} />
      </ApiProvider>
    </QueryClientProvider>,
  )
  return { ...rendered, queryClient }
}

const healthFixture = (state: NotificationHealth['state']): NotificationHealth => ({
  state,
  delivery_enabled: state !== 'disabled',
  enabled_destination_count: 2,
  pending_count: 5,
  due_count: 3,
  retrying_count: 1,
  in_flight_count: 1,
  expired_lease_count: 0,
  failed_count: state === 'failing' ? 2 : 0,
  oldest_due_age_seconds: 125,
  observed_at: '2026-08-17T20:00:00Z',
})

describe('notification operations', () => {
  it.each(['disabled', 'idle', 'backlogged', 'retrying', 'failing', 'draining'] as const)(
    'renders the %s health state with text independent of color',
    async (state) => {
      renderWithProviders(<NotificationHealthPanel projectId="project-1" />, {
        get: vi.fn().mockResolvedValue(healthFixture(state)),
      })
      expect(
        await screen.findByRole('heading', { name: healthPresentation[state].label }),
      ).toBeInTheDocument()
      expect(screen.getByText(healthPresentation[state].description)).toBeInTheDocument()
    },
  )

  it('selects adaptive polling intervals and disables background polling', () => {
    expect(getHealthPollingInterval('idle')).toBe(10_000)
    expect(getHealthPollingInterval('disabled')).toBe(10_000)
    for (const state of ['backlogged', 'retrying', 'failing', 'draining'] as const)
      expect(getHealthPollingInterval(state)).toBe(3_000)
    expect(
      notificationHealthOptions({} as ApiClient, 'project-1').refetchIntervalInBackground,
    ).toBe(false)
  })

  it('preserves the last successful health snapshot and marks it stale', async () => {
    const get = vi
      .fn()
      .mockResolvedValueOnce(healthFixture('idle'))
      .mockRejectedValueOnce(new Error('temporary refresh failure'))
    const { queryClient } = renderWithProviders(<NotificationHealthPanel projectId="project-1" />, {
      get,
    })
    expect(await screen.findByRole('heading', { name: 'Delivery healthy' })).toBeInTheDocument()
    await queryClient.invalidateQueries({ queryKey: queryKeys.notificationHealth('project-1') })
    await waitFor(() => expect(get).toHaveBeenCalledTimes(2))
    expect(screen.getByRole('heading', { name: 'Delivery healthy' })).toBeInTheDocument()
    expect(screen.getByText('Health data is stale')).toBeInTheDocument()
  })

  it('creates a destination and clears its one-time secret on close', async () => {
    const user = userEvent.setup()
    const get = vi.fn().mockResolvedValue([])
    const post = vi.fn().mockResolvedValue({
      id: 'destination-1',
      project_id: 'project-1',
      name: 'Ops',
      url: 'https://example.test/hook',
      enabled: true,
      deliver_backfill: false,
      revision: 1,
      created_at: '2026-08-17T00:00:00Z',
      updated_at: '2026-08-17T00:00:00Z',
      disabled_at: null,
      secret: 'only-once',
    })
    renderWithProviders(<DestinationList projectId="project-1" />, { get, post })
    await user.click(await screen.findByRole('button', { name: 'Create destination' }))
    await user.type(screen.getByLabelText('Name'), 'Ops')
    await user.type(screen.getByLabelText('Destination URL'), 'https://example.test/hook')
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Create destination' }),
    )
    expect(await screen.findByText('only-once')).toBeInTheDocument()
    expect(post).toHaveBeenCalledWith(
      expect.stringContaining('/webhook-destinations'),
      expect.objectContaining({
        body: { name: 'Ops', url: 'https://example.test/hook', deliver_backfill: false },
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('only-once')).not.toBeInTheDocument()
  })

  it('copies one-time secrets and announces the result', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    render(<SecretDialog secret="secret-value" onClose={() => undefined} />)
    await user.click(screen.getByRole('button', { name: 'Copy secret' }))
    expect(writeText).toHaveBeenCalledWith('secret-value')
    expect(screen.getByText('Secret copied to clipboard.')).toBeInTheDocument()
  })

  it('uses the server cursor for the next delivery page', async () => {
    const onNext = vi.fn()
    renderWithProviders(
      <DeliveryHistory
        projectId="project-1"
        cursor={null}
        onNext={onNext}
        onPrevious={() => undefined}
      />,
      { get: vi.fn().mockResolvedValue({ items: [], next_cursor: 'next-page' }) },
    )
    await userEvent.click(await screen.findByRole('button', { name: 'Next' }))
    expect(onNext).toHaveBeenCalledWith('next-page')
  })
})
