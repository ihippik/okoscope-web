import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { authenticate, mockApi } from './fixtures'

test('explores new discoveries and release changes with history and deep links', async ({
  page,
}) => {
  const { project, application, group } = await mockApi(page)
  await page.goto(`/projects/${project.id}/applications/${application.id}`)
  await authenticate(page)
  await page.getByRole('link', { name: /New discoveries/ }).click()
  await expect(page.getByRole('heading', { name: 'New discoveries' })).toBeVisible()
  await page.getByLabel('Language').selectOption('ru')
  await expect(page.getByRole('link', { name: 'Исходящее соединение' })).toBeVisible()
  await page.getByLabel('Язык').selectOption('en')
  await expect(page.getByRole('link', { name: 'Outbound connection' })).toBeVisible()
  await expect(page.getByText('Исходящее соединение', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Tile view' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.locator('[data-view="grid"]')).toBeVisible()
  await page.getByRole('button', { name: 'List view' }).click()
  await expect(page.locator('[data-view="list"]')).toBeVisible()
  await page.getByRole('button', { name: 'Tile view' }).click()
  await page.getByText('Advanced filters').click()
  await page.getByLabel('Namespace').fill('production')
  await page.getByRole('button', { name: 'Apply filters' }).click()
  await expect(page).toHaveURL(/namespace=production/)
  await page.getByLabel('Event kind').fill('network.connect')
  await page.getByRole('button', { name: 'Apply filters' }).click()
  await expect(page).toHaveURL(/event_kind=network.connect/)
  await page.getByRole('link', { name: 'Outbound connection' }).click()
  await expect(page.getByRole('heading', { name: 'Observation history' })).toBeVisible()
  const observationHistory = page.getByRole('region', { name: 'Observation history' })
  await expect(page.getByRole('button', { name: 'Tile view' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(observationHistory.locator('[data-view="grid"]')).toBeVisible()
  await page.getByRole('button', { name: 'List view' }).click()
  await expect(observationHistory.locator('[data-view="list"]')).toBeVisible()
  await page.getByRole('button', { name: 'Tile view' }).click()
  await expect(page.getByText('node-1').first()).toBeVisible()
  await page.getByText('Technical details').nth(1).click()
  await expect(page.getByText('203.0.113.7').first()).toBeVisible()
  await expect(page.getByText('Syscall succeeded').first()).toBeVisible()
  await expect(page.getByText('Recently observed DNS evidence').first()).toBeVisible()
  await expect(page.getByText(/Ambiguous: multiple names/).first()).toBeVisible()
  await expect(page.getByText('api.example.com').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'api.example.com' })).toHaveCount(0)
  await expect(page.getByText('Pending', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Acknowledge' }).click()
  await expect(page.getByRole('button', { name: 'Reopen' })).toBeVisible()
  await page.getByRole('button', { name: 'Resolve' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused()
  await page.getByRole('button', { name: 'Confirm resolve' }).click()
  await expect(page.getByRole('button', { name: 'Reopen' })).toBeVisible()
  await page.getByRole('button', { name: 'Reopen' }).click()
  await expect(page.getByRole('button', { name: 'Acknowledge' })).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.goBack()
  await expect(page).toHaveURL(/namespace=production/)
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Gateway' })
    .click()
  await page.getByRole('link', { name: 'Releases' }).click()
  await page.getByRole('link', { name: 'View changes' }).first().click()
  await expect(
    page.getByRole('region', { name: 'Complete release comparison summary' }),
  ).toBeVisible()
  await expect(page.getByText('Largest observation-count changes')).toBeVisible()
  await expect(page.getByText('New', { exact: true }).last()).toBeVisible()
  await page.getByLabel('Baseline release').selectOption({ label: 'v1' })
  await expect(page).toHaveURL(/baseline=/)
  await page.getByRole('link', { name: 'View discovery' }).click()
  await expect(page).toHaveURL(new RegExp(`${group.id}$`))
  await page.goBack()
  await page.goForward()
})

test('observability routes are keyboard accessible at a narrow viewport and axe-clean', async ({
  page,
}) => {
  const { project, application } = await mockApi(page)
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(`/projects/${project.id}/applications/${application.id}/runtime-groups`)
  await authenticate(page)
  await page.keyboard.press('Tab')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await expect(page.getByRole('heading', { name: 'New discoveries' })).toBeVisible()
})

test('restores all first-seen filters and cursor through detail navigation', async ({ page }) => {
  const { project, application } = await mockApi(page)
  const search = new URLSearchParams({
    event_kind: 'network.connect',
    status: 'acknowledged',
    release_id: 'release',
    first_seen_from: '2026-08-16T00:00:00Z',
    first_seen_to: '2026-08-18T00:00:00Z',
    last_seen_to: '2026-08-18T12:00:00Z',
    cursor: 'opaque-cursor',
  })
  await page.goto(`/projects/${project.id}/applications/${application.id}/runtime-groups?${search}`)
  await authenticate(page)
  await page.getByRole('link', { name: 'Outbound connection' }).click()
  await page.goBack()
  await expect(page).toHaveURL(/status=acknowledged/)
  await expect(page).toHaveURL(/cursor=opaque-cursor/)
  await expect(page).toHaveURL(/first_seen_from=/)
})

test('withholds runtime group data on route ownership mismatch', async ({ page }) => {
  const { project, application, group } = await mockApi(page)
  await page.route(`**/api/v1/runtime-groups/${group.id}`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        ...group,
        project_id: 'wrong',
        representative_event: {},
        recent_occurrences: [],
      }),
    }),
  )
  await page.goto(
    `/projects/${project.id}/applications/${application.id}/runtime-groups/${group.id}`,
  )
  await authenticate(page)
  await expect(page.getByRole('heading', { name: /does not belong/ })).toBeVisible()
  await expect(page.getByText('/app/gateway')).toHaveCount(0)
})
