import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { authenticate, mockApi } from './fixtures'

test('explores runtime groups and release diff with history and deep links', async ({ page }) => {
  const { project, application, group } = await mockApi(page)
  await page.goto(`/projects/${project.id}/applications/${application.id}`)
  await authenticate(page)
  await page.getByRole('link', { name: 'View runtime groups' }).click()
  await expect(page.getByRole('heading', { name: 'Runtime Groups' })).toBeVisible()
  await page.getByLabel('Namespace').fill('production')
  await page.getByRole('button', { name: 'Apply filters' }).click()
  await expect(page).toHaveURL(/namespace=production/)
  await page.getByRole('link', { name: 'process.exec' }).click()
  await expect(page.getByRole('heading', { name: 'Representative event' })).toBeVisible()
  await expect(page.getByText('node-1').first()).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/namespace=production/)
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Gateway' })
    .click()
  await page.getByRole('link', { name: 'View releases' }).click()
  await page.getByRole('link', { name: 'View runtime diff' }).first().click()
  await expect(page.getByText('NEW')).toBeVisible()
  await page.getByLabel('Baseline release').selectOption({ label: 'v1' })
  await expect(page).toHaveURL(/baseline=/)
  await page.getByRole('link', { name: 'View group' }).click()
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
  await expect(page.getByRole('heading', { name: 'Runtime Groups' })).toBeVisible()
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
