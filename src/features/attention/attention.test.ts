import { describe, expect, it } from 'vitest'
import { populatedOrganizationAttentionFixture } from './fixtures'
import { attentionDestination } from './routing'
import { parseAttentionSearch } from './url-state'

describe('attention URL state', () => {
  it('accepts contract windows and defaults everything else to 24h', () => {
    expect(parseAttentionSearch({})).toEqual({ window: '24h' })
    expect(parseAttentionSearch({ window: '24h' })).toEqual({ window: '24h' })
    expect(parseAttentionSearch({ window: '7d' })).toEqual({ window: '7d' })
    expect(parseAttentionSearch({ window: '30d' })).toEqual({ window: '24h' })
  })
})

describe('attention resource routing', () => {
  it('maps every generated resource variant to an owned route destination', () => {
    expect(attentionDestination({ type: 'project', project_id: 'p' })).toEqual({
      kind: 'project',
      projectId: 'p',
    })
    expect(
      attentionDestination({ type: 'application', project_id: 'p', application_id: 'a' }),
    ).toEqual({ kind: 'application', projectId: 'p', applicationId: 'a' })
    expect(
      attentionDestination({
        type: 'runtime_group',
        project_id: 'p',
        application_id: 'a',
        runtime_group_id: 'g',
        event_kind: 'process.exec',
        semantic_summary: { executable: 'worker' },
        namespace: 'production',
        workload_kind: 'Deployment',
        workload_name: 'worker',
      }),
    ).toEqual({ kind: 'runtime-group', projectId: 'p', applicationId: 'a', groupId: 'g' })
    expect(
      attentionDestination({
        type: 'runtime_diff',
        project_id: 'p',
        application_id: 'a',
        target_release_id: 'target',
        baseline_release_id: 'baseline',
      }),
    ).toEqual({
      kind: 'runtime-diff',
      projectId: 'p',
      applicationId: 'a',
      targetReleaseId: 'target',
      baselineReleaseId: 'baseline',
    })
  })

  it('uses notification context for broad Project resources and fails closed', () => {
    expect(
      attentionDestination(
        { type: 'project', project_id: 'p' },
        { recommendationKind: 'configure_webhook_destination' },
      ),
    ).toEqual({ kind: 'notifications', projectId: 'p' })
    expect(attentionDestination({ type: 'future', href: 'javascript:alert(1)' })).toBeNull()
    expect(attentionDestination(null)).toBeNull()
  })

  it('keeps hostile display values inert and outside destination construction', () => {
    const fixture = populatedOrganizationAttentionFixture
    expect(fixture.priority_items[0]?.project.name).toContain('<script>')
    expect(attentionDestination(fixture.priority_items[0]?.resource)).toEqual({
      kind: 'project',
      projectId: fixture.priority_items[0]?.project.id,
    })
  })
})
