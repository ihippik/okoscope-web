import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import {
  JsonDetailsViewer,
  RuntimeDiffClassificationBadge,
  RuntimeGroupStatusBadge,
  NotificationSummary,
  OccurrenceTimeline,
  SemanticSummary,
  getNotificationPresentation,
  validLifecycleActions,
  isRecentlyFirstSeen,
} from './components'
import {
  invalidateRuntimeGroupLifecycle,
  observabilityKeys,
  runtimeGroupOccurrencesPath,
} from './queries'
import {
  changeBaseline,
  changeRuntimeGroupFilters,
  parseReleaseSearch,
  parseRuntimeDiffSearch,
  parseRuntimeGroupSearch,
} from './url-state'
import { formatCount } from '../tenant/format'

afterEach(cleanup)

describe('observability URL state', () => {
  it('parses, trims and rejects invalid values', () => {
    expect(
      parseRuntimeGroupSearch({
        event_kind: ' exec ',
        status: 'closed',
        since: 'nope',
        first_seen_from: '2026-08-17T00:00:00Z',
        first_seen_to: 'bad',
        last_seen_to: '2026-08-18T00:00:00Z',
        release_id: ' release ',
        cursor: '',
      }),
    ).toEqual({
      event_kind: 'exec',
      first_seen_from: '2026-08-17T00:00:00Z',
      last_seen_to: '2026-08-18T00:00:00Z',
      release_id: 'release',
    })
    for (const status of ['open', 'acknowledged', 'resolved'] as const)
      expect(parseRuntimeGroupSearch({ status })).toEqual({ status })
    expect(parseReleaseSearch({ cursor: ' next ' })).toEqual({ cursor: 'next' })
    expect(parseRuntimeDiffSearch({ baseline: 'base', cursor: 'next' })).toEqual({
      baseline: 'base',
      cursor: 'next',
    })
  })
  it('resets cursor when filters or baseline change', () => {
    expect(
      changeRuntimeGroupFilters({ namespace: 'old', cursor: 'next' }, { namespace: 'new' }),
    ).toEqual({ namespace: 'new' })
    expect(changeBaseline({ baseline: 'old', cursor: 'next' }, 'new')).toEqual({ baseline: 'new' })
  })
  it('preserves filters on cursor navigation', () =>
    expect({ ...parseRuntimeGroupSearch({ namespace: 'prod' }), cursor: 'next' }).toEqual({
      namespace: 'prod',
      cursor: 'next',
    }))
})

describe('observability query keys', () => {
  it('are canonical and include every server input', () => {
    expect(observabilityKeys.runtimeGroups('p', 'a', { namespace: 'n', event_kind: 'e' })).toEqual(
      observabilityKeys.runtimeGroups('p', 'a', { event_kind: 'e', namespace: 'n' }),
    )
    expect(observabilityKeys.runtimeGroups('p', 'a', { namespace: 'n' })).not.toEqual(
      observabilityKeys.runtimeGroups('p', 'a', { namespace: 'other' }),
    )
    expect(observabilityKeys.runtimeGroup('p', 'a', 'g')).not.toEqual(
      observabilityKeys.runtimeGroup('p', 'a', 'g2'),
    )
    expect(observabilityKeys.occurrences('p', 'a', 'g', 'one')).not.toEqual(
      observabilityKeys.occurrences('p', 'a', 'g', 'two'),
    )
    expect(observabilityKeys.releases('p', 'a', { cursor: 'one' })).not.toEqual(
      observabilityKeys.releases('p', 'a', { cursor: 'two' }),
    )
    expect(
      observabilityKeys.runtimeDiff('p', 'a', 'target', { baseline: 'b', cursor: 'c' }),
    ).not.toEqual(
      observabilityKeys.runtimeDiff('p', 'a', 'target', { baseline: 'b2', cursor: 'c' }),
    )
  })
  it('builds one bounded occurrence page request', () => {
    expect(runtimeGroupOccurrencesPath('group/id', 'opaque cursor')).toBe(
      '/api/v1/runtime-groups/group%2Fid/occurrences?cursor=opaque+cursor&limit=25',
    )
  })
  it('invalidates detail and every scoped list after lifecycle updates', async () => {
    const client = new QueryClient()
    const detail = observabilityKeys.runtimeGroup('p', 'a', 'g')
    const listOne = observabilityKeys.runtimeGroups('p', 'a', { status: 'open' })
    const listTwo = observabilityKeys.runtimeGroups('p', 'a', { cursor: 'next' })
    const other = observabilityKeys.runtimeGroups('p2', 'a2', {})
    client.setQueryData(detail, {})
    client.setQueryData(listOne, {})
    client.setQueryData(listTwo, {})
    client.setQueryData(other, {})
    await invalidateRuntimeGroupLifecycle(client, 'p', 'a', 'g')
    expect(client.getQueryState(detail)?.isInvalidated).toBe(true)
    expect(client.getQueryState(listOne)?.isInvalidated).toBe(true)
    expect(client.getQueryState(listTwo)?.isInvalidated).toBe(true)
    expect(client.getQueryState(other)?.isInvalidated).toBe(false)
  })
})

