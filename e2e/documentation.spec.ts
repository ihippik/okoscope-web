import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { authenticate, mockApi } from './fixtures'

const titles = [
  ['overview', 'Meet Okoscope', 'Знакомство с Okoscope'],
  ['how-it-works', 'How it works', 'Принцип работы'],
  ['quick-start', 'Quick start', 'Быстрый старт'],
  ['self-hosting', 'Self-hosting', 'Самостоятельное развёртывание'],
  ['capabilities', 'Capabilities', 'Возможности'],
  ['workflows', 'Practical workflows', 'Практические сценарии'],
  ['compatibility-and-limits', 'Compatibility and limits', 'Совместимость и ограничения'],
  ['data-and-security', 'Data and security', 'Данные и безопасность'],
  ['troubleshooting', 'Troubleshooting and FAQ', 'Устранение проблем и FAQ'],
] as const

for (const expired of [false, true]) {
  test(`public articles never request the API with ${expired ? 'expired' : 'absent'} session`, async ({
    page,
    context,
  }) => {
    const requests: string[] = []
    await page.route(new RegExp('^https?://[^/]+/api/'), async (route) => {
      requests.push(route.request().url())
      await route.abort('connectionfailed')
    })
    if (expired)
      await context.addCookies([
        { name: 'okoscope_session', value: 'expired', url: 'http://127.0.0.1:4173' },
      ])
    await page.goto('/docs/quick-start#secret')
    await expect(page.getByRole('heading', { level: 1, name: 'Quick start' })).toBeVisible()
    if (!expired) {
      for (const selector of [
        '.docs-header a',
        '.docs-sidebar a',
        '.docs-toc a',
        'main section h2 a',
        'main a[href^="https://"]',
        '.docs-related a',
        'main footer a',
      ]) {
        const link = page.locator(selector).first()
        await link.hover()
        await expect(link).toHaveCSS('text-decoration-line', 'none')
      }
    }
    await page.reload()
    await expect(page.getByRole('heading', { level: 1, name: 'Quick start' })).toBeVisible()
    await page.getByLabel('Language').selectOption('ru')
    await expect(page).toHaveURL(/\/docs\/quick-start#secret$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Быстрый старт' })).toBeVisible()
    await page.reload()
    await expect(page.getByLabel('Язык')).toHaveValue('ru')
    expect(requests).toEqual([])
  })
}

test('documentation language selector is visually compact and remains accessible', async ({
  page,
}) => {
  await page.goto('/docs/quick-start')
  const header = page.locator('.docs-header')
  const select = header.getByRole('combobox', { name: 'Language' })
  await expect(header.locator('label > span')).toHaveCount(0)
  await expect(select).toHaveAccessibleName('Language')
  await expect(select).toHaveValue('en')
  await expect(select.locator('option:checked')).toHaveText('English')

  await select.selectOption('ru')
  const russianSelect = header.getByRole('combobox', { name: 'Язык' })
  await expect(header.locator('label > span')).toHaveCount(0)
  await expect(russianSelect).toHaveAccessibleName('Язык')
  await expect(russianSelect).toHaveValue('ru')
  await expect(russianSelect.locator('option:checked')).toHaveText('Русский')
  await page.reload()
  await expect(header.getByRole('combobox', { name: 'Язык' })).toHaveValue('ru')

  await page.setViewportSize({ width: 360, height: 800 })
  await expect(header.locator('label > span')).toHaveCount(0)
  await expect(header.getByRole('combobox', { name: 'Язык' })).toHaveAccessibleName('Язык')
  await header.getByRole('combobox', { name: 'Язык' }).selectOption('en')
  await expect(header.getByRole('combobox', { name: 'Language' })).toHaveValue('en')
  await expect(
    header.getByRole('combobox', { name: 'Language' }).locator('option:checked'),
  ).toHaveText('English')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('how it works presents the responsive architecture diagram in the selected language', async ({
  page,
}) => {
  const expected = {
    en: {
      source: '/documentation/architecture-birds-eye.en.svg',
      alt: 'Bird’s-eye architecture diagram showing runtime data flowing from the Okoscope node agent through the server and PostgreSQL to the web interface.',
    },
    ru: {
      source: '/documentation/architecture-birds-eye.ru.svg',
      alt: 'Архитектурная диаграмма: поток данных среды выполнения проходит от агента Okoscope на узле через сервер и PostgreSQL к веб-интерфейсу.',
    },
  } as const

  await page.goto('/docs/how-it-works')
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 360, height: 800 },
  ]) {
    await page.setViewportSize(viewport)
    for (const locale of ['en', 'ru'] as const) {
      await page.getByLabel(/Language|Язык/).selectOption(locale)
      const diagram = page.locator('section[aria-labelledby="flow"] .docs-diagram img')
      await expect(diagram).toHaveCount(1)
      await expect(diagram).toHaveAttribute('src', expected[locale].source)
      await expect(diagram).toHaveAttribute('alt', expected[locale].alt)
      await expect(diagram).toBeVisible()
      const dimensions = await diagram.evaluate((element) => {
        if (!(element instanceof HTMLImageElement)) throw new Error('Expected an image element')
        return {
          complete: element.complete,
          naturalWidth: element.naturalWidth,
          naturalHeight: element.naturalHeight,
          renderedWidth: element.getBoundingClientRect().width,
          renderedHeight: element.getBoundingClientRect().height,
        }
      })
      expect(dimensions.complete).toBe(true)
      expect(dimensions.naturalWidth).toBe(1600)
      expect(dimensions.naturalHeight).toBe(900)
      expect(dimensions.renderedWidth / dimensions.renderedHeight).toBeCloseTo(16 / 9, 2)
      expect(dimensions.renderedWidth).toBeLessThanOrEqual(viewport.width)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  }
})

test('overview explains the evidence drill-down with synchronized concrete copy', async ({
  page,
}) => {
  const copy = {
    en: {
      current:
        'Okoscope watches the workloads you select, using an eBPF agent that runs on your cluster nodes. When something looks off — a process you did not expect, a connection to a new destination, unfamiliar file activity, a container that keeps restarting — you start by picking an Application and a time window, and then open the events behind whatever the page is showing you.',
      removed: 'Start with an application and time window, then open the supporting observations.',
      otherLocale:
        'начните с выбора приложения и временного интервала, а затем откройте события, на которых построено то, что вы видите.',
    },
    ru: {
      current:
        'Okoscope наблюдает за теми нагрузками, которые вы выбрали: на узлах кластера для этого работает агент eBPF. Если что-то выглядит странно — незнакомый процесс, соединение с новым адресом, непонятная активность с файлами, постоянно перезапускающийся контейнер, — начните с выбора приложения и временного интервала, а затем откройте события, на которых построено то, что вы видите.',
      removed:
        'Начните с приложения и временного интервала, затем откройте подтверждающие наблюдения.',
      otherLocale:
        'you start by picking an Application and a time window, and then open the events behind whatever the page is showing you.',
    },
  } as const

  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/docs/overview')
  for (const locale of ['en', 'ru'] as const) {
    await page.getByLabel(/Language|Язык/).selectOption(locale)
    const paragraph = page.locator('section[aria-labelledby="purpose"] p').first()
    await expect(paragraph).toHaveText(copy[locale].current)
    await expect(paragraph).not.toContainText(copy[locale].removed)
    await expect(paragraph).not.toContainText(copy[locale].otherLocale)
    const brand = paragraph.locator('strong.docs-brand-text')
    await expect(brand).toHaveCount(1)
    await expect(brand).toHaveText('Okoscope')
    await expect(brand).toHaveCSS('font-weight', '700')
    await expect(brand).toHaveCSS('color', 'rgb(103, 232, 249)')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  }
})

test('every visible documentation Okoscope name uses semantic readable brand styling', async ({
  page,
}) => {
  for (const [slug, en, ru] of titles) {
    await page.goto(`/docs/${slug}`)
    for (const [locale, title, documentation] of [
      ['en', en, 'Documentation'],
      ['ru', ru, 'Документация'],
    ] as const) {
      await page.getByLabel(/Language|Язык/).selectOption(locale)
      await expect(page).toHaveURL(new RegExp(`/docs/${slug}$`))
      await expect(page).toHaveTitle(`${title} · ${documentation} · Okoscope`)
      await verifyRenderedBrandNames(page)

      const logo = page.locator('.docs-header .brand-link')
      await expect(logo).toHaveAttribute('aria-label', 'OKOSCOPE')
      await expect(logo).toContainText('OKOSCOPE')
      await expect(logo.locator('.docs-brand-text')).toHaveCount(0)
      await expect(page.locator('.docs-code .docs-brand-text')).toHaveCount(0)
      for (const href of await page
        .locator('.docs-shell a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))) {
        expect(href).not.toContain('<')
        expect(href).not.toContain('>')
      }
    }
  }
})

test('documentation safely links every allowlisted repository reference', async ({ page }) => {
  const targets = {} as const

  await page.setViewportSize({ width: 360, height: 800 })
  for (const [slug] of titles) {
    await page.goto(`/docs/${slug}`)
    for (const locale of ['en', 'ru'] as const) {
      await page.getByLabel(/Language|Язык/).selectOption(locale)
      const prose = page.locator('main section p')
      const links = prose.locator('a[href^="https://github.com/ihippik/okoscope"]')
      const expected: Record<string, number> = {}
      await expect(links).toHaveCount(
        Object.values(expected).reduce((sum, count) => sum + count, 0),
      )

      const actualCounts: Record<string, number> = {}
      for (const link of await links.all()) {
        const text = await link.textContent()
        expect(text).not.toBeNull()
        expect(Object.keys(targets)).toContain(text!)
        await expect(link).toHaveAttribute('href', targets[text! as keyof typeof targets])
        await expect(link).toHaveAccessibleName(text!)
        expect(await link.locator('a').count()).toBe(0)
        actualCounts[text!] = (actualCounts[text!] ?? 0) + 1
        await link.focus()
        await expect(link).toBeFocused()
        await expect(link).toHaveCSS('outline-style', 'solid')
        await expect(link).toHaveCSS('outline-width', '2px')
      }
      expect(actualCounts).toEqual(expected)

      const bareReferences = await prose.evaluateAll((paragraphs, entries) => {
        const invalid: string[] = []
        const sortedEntries = (entries as [string, string][]).sort(
          ([left], [right]) => right.length - left.length,
        )
        if (sortedEntries.length === 0) return invalid
        const pattern = new RegExp(
          sortedEntries.map(([token]) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
          'g',
        )
        for (const paragraph of paragraphs) {
          const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT)
          let node = walker.nextNode()
          while (node) {
            for (const match of node.nodeValue?.matchAll(pattern) ?? []) {
              const token = match[0]
              const href = sortedEntries.find(([candidate]) => candidate === token)![1]
              const anchor = node.parentElement?.closest('a')
              if (anchor?.textContent !== token || anchor.href !== href) invalid.push(token)
            }
            node = walker.nextNode()
          }
        }
        return invalid
      }, Object.entries(targets))
      expect(bareReferences).toEqual([])
      await expect(page.locator('.docs-code a')).toHaveCount(0)
      await expect(page.locator('.docs-shell a a')).toHaveCount(0)

      if (slug === 'quick-start' || slug === 'self-hosting') {
        const sources = page.getByRole('link', {
          name:
            locale === 'en'
              ? 'Open Helm chart sources on GitHub'
              : 'Открыть исходники Helm-чартов на GitHub',
        })
        await expect(sources).toHaveAttribute(
          'href',
          'https://github.com/ihippik/okoscope/tree/main/deploy/helm',
        )
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
      if (slug === 'quick-start' || slug === 'self-hosting')
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    }
  }
})

test('installation journeys match the secure Helm chart contract in both languages', async ({
  page,
}) => {
  for (const locale of ['en', 'ru'] as const) {
    await page.goto('/docs/quick-start')
    await page.getByLabel(/Language|Язык/).selectOption(locale)
    const quickStart = page.locator('main')
    await expect(quickStart).toContainText('oci://ghcr.io/ihippik/charts/okoscope-agent')
    await expect(quickStart).toContainText('okoscope-application-credentials')
    await expect(quickStart).toContainText('credentialSecret.name')
    await expect(quickStart).toContainText('server.caSecret.name')
    await expect(quickStart).toContainText('imagePullSecrets')
    await expect(quickStart).toContainText('32')
    await expect(quickStart).not.toContainText('postgresql.enabled')
    await expect(quickStart).not.toContainText('deploy/kubernetes')

    await page.goto('/docs/self-hosting')
    const selfHosting = page.locator('main')
    await expect(selfHosting).toContainText('oci://ghcr.io/ihippik/charts/okoscope')
    await expect(selfHosting).toContainText('database.existingSecret')
    await expect(selfHosting).toContainText('database.urlKey')
    await expect(selfHosting).toContainText('internalSecret.existingSecret')
    await expect(selfHosting).toContainText('imagePullSecrets')
    await expect(selfHosting).toContainText('helm rollback')
    await expect(selfHosting).toContainText('helm uninstall')
    await expect(selfHosting).toContainText(
      locale === 'en' ? 'does not install PostgreSQL' : 'PostgreSQL он не устанавливает',
    )
    await expect(selfHosting).toContainText(
      locale === 'en'
        ? 'provision, secure, monitor, back up, restore, upgrade and delete'
        : 'создаёте, защищаете, мониторите, резервируете и восстанавливаете, обновляете и удаляете',
    )
    await expect(selfHosting).not.toContainText('postgresql.enabled')
    await expect(selfHosting).not.toContainText('deploy/kubernetes/common/postgres.yaml')
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  }
})

test('chart values are copyable localized files with intact shell continuations', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  for (const locale of ['en', 'ru'] as const) {
    await page.goto('/docs/self-hosting')
    await page.getByLabel(/Language|Язык/).selectOption(locale)
    for (const [id, required] of [
      ['values-server', 'database:'],
      ['values-agent', 'workloads:'],
    ] as const) {
      const block = page.locator(`section[aria-labelledby="${id}"] .docs-code`)
      const code = block.locator('code')
      const text = (await code.textContent()) ?? ''
      expect(text.startsWith('# values.yaml')).toBe(true)
      expect(text).toContain('helm upgrade --install')
      expect(/[А-Яа-яЁё]/.test(text)).toBe(locale === 'ru')
      expect(text).toMatch(/ \\\n/)
      expect(text).toMatch(new RegExp(`^${required}$`, 'm'))
      for (const line of text.split('\n').filter((entry) => /^\s*-?\s*[\w.-]+: \S/.test(entry)))
        expect(line).toMatch(
          /#\s*(required|обязательно|default|по умолчанию|optional|необязательно)/,
        )
      const comments = block.locator('.docs-code-comment')
      expect(await comments.count()).toBeGreaterThan(10)
      for (const comment of await comments.all()) {
        await expect(comment).toHaveCSS('color', 'rgb(216, 189, 122)')
        expect((await comment.textContent())?.startsWith('#')).toBe(true)
      }
      await block.getByRole('button').click()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(text)
    }
    const installCommand =
      (await page.locator('section[aria-labelledby="rollout"] .docs-code code').textContent()) ?? ''
    expect(installCommand).toContain(' \\\n  oci://ghcr.io/ihippik/charts/okoscope')
  }
})

test('all articles have translated content, stable anchors and accessible desktop structure', async ({
  page,
}) => {
  for (const [slug, en, ru] of titles) {
    await page.goto(`/docs/${slug}`)
    await page.getByLabel(/Language|Язык/).selectOption('en')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(en)
    await expect(page).toHaveTitle(`${en} · Documentation · Okoscope`)
    if (slug === 'quick-start')
      await verifyActiveArticleStyling(page, 'Quick start', '.docs-sidebar')
    await expect(page.locator('.docs-header nav > :last-child select')).toHaveAccessibleName(
      'Language',
    )
    const applicationBox = await page
      .locator('.docs-header')
      .getByRole('link', { name: 'Open application' })
      .boundingBox()
    const languageBox = await page.getByLabel('Language').boundingBox()
    expect(applicationBox).not.toBeNull()
    expect(languageBox).not.toBeNull()
    expect(languageBox!.x).toBeGreaterThan(applicationBox!.x + applicationBox!.width)
    const contents = page.getByRole('navigation', { name: 'On this page', exact: true })
    await expect(contents).toBeVisible()
    await verifyContentsCaption(contents, 'On this page')
    const sectionHeadings = page.locator('main section :is(h2, h3)')
    const anchors = await sectionHeadings
      .locator('a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
    expect(anchors.length).toBeGreaterThan(1)
    for (const anchor of anchors) await expect(page.locator(`:is(h2, h3)${anchor}`)).toHaveCount(1)
    expect(
      await contents
        .locator('a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    ).toEqual(anchors)
    expect(await contents.locator('a').allTextContents()).toEqual(
      await sectionHeadings.locator('a').allTextContents(),
    )
    if (slug === 'quick-start') await verifyQuickStartSubsection(page, contents, 'en')
    await contents.locator('a').last().click()
    const url = page.url()
    await page.getByLabel('Language').selectOption('ru')
    await expect(page).toHaveURL(url)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(ru)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
    if (slug === 'quick-start')
      await verifyActiveArticleStyling(page, 'Быстрый старт', '.docs-sidebar')
    const russianContents = page.getByRole('navigation', { name: 'На этой странице', exact: true })
    await expect(russianContents).toBeVisible()
    await verifyContentsCaption(russianContents, 'На этой странице')
    expect(
      await russianContents
        .locator('a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    ).toEqual(anchors)
    expect(await russianContents.locator('a').allTextContents()).toEqual(
      await sectionHeadings.locator('a').allTextContents(),
    )
    if (slug === 'quick-start') await verifyQuickStartSubsection(page, russianContents, 'ru')
    await russianContents.locator('a').first().click()
    expect(new URL(page.url()).hash).toBe(anchors[0])
    const related = page.getByRole('navigation', { name: 'Читайте также', exact: true })
    const relatedHeading = await related.getByRole('heading').boundingBox()
    expect(relatedHeading).not.toBeNull()
    for (const card of await related.getByRole('link').all()) {
      const box = await card.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.y).toBeGreaterThan(relatedHeading!.y + relatedHeading!.height)
    }
    const headingSize = await related
      .getByRole('heading')
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
    const sectionSize = await page
      .locator('main section h2')
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
    expect(headingSize).toBeLessThan(sectionSize)
    for (const paragraph of await page.locator('main p').allTextContents())
      expect(paragraph).toMatch(/[А-Яа-яЁё]/)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  }
})

test('workspace vocabulary is a semantic localized definition list without overflow', async ({
  page,
}) => {
  const expected = {
    en: [
      ['Organization', 'decides who owns the data and who is allowed to see it.'],
      ['Project', 'keeps related Applications together.'],
      ['Application', 'is the component whose runtime behavior you are looking at.'],
      ['Cluster', 'is one Kubernetes installation.'],
      ['Workload', 'is the Deployment inside that Cluster the agent watches.'],
      ['Event', 'is a single thing the agent saw.'],
      ['Runtime group', 'collects the events that describe the same behavior.'],
      ['Inventory', 'lists what was seen: executables, destinations, file paths.'],
      [
        'Release',
        'is a set of deployed images together with how they behaved; it is not a source-code diff.',
      ],
    ],
    ru: [
      ['Организация', 'определяет, кому принадлежат данные и кто может их видеть.'],
      ['Проект', 'держит связанные приложения вместе.'],
      ['Приложение', 'компонент, поведение которого вы изучаете.'],
      ['Кластер', 'одна установка Kubernetes.'],
      ['Рабочая нагрузка', 'тот Deployment внутри кластера, за которым наблюдает агент.'],
      ['Событие', 'одно наблюдение, которое зафиксировал агент.'],
      ['Группа событий', 'собирает события, описывающие одно и то же поведение.'],
      [
        'Инвентаризация',
        'перечисляет увиденное: исполняемые файлы, сетевые адреса, пути к файлам.',
      ],
      [
        'Релиз',
        'набор развёрнутых образов вместе с тем, как они себя вели; это не сравнение исходного кода.',
      ],
    ],
  } as const

  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/docs/overview')
  for (const locale of ['en', 'ru'] as const) {
    await page.getByLabel(/Language|Язык/).selectOption(locale)
    const list = page.locator('section[aria-labelledby="vocabulary"] ul.docs-definitions')
    await expect(list).toHaveCount(1)
    await expect(list).toHaveCSS('list-style-type', 'none')
    const items = list.getByRole('listitem')
    await expect(items).toHaveCount(9)
    for (const [index, [term, description]] of expected[locale].entries()) {
      const item = items.nth(index)
      await expect(item).toHaveCSS('display', 'list-item')
      await expect(item).toHaveCSS('list-style-type', 'none')
      await expect(item.locator('strong')).toHaveCount(1)
      await expect(item.locator('strong')).toHaveText(term)
      await expect(item).toHaveText(`${term} ${description}`)
      const text = await item.textContent()
      expect(text?.match(/—/g)).toBeNull()
      const marker = await item.evaluate((element) =>
        getComputedStyle(element, '::before').content.replace(/["']/g, ''),
      )
      expect(marker).toBe('—\u00a0')
      expect(marker.match(/—/g)).toHaveLength(1)
      const box = await item.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(360)
    }
    if (locale === 'ru') {
      const terms = await items.locator('strong').allTextContents()
      expect(terms.every((term) => term[0] === term[0]?.toLocaleUpperCase('ru'))).toBe(true)
      await expect(list.getByText('рабочая нагрузка', { exact: true })).toHaveCount(0)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  }
})

test('Policies workflow is an accurate nested subsection with stable localized navigation', async ({
  page,
}) => {
  const expected = {
    en: [
      'Policies mark observed Application behavior as expected or as something that needs review. They do not block processes or connections, they do not change the lifecycle of findings, and they never delete evidence. To create one you have to be signed in with access to the Application, and you have to start from a retained Runtime Group or inventory observation that can seed a policy.',
      'Open the Runtime Group or the inventory observation and choose Create policy from observation. Give it a name, check the placement scope shown in the dialog, and select Preview impact — the preview is required before anything is created. It tells you how many groups and sightings would be affected, and how many of them would come out expected or requiring review. If the observation cannot seed a policy at all, the dialog says so instead of creating one.',
      'After creating it, open Managed policies from the Application. There you see the current revision, what it affects inside and outside its scope, and the revision history; Enable and Disable switch it on and off. The current interface has no edit action for an existing policy revision. While results are being recomputed, observations show Evaluating policy; when that finishes, check the effective verdict in Runtime Groups or Inventory, and use the verdict and evaluation filters to find the behavior it touched.',
    ],
    ru: [
      'Политики помечают наблюдаемое поведение приложения как ожидаемое или как требующее проверки. Они не блокируют процессы и соединения, не меняют жизненный цикл находок и никогда не удаляют данные. Чтобы создать политику, нужно войти в систему, иметь доступ к приложению и начать с сохранённой группы событий или записи инвентаризации, из которой политику можно построить.',
      'Откройте группу событий или запись инвентаризации и выберите «Создать политику из наблюдения». Задайте имя, проверьте показанную область действия и нажмите «Предварительный просмотр влияния» — без просмотра политика не создаётся. Он показывает, сколько групп и наблюдений будет затронуто и сколько из них окажутся ожидаемыми, а сколько потребуют проверки. Если из наблюдения политику построить нельзя, диалог сообщит об этом вместо создания.',
      'После создания откройте в приложении «Управляемые политики». Там видны текущая ревизия, её эффекты внутри и вне области действия и история ревизий; кнопки «Включить» и «Отключить» управляют активностью. Редактировать существующую ревизию текущий интерфейс не позволяет. Пока результаты пересчитываются, наблюдения показывают «Вычисление политики»; когда пересчёт закончится, проверьте действующий вердикт в группах событий или инвентаризации, а найти затронутое поведение помогут фильтры по вердикту и вычислению.',
    ],
  } as const

  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/docs/workflows#policies')
  for (const locale of ['en', 'ru'] as const) {
    await page.getByLabel(/Language|Язык/).selectOption(locale)
    const headingName = locale === 'en' ? 'Work with Policies' : 'Работа с политиками'
    const parentName =
      locale === 'en' ? 'Investigate a new connection' : 'Исследуйте новое соединение'
    const heading = page.getByRole('heading', { level: 3, name: headingName })
    await expect(heading).toHaveAttribute('id', 'policies')
    await expect(page.getByText('Работа с Policies', { exact: true })).toHaveCount(0)
    expect(
      await heading.evaluate(
        (element) =>
          element.parentElement?.previousElementSibling?.querySelector(':scope > h2')?.id,
      ),
    ).toBe('new-connection')

    const toc = page.getByRole('navigation', {
      name: locale === 'en' ? 'On this page' : 'На этой странице',
      exact: true,
    })
    const parentItem = toc.getByRole('link', { name: parentName }).locator('..')
    const nestedLink = toc.getByRole('link', { name: headingName })
    const nestedItem = nestedLink.locator('..')
    const [parentStyle, nestedStyle] = await Promise.all([
      parentItem.evaluate((element) => {
        const style = getComputedStyle(element)
        return { fontSize: style.fontSize, marginLeft: style.marginLeft }
      }),
      nestedItem.evaluate((element) => {
        const style = getComputedStyle(element)
        return { fontSize: style.fontSize, marginLeft: style.marginLeft }
      }),
    ])
    expect(Number.parseFloat(nestedStyle.fontSize)).toBeLessThan(
      Number.parseFloat(parentStyle.fontSize),
    )
    expect(Number.parseFloat(nestedStyle.marginLeft)).toBeGreaterThan(
      Number.parseFloat(parentStyle.marginLeft),
    )
    await nestedLink.click()
    await expect(page).toHaveURL(/\/docs\/workflows#policies$/)
    await page.reload()
    await expect(page).toHaveURL(/\/docs\/workflows#policies$/)
    await expect(page.getByRole('heading', { level: 3, name: headingName })).toBeVisible()
    await expect(page.locator('section[aria-labelledby="policies"] p')).toHaveText(expected[locale])
    await expect(page.locator('section[aria-labelledby="policies"]')).not.toContainText(
      /owner|владел/i,
    )
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  }
})

test('unknown article stays public and both entry links preserve protected access', async ({
  page,
}) => {
  await mockApi(page)
  await page.goto('/docs/not-a-real-article')
  await expect(page.getByRole('heading', { name: 'Article not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Documentation overview' }).click()
  await expect(page.getByRole('heading', { name: 'Meet Okoscope' })).toBeVisible()
  await page.getByRole('link', { name: 'Open application' }).first().click()
  await expect(
    page.locator('form').getByRole('button', { name: 'Sign in', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Documentation', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Meet Okoscope' })).toBeVisible()
  await page.goto('/docs-private')
  await expect(
    page.locator('form').getByRole('button', { name: 'Sign in', exact: true }),
  ).toBeVisible()
  await page.goto('/')
  await authenticate(page)
  await page.getByRole('link', { name: 'Documentation', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Meet Okoscope' })).toBeVisible()
})

test('mobile navigation is keyboard operable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/docs/quick-start')
  await expect(page.getByRole('heading', { level: 1, name: 'Quick start' })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to article' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  const summary = page.locator('.docs-mobile summary')
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.docs-mobile')).toHaveAttribute('open', '')
  await page.keyboard.press('Tab')
  await expect(page.locator('.docs-mobile a').first()).toBeFocused()
  await expect(page.locator('.docs-mobile a').first()).toHaveCSS('outline-style', 'solid')
  await expect(page.locator('.docs-mobile a').first()).toHaveCSS('outline-width', '2px')
  await expect(page.locator('.docs-mobile a')).toHaveCount(9)
  await verifyActiveArticleStyling(page, 'Quick start', '.docs-mobile')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Meet Okoscope' })).toBeVisible()
  for (const [slug] of titles) {
    await page.goto(`/docs/${slug}`)
    await expect(page.locator('main h1')).toBeVisible()
    await verifyContentsCaption(
      page.getByRole('navigation', { name: 'On this page', exact: true }),
      'On this page',
    )
    const cardBoxes = await page.locator('.docs-related a').evaluateAll((links) =>
      links.map((link) => {
        const box = link.getBoundingClientRect()
        return { x: box.x, right: box.right, y: box.y, bottom: box.bottom }
      }),
    )
    expect(cardBoxes.length).toBeGreaterThan(1)
    for (const [index, box] of cardBoxes.entries()) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.right).toBeLessThanOrEqual(360)
      if (index > 0) expect(box.y).toBeGreaterThan(cardBoxes[index - 1]!.bottom)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
  await page.goto('/docs/quick-start')
  await page.getByLabel('Language').selectOption('ru')
  await expect(page.getByLabel('Язык')).toHaveValue('ru')
  const russianSummary = page.locator('.docs-mobile summary')
  await russianSummary.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.docs-mobile')).toHaveAttribute('open', '')
  await verifyActiveArticleStyling(page, 'Быстрый старт', '.docs-mobile')
  await verifyContentsCaption(
    page.getByRole('navigation', { name: 'На этой странице', exact: true }),
    'На этой странице',
  )
  await expect(page.locator('.docs-header nav > :last-child select')).toHaveAccessibleName('Язык')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

async function verifyContentsCaption(contents: Locator, text: string) {
  const caption = contents.getByText(text, { exact: true })
  await expect(caption).toBeVisible()
  await expect(caption).toHaveCSS('text-align', 'right')
  await expect(caption).toHaveCSS('color', 'rgb(145, 174, 193)')
  const captionSize = await caption.evaluate((element) =>
    parseFloat(getComputedStyle(element).fontSize),
  )
  const linkSize = await contents
    .getByRole('link')
    .first()
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
  expect(captionSize).toBeLessThan(linkSize)
  const captionBox = await caption.boundingBox()
  const linksBox = await contents.locator('ul').boundingBox()
  const panelBox = await contents.boundingBox()
  expect(captionBox).not.toBeNull()
  expect(linksBox).not.toBeNull()
  expect(panelBox).not.toBeNull()
  expect(captionBox!.y).toBeGreaterThan(panelBox!.y)
  expect(captionBox!.y - panelBox!.y).toBeLessThan(20)
  expect(captionBox!.x).toBeGreaterThan(panelBox!.x + panelBox!.width / 2)
  expect(linksBox!.y - panelBox!.y).toBeGreaterThanOrEqual(12)
  expect(linksBox!.y - panelBox!.y).toBeLessThan(24)
  const firstLinkBox = await contents.getByRole('link').first().boundingBox()
  expect(firstLinkBox).not.toBeNull()
  expect(firstLinkBox!.y - panelBox!.y).toBeLessThan(30)
  for (const link of await contents.getByRole('link').all()) {
    const box = await link.boundingBox()
    expect(box).not.toBeNull()
    const overlaps =
      box!.x < captionBox!.x + captionBox!.width &&
      box!.x + box!.width > captionBox!.x &&
      box!.y < captionBox!.y + captionBox!.height &&
      box!.y + box!.height > captionBox!.y
    expect(overlaps).toBe(false)
  }
  expect(captionBox!.x + captionBox!.width).toBeLessThan(panelBox!.x + panelBox!.width)
  expect(panelBox!.x + panelBox!.width - captionBox!.x - captionBox!.width).toBeLessThan(24)
}

async function verifyQuickStartSubsection(page: Page, contents: Locator, locale: 'en' | 'ru') {
  const sectionName =
    locale === 'en' ? '2. Create the credential Secret' : '2. Создайте Secret с токеном'
  const sectionHeading = page.getByRole('heading', { level: 2, name: sectionName })
  await expect(sectionHeading).toHaveAttribute('id', 'secret')
  await contents.getByRole('link', { name: sectionName }).click()
  expect(new URL(page.url()).hash).toBe('#secret')
}

async function verifyActiveArticleStyling(page: Page, articleName: string, navigation: string) {
  const brand = page.locator('.docs-header .brand-link')
  const currentArticle = page.locator(navigation).getByRole('link', { name: articleName })
  await expect(currentArticle).toHaveAttribute('aria-current', 'page')
  await expect(currentArticle).toHaveCSS('background-color', 'rgb(22, 52, 73)')
  await expect(currentArticle).toHaveCSS('border-left-width', '3px')
  await expect(currentArticle).toHaveCSS('border-left-color', 'rgb(103, 232, 249)')
  await expect(brand).not.toHaveCSS('background-color', 'rgb(22, 52, 73)')
  await expect(brand).toHaveCSS('border-left-width', '0px')
}

async function verifyRenderedBrandNames(page: Page) {
  const shell = page.locator('.docs-shell')
  const occurrences = await shell.evaluate((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let count = 0
    let node = walker.nextNode()
    while (node) {
      if (!node.parentElement?.closest('.docs-code'))
        count += node.nodeValue?.match(/Okoscope/g)?.length ?? 0
      node = walker.nextNode()
    }
    return count
  })
  const branded = shell.locator('strong.docs-brand-text')
  await expect(branded).toHaveCount(occurrences)
  expect(occurrences).toBeGreaterThan(0)

  const offenders = await shell.evaluate((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const invalid: string[] = []
    let node = walker.nextNode()
    while (node) {
      if ((node.nodeValue?.match(/Okoscope/g)?.length ?? 0) > 0) {
        const parent = node.parentElement
        if (!parent?.closest('.docs-code') && !parent?.matches('strong.docs-brand-text'))
          invalid.push(parent?.outerHTML ?? '')
      }
      node = walker.nextNode()
    }
    return invalid
  })
  expect(offenders).toEqual([])

  for (const name of await branded.all()) {
    await expect(name).toHaveText('Okoscope')
    await expect(name).toHaveCSS('color', 'rgb(103, 232, 249)')
    const style = await name.evaluate((element) => {
      const foreground = getComputedStyle(element)
        .color.match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
      let ancestor: Element | null = element
      let background = [0, 0, 0]
      while (ancestor) {
        const value = getComputedStyle(ancestor).backgroundColor
        const channels = value.match(/[\d.]+/g)?.map(Number) ?? []
        if ((channels[3] ?? 1) > 0) {
          background = channels.slice(0, 3)
          break
        }
        ancestor = ancestor.parentElement
      }
      const luminance = (channels: number[]) => {
        const linear = channels.map((channel) => {
          const normalized = channel / 255
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
        })
        return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722
      }
      const foregroundLuminance = luminance(foreground)
      const backgroundLuminance = luminance(background)
      return {
        fontWeight: Number.parseInt(getComputedStyle(element).fontWeight, 10),
        contrast:
          (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
          (Math.min(foregroundLuminance, backgroundLuminance) + 0.05),
      }
    })
    expect(style.fontWeight).toBeGreaterThanOrEqual(700)
    expect(style.contrast).toBeGreaterThanOrEqual(4.5)
  }
}
