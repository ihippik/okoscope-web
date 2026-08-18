import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import fixture from './runtime-inventory.fixture.json'
import { EvidenceList, InventoryIdentity, InventorySummaryCards } from './components'
import {
  expectedEvidencePath,
  inventoryFacetPath,
  inventoryKeys,
  isInvalidCursorError,
  validateEvidencePath,
} from './queries'
import {
  changeEvidence,
  changeInventoryScope,
  parseInventoryDetailSearch,
  parseInventorySearch,
  summarySearch,
} from './url-state'
import { ApiClientError } from '../../shared/api/client'
import { contractFixture } from '../../shared/api/types'

describe('runtime inventory URL state', () => {
  it('normalizes scope and bounds search while preserving opaque cursors', () => {
    expect(
      parseInventorySearch({
        kind: 'domain',
        namespace: ' production ',
        observed_from: 'invalid',
        search: ` ${'x'.repeat(205)} `,
        cursor: 'opaque:not-a-uuid',
      }),
    ).toEqual({
      kind: 'domain',
      namespace: 'production',
      search: 'x'.repeat(200),
      cursor: 'opaque:not-a-uuid',
    })
    expect(parseInventorySearch({ kind: 'nope' })).toEqual({ kind: 'process' })
  })

  it('resets only the affected collection or evidence cursor', () => {
    expect(
      changeInventoryScope(
        { kind: 'process', namespace: 'old', cursor: 'opaque' },
        { namespace: 'new' },
      ),
    ).toEqual({ kind: 'process', namespace: 'new' })
    expect(changeEvidence({ evidence: 'releases', cursor: 'opaque' }, 'groups')).toEqual({
      evidence: 'groups',
    })
    expect(parseInventoryDetailSearch({ evidence: 'wat', cursor: ' c ' })).toEqual({
      evidence: 'releases',
      cursor: 'c',
    })
  })

  it('removes kind and cursor from summary scope', () => {
    expect(
      summarySearch({ kind: 'syscall', namespace: 'prod', search: 'wait', cursor: 'next' }),
    ).toEqual({ namespace: 'prod', search: 'wait' })
  })
})

describe('runtime inventory query boundary', () => {
  it('partitions cache identity by every scope and cursor input', () => {
    const first = inventoryKeys.list('p', 'a', { kind: 'process', namespace: 'one' })
    const second = inventoryKeys.list('p', 'a', { kind: 'process', namespace: 'two' })
    expect(first).not.toEqual(second)
    expect(inventoryKeys.evidence('p', 'a', 'i', 'groups', 'one')).not.toEqual(
      inventoryKeys.evidence('p', 'a', 'i', 'groups', 'two'),
    )
  })

  it('omits a requested facet own value and bounds the page', () => {
    const path = inventoryFacetPath(
      'p',
      'a',
      'namespace',
      { kind: 'domain', namespace: 'old', workload_name: 'api' },
      'pro',
      'opaque cursor',
    )
    expect(path).toContain('/facets/namespace?')
    expect(path).not.toContain('namespace=old')
    expect(path).toContain('workload_name=api')
    expect(path).toContain('facet_search=pro')
    expect(path).toContain('cursor=opaque+cursor')
    expect(path).toContain('limit=50')
  })

  it('validates exact relative evidence paths', () => {
    const expected = expectedEvidencePath('p', 'a', 'i', 'releases')
    expect(validateEvidencePath(expected, 'p', 'a', 'i', 'releases')).toBe(expected)
    expect(() => validateEvidencePath('https://evil.test', 'p', 'a', 'i', 'releases')).toThrow(
      'unsafe evidence link',
    )
  })

  it('recognizes only documented cursor errors', () => {
    expect(
      isInvalidCursorError(
        new ApiClientError({
          kind: 'api',
          status: 400,
          code: 'invalid_cursor',
          message: 'bad cursor',
          requestId: 'request',
        }),
      ),
    ).toBe(true)
    expect(
      isInvalidCursorError(
        new ApiClientError({
          kind: 'api',
          status: 400,
          code: 'invalid_parameter',
          message: 'bad filter',
          requestId: 'request',
        }),
      ),
    ).toBe(false)
  })
})

describe('runtime inventory safe presentation', () => {
  it('uses summary response values and a zero fallback', () => {
    const onKind = vi.fn()
    render(
      <InventorySummaryCards
        summary={{
          ...contractFixture.inventorySummary,
          kinds: contractFixture.inventorySummary.kinds,
        }}
        activeKind="process"
        onKind={onKind}
      />,
    )
    expect(screen.getByRole('button', { name: /Processes/ })).toHaveTextContent('1')
    expect(screen.getByRole('button', { name: /Domains/ })).toHaveTextContent('0')
    fireEvent.click(screen.getByRole('button', { name: /Syscalls/ }))
    expect(onKind).toHaveBeenCalledWith('syscall')
  })

  it('renders the prepared unsafe identity as inert text', () => {
    render(
      <InventoryIdentity
        item={{
          ...contractFixture.inventoryItemDetail,
          semantic_summary: fixture.unsafe_display_text.semantic_summary,
        }}
      />,
    )
    expect(screen.getByText(fixture.unsafe_display_text.semantic_summary.executable)).toBeVisible()
    expect(document.querySelector('img')).toBeNull()
    expect(document.querySelector('script')).toBeNull()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('explains all release states without absence claims', () => {
    const observed = contractFixture.inventoryReleasePage.items[0]!
    render(
      <EvidenceList
        kind="releases"
        page={{
          items: [
            observed,
            {
              ...observed,
              release_id: '40000000-0000-4000-8000-000000000002',
              version: '2.13.0',
              presence: 'not_observed',
              occurrence_count: null,
              first_seen_at: null,
              last_seen_at: null,
              release_evidence_count: 48,
            },
            {
              ...observed,
              release_id: '40000000-0000-4000-8000-000000000003',
              version: '2.12.0',
              presence: 'unknown',
              occurrence_count: null,
              first_seen_at: null,
              last_seen_at: null,
              release_evidence_count: 0,
            },
          ],
          next_cursor: null,
        }}
      />,
    )
    expect(screen.getByText('Observed')).toBeVisible()
    expect(screen.getByText('Not observed in available evidence')).toBeVisible()
    expect(screen.getByText('Unknown')).toBeVisible()
    expect(screen.getByText('55')).toBeVisible()
    expect(screen.queryByText(/absent|removed|safe/i)).not.toBeInTheDocument()
  })
})
