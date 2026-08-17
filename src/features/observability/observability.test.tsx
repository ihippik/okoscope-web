import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  JsonDetailsViewer,
  RuntimeDiffClassificationBadge,
  RuntimeGroupStatusBadge,
  isRecentlyFirstSeen,
} from './components'
import { observabilityKeys } from './queries'
import {
  changeBaseline,
  changeRuntimeGroupFilters,
  parseReleaseSearch,
  parseRuntimeDiffSearch,
  parseRuntimeGroupSearch,
} from './url-state'

afterEach(cleanup)

describe('observability URL state', () => {
  it('parses, trims and rejects invalid values', () => {
    expect(
      parseRuntimeGroupSearch({
        event_kind: ' exec ',
        status: 'closed',
        since: 'nope',
        cursor: '',
      }),
    ).toEqual({ event_kind: 'exec' })
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
    expect(observabilityKeys.releases('p', 'a', { cursor: 'one' })).not.toEqual(
      observabilityKeys.releases('p', 'a', { cursor: 'two' }),
    )
    expect(
      observabilityKeys.runtimeDiff('p', 'a', 'target', { baseline: 'b', cursor: 'c' }),
    ).not.toEqual(
      observabilityKeys.runtimeDiff('p', 'a', 'target', { baseline: 'b2', cursor: 'c' }),
    )
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
