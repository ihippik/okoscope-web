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

const json = (route: Route, body: unknown, status = 200, requestId = 'e2e-request') =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'x-request-id': requestId },
    body: JSON.stringify(body),
  })

export async function mockApi(page: Page) {
  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname
    if (path === '/api/v1/build-info')
      return json(route, {
        service_version: '0.1.0',
        git_commit: 'abcdef',
        api_version: 'v1',
        required_database_migration: 5,
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
    return json(
      route,
      { error: 'not_found', message: 'resource not found', request_id: 'missing-id' },
      404,
      'missing-id',
    )
  })
  return { organization, project, application }
}

export async function authenticate(page: Page) {
  await page.getByLabel('Bearer credential').fill('e2e-secret')
  await page.getByRole('button', { name: 'Start session' }).click()
}
