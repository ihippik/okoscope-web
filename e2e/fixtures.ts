import type { Page, Route } from '@playwright/test'

const organization = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'acme',
  name: 'Acme',
  created_at: '2026-08-17T12:00:00Z',
}
const project = {
  id: '00000000-0000-4000-8000-000000000002',
  slug: 'platform',
  name: 'Platform',
  created_at: '2026-08-17T12:00:00Z',
  archived_at: null,
  application_count: 1,
  runtime_group_count: 3,
}
const application = {
  id: '00000000-0000-4000-8000-000000000003',
  project_id: project.id,
  slug: 'gateway',
  name: 'Gateway',
  created_at: '2026-08-17T12:00:00Z',
  release_count: 2,
  runtime_group_count: 3,
  latest_observed_at: null,
}
const group = {
  id: '00000000-0000-4000-8000-000000000004',
  project_id: project.id,
  application_id: application.id,
  cluster_id: '00000000-0000-4000-8000-000000000005',
  namespace: 'production',
  workload_kind: 'Deployment',
  workload_name: 'gateway',
  fingerprint_version: 1,
  event_kind: 'process.exec',
  semantic_summary: { command: '/app/gateway' },
  status: 'open',
  first_seen_at: '2026-08-17T10:00:00Z',
  first_seen_event_id: '00000000-0000-4000-8000-000000000006',
  last_seen_at: '2026-08-17T12:00:00Z',
  occurrence_count: 12,
  representative_event_id: '00000000-0000-4000-8000-000000000006',
  status_changed_at: null,
  status_changed_by: null,
}
const occurrence = {
  id: '00000000-0000-4000-8000-000000000007',
  event_id: group.representative_event_id,
  observed_at: '2026-08-17T12:00:00Z',
  node_name: 'node-1',
  namespace: 'production',
  pod_name: 'gateway-abc',
  container_name: 'gateway',
  process_command: '/app/gateway serve',
  event_kind: 'process.exec',
  payload: { argv: ['serve'] },
  release_id: '00000000-0000-4000-8000-000000000008',
  release_version: 'v2',
}
const targetRelease = {
  id: '00000000-0000-4000-8000-000000000008',
  project_id: project.id,
  application_id: application.id,
  version: 'v2',
  description: 'Current',
  deployed_at: '2026-08-17T11:00:00Z',
  created_at: '2026-08-17T11:00:00Z',
}
const baselineRelease = {
  id: '00000000-0000-4000-8000-000000000009',
  project_id: project.id,
  application_id: application.id,
  version: 'v1',
  description: 'Baseline',
  deployed_at: '2026-08-16T11:00:00Z',
  created_at: '2026-08-16T11:00:00Z',
}
const releases = [targetRelease, baselineRelease]

const json = (route: Route, body: unknown, status = 200, requestId = 'e2e-request') =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'x-request-id': requestId },
    body: JSON.stringify(body),
  })

export async function mockApi(page: Page) {
  let groupStatus: 'open' | 'acknowledged' | 'resolved' = 'open'
  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname
    if (path === '/api/v1/build-info')
      return json(route, {
        service_version: '0.1.0',
        git_commit: 'abcdef',
        api_version: 'v1',
        required_database_migration: 6,
      })
    if (!route.request().headers().authorization)
      return json(
        route,
        { error: 'unauthorized', message: 'Credential required', request_id: 'auth-id' },
        401,
        'auth-id',
      )
    if (path === '/api/v1/organization') return json(route, organization)
    if (path === '/api/v1/projects') return json(route, { items: [project], next_cursor: null })
    if (path === `/api/v1/projects/${project.id}`) return json(route, project)
    if (path === `/api/v1/projects/${project.id}/applications`)
      return json(route, { items: [application], next_cursor: null })
    if (path === `/api/v1/projects/${project.id}/applications/${application.id}`)
      return json(route, application)
    if (path === '/api/v1/runtime-groups')
      return json(route, { items: [{ ...group, status: groupStatus }], next_cursor: null })
    if (path === `/api/v1/runtime-groups/${group.id}/occurrences`)
      return json(route, { items: [occurrence], next_cursor: null })
    const action = path.match(
      new RegExp(`/api/v1/runtime-groups/${group.id}/(acknowledge|resolve|reopen)$`),
    )?.[1]
    if (action && route.request().method() === 'POST') {
      groupStatus =
        action === 'acknowledge' ? 'acknowledged' : action === 'resolve' ? 'resolved' : 'open'
      return json(route, {
        ...group,
        status: groupStatus,
        status_changed_at: '2026-08-17T13:00:00Z',
      })
    }
    if (path === `/api/v1/runtime-groups/${group.id}`)
      return json(route, {
        ...group,
        status: groupStatus,
        representative_event: occurrence,
        notification: { state: 'pending', delivery_count: 0, succeeded_count: 0, failed_count: 0 },
      })
    if (path === `/api/v1/projects/${project.id}/applications/${application.id}/releases`)
      return json(route, { items: releases, next_cursor: null })
    if (
      path ===
      `/api/v1/projects/${project.id}/applications/${application.id}/releases/${targetRelease.id}/runtime-diff`
    )
      return json(route, {
        baseline: baselineRelease,
        target: targetRelease,
        items: [
          {
            group_id: group.id,
            classification: 'new',
            event_kind: group.event_kind,
            semantic_summary: group.semantic_summary,
            baseline_occurrence_count: 0,
            baseline_first_seen_at: null,
            baseline_last_seen_at: null,
            target_occurrence_count: 12,
            target_first_seen_at: group.first_seen_at,
            target_last_seen_at: group.last_seen_at,
          },
        ],
        next_cursor: null,
      })
    return json(
      route,
      { error: 'not_found', message: 'resource not found', request_id: 'missing-id' },
      404,
      'missing-id',
    )
  })
  return { organization, project, application, group, releases }
}

export async function authenticate(page: Page) {
  await page.getByLabel('Bearer credential').fill('e2e-secret')
  await page.getByRole('button', { name: 'Start session' }).click()
}