describe('observability presentation', () => {
  it('renders status and every diff label', () => {
    render(
      <>
        <RuntimeGroupStatusBadge status="open" />
        <RuntimeDiffClassificationBadge classification="new" />
        <RuntimeDiffClassificationBadge classification="disappeared" />
        <RuntimeDiffClassificationBadge classification="unchanged" />
      </>,
    )
    for (const label of ['open', 'NEW', 'DISAPPEARED', 'UNCHANGED'])
      expect(screen.getByText(label)).toBeInTheDocument()
  })
  it('uses an injectable clock for recency', () => {
    expect(isRecentlyFirstSeen('2026-08-17T00:00:00Z', Date.parse('2026-08-17T12:00:00Z'))).toBe(
      true,
    )
    expect(isRecentlyFirstSeen('2026-08-15T00:00:00Z', Date.parse('2026-08-17T12:00:00Z'))).toBe(
      false,
    )
    expect(isRecentlyFirstSeen('invalid', Date.parse('2026-08-17T12:00:00Z'))).toBe(false)
    expect(isRecentlyFirstSeen('2026-08-18T00:00:00Z', Date.parse('2026-08-17T12:00:00Z'))).toBe(
      false,
    )
  })
  it('maps lifecycle actions without exposing invalid transitions', () => {
    expect(validLifecycleActions('open')).toEqual(['acknowledge', 'resolve'])
    expect(validLifecycleActions('acknowledged')).toEqual(['resolve', 'reopen'])
    expect(validLifecycleActions('resolved')).toEqual(['reopen'])
    expect(validLifecycleActions('unknown')).toEqual([])
  })
  it('explains every notification state independently of severity', () => {
    const states = [
      'pending',
      'not_configured',
      'delivering',
      'delivered',
      'terminally_failed',
      'backfill_suppressed',
    ] as const
    for (const state of states) {
      const copy = getNotificationPresentation(state)
      expect(copy.label).toBeTruthy()
      expect(copy.description).toBeTruthy()
    }
    expect(getNotificationPresentation('pending').description).toContain('has not completed')
    expect(getNotificationPresentation('not_configured').description).toContain(
      'webhook destination',
    )
    render(
      <NotificationSummary
        notification={{
          state: 'terminally_failed',
          delivery_count: 2,
          succeeded_count: 0,
          failed_count: 2,
        }}
      />,
    )
    expect(screen.getByText('Delivery failed')).toBeInTheDocument()
    expect(screen.queryByText(/severity|risk/i)).not.toBeInTheDocument()
  })
  it('renders only notification summary fields and neutral occurrence fallbacks', () => {
    const notification = {
      state: 'delivered' as const,
      delivery_count: 1,
      succeeded_count: 1,
      failed_count: 0,
      signing_secret: 'must-not-render',
    }
    render(
      <>
        <NotificationSummary notification={notification} />
        <OccurrenceTimeline
          occurrences={[
            {
              id: 'occurrence',
              event_id: 'event',
              observed_at: '2026-08-17T12:00:00Z',
              node_name: '',
              namespace: '',
              pod_name: '',
              container_name: '',
              process_command: '',
              event_kind: 'exec',
              payload: {
                type: 'ProcessExec',
                data: { executable: '/bin/sh', parent_command: null },
              },
              release_id: null,
              release_version: null,
            },
          ]}
        />
      </>,
    )
    expect(screen.queryByText('must-not-render')).not.toBeInTheDocument()
    expect(screen.getAllByText('Unavailable')).toHaveLength(6)
  })
  it('renders network destinations as inert text and explains every syscall outcome', () => {
    render(
      <>
        <SemanticSummary
          value={{
            process_command: 'curl',
            address_family: 'ipv6',
            destination_address: '2001:db8::7',
            destination_port: 443,
          }}
        />
        <OccurrenceTimeline
          occurrences={(['succeeded', 'in_progress', 'failed'] as const).map((outcome, index) => ({
            id: `occurrence-${outcome}`,
            event_id: `event-${outcome}`,
            observed_at: '2026-08-17T12:00:00Z',
            node_name: 'node-1',
            namespace: 'production',
            pod_name: 'api-1',
            container_name: 'api',
            process_command: 'curl',
            event_kind: 'network.connect',
            payload: {
              type: 'NetworkConnect',
              data: {
                address_family: index === 0 ? 'ipv4' : 'ipv6',
                destination_address: index === 0 ? '203.0.113.7' : '2001:db8::7',
                destination_port: 443,
                outcome,
                ...(outcome === 'succeeded'
                  ? {}
                  : { errno: outcome === 'in_progress' ? 115 : 111 }),
              },
            },
            release_id: null,
            release_version: null,
          }))}
        />
      </>,
    )
    expect(screen.getAllByText('2001:db8::7').length).toBeGreaterThan(0)
    expect(screen.getByText('203.0.113.7')).toBeInTheDocument()
    expect(screen.getByText('Syscall succeeded')).toBeInTheDocument()
    expect(screen.getByText(/establishment is not confirmed/)).toBeInTheDocument()
    expect(screen.getByText('Syscall failed')).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /203\.0\.113\.7|2001:db8::7/ }),
    ).not.toBeInTheDocument()
    for (const forbidden of ['packet payload', 'dns_name', 'source_port', 'https://'])
      expect(screen.queryByText(forbidden)).not.toBeInTheDocument()
    expect(formatCount(1_234_567)).toBe('1,234,567')
    expect(screen.getAllByText('Unavailable')).toHaveLength(3)
  })
  it('renders markup literally, bounds nesting, and copies original JSON', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const deep = { html: '<script>alert(1)</script>', a: { b: { c: { d: { e: { f: true } } } } } }
    const { container } = render(<JsonDetailsViewer value={deep} />)
    expect(screen.getByText('“<script>alert(1)</script>”')).toBeInTheDocument()
    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByText('… nested value')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Copy JSON details' }))
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(deep, null, 2))
    expect(screen.getByText('JSON copied')).toBeInTheDocument()
  })
  it('announces copy failure', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    render(<JsonDetailsViewer value={{ x: true }} />)
    await userEvent.click(screen.getByRole('button', { name: 'Copy JSON details' }))
    expect(screen.getByText('Could not copy JSON')).toBeInTheDocument()
  })
})
