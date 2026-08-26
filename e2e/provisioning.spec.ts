import { expect, test, type Page, type Route } from '@playwright/test'

test.use({ trace: 'off' })

const organization = {
  id: '00000000-0000-4000-8000-000000000101',
  name: 'Acme',
  slug: 'acme',
  created_at: '2026-08-26T00:00:00Z',
}
const project = {
  id: '00000000-0000-4000-8000-000000000102',
  organization_id: organization.id,
  name: 'Production',
  slug: 'production',
  created_at: '2026-08-26T00:00:00Z',
}
const application = {
  id: '00000000-0000-4000-8000-000000000103',
  organization_id: organization.id,
  project_id: project.id,
  name: 'Payment API',
  slug: 'payment-api',
  created_at: '2026-08-26T00:00:00Z',
}
const token = 'oko_app_v1_e2e_one_time_secret'
const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'x-request-id': 'provisioning-e2e' },
    body: JSON.stringify(body),
  })

async function mockProvisioning(page: Page) {
  let organizations: (typeof organization)[] = []
  let projects: (typeof project)[] = []
  let applications: (typeof application)[] = []
  let credentials = [
    {
      id: 'credential-default',
      name: 'default',
      token_hint: '…cret',
      created_at: '2026-08-26T00:00:00Z',
      last_used_at: null,
      revoked_at: null as string | null,
    },
  ]
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const path = new URL(request.url()).pathname
    const method = request.method()
    if (path === '/api/v1/build-info')
      return json(route, {
        service_version: '1',
        git_commit: 'test',
        api_version: 'v1',
        required_database_migration: 15,
      })
    if (path === '/api/v1/admin/organizations' && method === 'GET')
      return json(route, { items: organizations })
    if (path === '/api/v1/organizations' && method === 'POST') {
      organizations = [organization]
      return json(route, organization, 201)
    }
    if (path.endsWith(`/admin/organizations/${organization.id}/projects`))
      return json(route, { items: projects })
    if (path.endsWith(`/organizations/${organization.id}/projects`) && method === 'POST') {
      projects = [project]
      return json(route, project, 201)
    }
    if (path === `/api/v1/admin/projects/${project.id}/applications` && method === 'GET')
      return json(route, { items: applications })
    if (path === `/api/v1/projects/${project.id}/applications` && method === 'POST') {
      applications = [application]
      return json(
        route,
        {
          application,
          credential: {
            id: 'credential-default',
            name: 'default',
            token,
            token_hint: '…cret',
            created_at: '2026-08-26T00:00:00Z',
            shown_once: true,
          },
        },
        201,
      )
    }
    if (path === `/api/v1/admin/projects/${project.id}/applications/${application.id}`)
      return json(route, application)
    if (path.endsWith(`/applications/${application.id}/credentials`) && method === 'GET')
      return json(route, { items: credentials })
    if (path.endsWith(`/applications/${application.id}/credentials`) && method === 'POST')
      return json(
        route,
        {
          id: 'credential-rotation',
          name: 'rotation',
          token: 'oko_app_v1_rotation_secret',
          token_hint: '…tion',
          created_at: '2026-08-26T01:00:00Z',
          shown_once: true,
        },
        201,
      )
    if (path.endsWith('/credentials/credential-default') && method === 'DELETE') {
      credentials = credentials.map((item) => ({ ...item, revoked_at: '2026-08-26T02:00:00Z' }))
      return route.fulfill({ status: 204 })
    }
    return json(route, { error: 'not_found', message: 'Not found', request_id: 'missing' }, 404)
  })
}

async function authenticate(page: Page) {
  await page.getByRole('button', { name: 'Start session' }).click()
}

test('provisions hierarchy, exposes the token once, and manages credentials', async ({ page }) => {
  await mockProvisioning(page)
  await page.goto('/onboarding')
  await authenticate(page)
  for (const [name, slug, button, nextHeading] of [
    ['Acme', 'acme', 'Create Organization', 'Project'],
    ['Production', 'production', 'Create Project', 'Application'],
    ['Payment API', 'payment-api', 'Create Application', 'Payment API'],
  ] as const) {
    await page.getByLabel('Name').fill(name)
    await expect(page.getByLabel('Slug')).toHaveValue(slug)
    await page.getByRole('button', { name: button }).click()
    await expect(page.getByRole('heading', { name: nextHeading, exact: true })).toBeVisible()
  }
  await expect(page.getByText(token, { exact: true })).toBeVisible()
  await expect(page.getByText(/payment-api: oko_app_v1_e2e/)).toBeVisible()
  await page.getByRole('button', { name: 'Done' }).click()
  await expect(page).toHaveURL(`/admin/projects/${project.id}/applications/${application.id}`)
  await expect(page.getByText(token, { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Issue credential' }).click()
  await page.getByLabel('Name').fill('rotation')
  await page.getByRole('dialog').getByRole('button', { name: 'Issue credential' }).click()
  await expect(page.getByText('oko_app_v1_rotation_secret')).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByText('oko_app_v1_rotation_secret')).toHaveCount(0)
  await page.getByRole('button', { name: 'Revoke' }).click()
  await expect(page.getByRole('dialog')).toContainText('last active credential')
  await page.getByRole('button', { name: 'Confirm revoke' }).click()
  await expect(page.getByText('Revoked')).toBeVisible()
})
