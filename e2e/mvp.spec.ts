import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { authenticate, mockApi } from './fixtures'

test('navigates Organization → Projects → Applications and supports a deep link', async ({
  page,
}) => {
  const { project, application } = await mockApi(page)
  await page.goto('/')
  await authenticate(page)
  await expect(page.getByRole('heading', { name: 'Acme' })).toBeVisible()
  await page.getByRole('link', { name: 'View projects' }).click()
  await expect(page.getByRole('heading', { name: 'Projects', level: 1 })).toBeVisible()
  await page.getByRole('link', { name: /Platform/ }).click()
  await expect(page.getByRole('heading', { name: 'Applications' })).toBeVisible()
  await page.getByRole('link', { name: /Gateway/ }).click()
  await expect(page.getByRole('heading', { name: 'Gateway' })).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Bearer credential')).toBeVisible()
  await authenticate(page)
  await expect(page).toHaveURL(`/projects/${project.id}/applications/${application.id}`)
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Platform')
})

test('credential flow and primary navigation have no detectable accessibility violations', async ({
  page,
}) => {
  await mockApi(page)
  await page.goto('/')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await authenticate(page)
  await expect(page.getByRole('heading', { name: 'Acme' })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('blocks an incompatible backend with diagnostics', async ({ page }) => {
  await page.route('**/api/v1/build-info', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        service_version: '2.0.0',
        git_commit: 'future',
        api_version: 'v2',
        required_database_migration: 8,
      }),
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Unsupported API version' })).toBeVisible()
  await expect(page.getByText('v2')).toBeVisible()
  await expect(page.getByLabel('Bearer credential')).toHaveCount(0)
})

test('shows invalid runtime configuration without API fallback', async ({ page }) => {
  await page.route('**/config.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: 'window.__OKOSCOPE_CONFIG__ = { apiBaseUrl: "ftp://invalid" }',
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Okoscope cannot start' })).toBeVisible()
})

test('shows correlated API errors and clears a rejected credential', async ({ page }) => {
  await page.route('**/api/v1/**', async (route) => {
    if (route.request().url().endsWith('/build-info'))
      return route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          service_version: '0.1.0',
          git_commit: 'abc',
          api_version: 'v1',
          required_database_migration: 5,
        }),
      })
    return route.fulfill({
      status: 401,
      contentType: 'application/json',
      headers: { 'x-request-id': 'rejected-credential' },
      body: JSON.stringify({
        error: 'unauthorized',
        message: 'Credential rejected',
        request_id: 'body-id',
      }),
    })
  })
  await page.goto('/projects')
  await authenticate(page)
  await expect(page.getByLabel('Bearer credential')).toBeVisible()
})

test('reports malformed and server responses safely', async ({ page }) => {
  await page.route('**/api/v1/build-info', (route) =>
    route.fulfill({
      contentType: 'text/plain',
      headers: { 'x-request-id': 'malformed-id' },
      body: 'not-json',
    }),
  )
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Backend unavailable' })).toBeVisible()
  await expect(page.getByText(/malformed-id/)).toBeVisible()
})

test('loads another Project page without duplicating existing items', async ({ page }) => {
  await mockApi(page)
  let pageNumber = 0
  await page.route('**/api/v1/projects?**', (route) => {
    pageNumber += 1
    const item = {
      id: `00000000-0000-4000-8000-00000000000${pageNumber + 3}`,
      slug: `project-${pageNumber}`,
      name: `Project ${pageNumber}`,
      created_at: '2026-08-17T12:00:00Z',
      archived_at: null,
      application_count: 0,
      runtime_group_count: 0,
    }
    return route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ items: [item], next_cursor: pageNumber === 1 ? item.id : null }),
    })
  })
  await page.goto('/projects')
  await authenticate(page)
  await expect(page.getByText('Project 1')).toBeVisible()
  await page.getByRole('button', { name: 'Load more projects' }).click()
  await expect(page.getByText('Project 2')).toBeVisible()
  await expect(page.getByText('Project 1')).toHaveCount(1)
})

test('shows a scoped 404 recovery state', async ({ page }) => {
  await mockApi(page)
  await page.goto('/projects/00000000-0000-4000-8000-999999999999')
  await authenticate(page)
  await expect(page.getByRole('heading', { name: 'Project not found' })).toBeVisible()
  await expect(page.getByText(/missing-id/)).toBeVisible()
})

test('shows a correlated server error with retry', async ({ page }) => {
  await mockApi(page)
  await page.route('**/api/v1/projects?**', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      headers: { 'x-request-id': 'server-error-id' },
      body: JSON.stringify({
        error: 'internal_error',
        message: 'Internal server error',
        request_id: 'body-id',
      }),
    }),
  )
  await page.goto('/projects')
  await authenticate(page)
  await expect(page.getByRole('heading', { name: 'Projects could not be loaded' })).toBeVisible()
  await expect(page.getByText(/server-error-id/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
})
