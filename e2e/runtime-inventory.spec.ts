import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { authenticate, mockApi } from './fixtures'

test('explores Runtime Inventory scope, kinds, cursors, and evidence', async ({ page }) => {
  const { project, application } = await mockApi(page)
  await page.goto(`/projects/${project.id}/applications/${application.id}`)
  await authenticate(page)
  await page.getByRole('link', { name: 'View runtime inventory' }).click()
  await expect(page.getByRole('heading', { name: 'Runtime Inventory' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Processes/ })).toContainText('1')

  await page.getByLabel('Namespace').fill('production')
  await expect(page).toHaveURL(/namespace=production/)
  await page.getByLabel('Search observed identity').fill('api')
  await expect(page).toHaveURL(/search=api/)

  await page.getByRole('tab', { name: 'Domains' }).click()
  await expect(page).toHaveURL(/kind=domain/)
  await expect(page.getByText(/api\.example\.com/)).toBeVisible()
  await page.getByRole('tab', { name: 'Processes' }).click()
  await expect(page.getByText("<img src=x onerror=alert('inventory')>")).toBeVisible()
  await expect(page.locator('img')).toHaveCount(0)

  await page.getByRole('link', { name: 'View evidence' }).click()
  await expect(page.getByRole('tab', { name: 'Releases' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('Observed', { exact: true })).toBeVisible()
  await expect(page.getByText('Not observed in available evidence')).toBeVisible()
  await expect(page.getByText(/absent|removed|safe/i)).toHaveCount(0)

  await page.getByRole('tab', { name: 'Sightings' }).click()
  await expect(page.getByText("<script>alert('scope')</script>")).toBeVisible()
  await expect(page.locator('script', { hasText: "alert('scope')" })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /javascript:alert/ })).toHaveCount(0)
  await page.getByRole('tab', { name: 'Occurrences' }).click()
  await expect(page.getByText('203.0.113.7')).toBeVisible()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])

  await page.goBack()
  await expect(page.getByRole('tab', { name: 'Sightings' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Runtime Inventory' })
    .click()
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByRole('heading', { name: 'End of inventory results' })).toBeVisible()
  await expect(page).toHaveURL(/cursor=terminal/)
  await page.getByRole('button', { name: 'Return to first page' }).first().click()
  await expect(page).not.toHaveURL(/cursor=/)
})

test('Runtime Inventory is keyboard accessible at a narrow viewport', async ({ page }) => {
  const { project, application } = await mockApi(page)
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto(
    `/projects/${project.id}/applications/${application.id}/runtime-inventory?kind=process`,
  )
  await authenticate(page)
  await expect(page.getByRole('heading', { name: 'Runtime Inventory' })).toBeVisible()
  await page.keyboard.press('Tab')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('withholds Runtime Inventory evidence on ownership mismatch', async ({ page }) => {
  const { project, application } = await mockApi(page)
  const itemId = '10000000-0000-4000-8000-000000000001'
  await page.route(`**/runtime-inventory/${itemId}`, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        id: itemId,
        project_id: project.id,
        application_id: 'wrong',
        inventory_kind: 'process',
        identity_version: 1,
        semantic_summary: { executable: '/withheld' },
        first_seen_at: '2026-08-17T10:00:00Z',
        last_seen_at: '2026-08-18T10:00:00Z',
        occurrence_count: 1,
        release_count: 1,
        cluster_count: 1,
        namespace_count: 1,
        workload_count: 1,
        pod_count: 1,
        container_count: 1,
        group_count: 1,
        evidence: { releases: '', sightings: '', groups: '', occurrences: '' },
      }),
    }),
  )
  await page.goto(
    `/projects/${project.id}/applications/${application.id}/runtime-inventory/${itemId}?evidence=releases`,
  )
  await authenticate(page)
  await expect(page.getByRole('heading', { name: /does not belong/ })).toBeVisible()
  await expect(page.getByText('Trusted attributed occurrences')).toHaveCount(0)
})
