import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Cpu,
  FileCog,
  ListChecks,
  Network,
} from 'lucide-react'
import { useLocalization } from '../../shared/i18n'
import { LanguageSelector } from '../../shared/i18n/language-selector'
import { Brand } from '../../shared/ui/brand'
import { articles, controls, type SectionIcon } from './content'
import './documentation.css'

const sectionIcons = {
  processes: Cpu,
  network: Network,
  files: FileCog,
  review: ListChecks,
} satisfies Record<SectionIcon, typeof Cpu>

export function Documentation({ slug }: { slug: string }) {
  const { locale, t } = useLocalization()
  const ui = controls[locale]
  const hash = useRouterState({ select: (state) => state.location.hash })
  const article = articles.find((item) => item.slug === slug)
  useEffect(() => {
    document.title = `${article?.title[locale] ?? ui.notFound} · ${t('documentation')} · Okoscope`
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
  }, [article, locale, hash, t, ui.notFound])
  const navigation = (
    <ul>
      {articles.map((item) => (
        <li key={item.slug}>
          <Link
            to="/docs/$slug"
            params={{ slug: item.slug }}
            aria-current={slug === item.slug ? 'page' : undefined}
          >
            <BrandText text={item.title[locale]} />
          </Link>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="docs-shell">
      <a className="docs-skip" href="#main-content">
        {ui.skip}
      </a>
      <header className="docs-header">
        <Link to="/docs" aria-label="OKOSCOPE" className="brand-link">
          <Brand />
        </Link>
        <nav aria-label={t('primaryNavigation')}>
          <Link to="/docs">{t('documentation')}</Link>
          <Link to="/">{ui.application}</Link>
          <LanguageSelector showLabel={false} />
        </nav>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav aria-label={ui.articles}>{navigation}</nav>
        </aside>
        <div className="docs-reading">
          <details className="docs-mobile">
            <summary>{ui.articles}</summary>
            <nav aria-label={ui.articles}>{navigation}</nav>
          </details>
          <main id="main-content" tabIndex={-1}>
            <p className="eyebrow">{t('documentation')}</p>
            <h1>
              <BrandText text={article?.title[locale] ?? ui.notFound} />
            </h1>
            {article ? (
              <>
                <p className="docs-intro">
                  <BrandText text={article.intro[locale]} />
                </p>
                {(slug === 'quick-start' || slug === 'self-hosting') && (
                  <p>
                    <a href="https://github.com/ihippik/okoscope/tree/main/deploy/helm">
                      {ui.repository}
                    </a>
                  </p>
                )}
                <nav className="docs-toc" aria-label={ui.onPage}>
                  <p className="docs-toc-label">{ui.onPage}</p>
                  <ul>
                    {article.sections.map((section) => (
                      <li
                        key={section.id}
                        className={`docs-toc-level-${section.headingLevel ?? 2}`}
                      >
                        <a href={`#${section.id}`}>
                          <BrandText text={section.title[locale]} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                {article.sections.map((section) => {
                  const Heading = section.headingLevel === 3 ? 'h3' : 'h2'
                  const Icon = section.icon ? sectionIcons[section.icon] : null
                  return (
                    <section key={section.id} aria-labelledby={section.id}>
                      <Heading id={section.id}>
                        {Icon && (
                          <Icon className="docs-section-icon" size={22} aria-hidden="true" />
                        )}
                        <a href={`#${section.id}`}>
                          <BrandText text={section.title[locale]} />
                        </a>
                      </Heading>
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index}>
                          <DocumentationText text={paragraph[locale]} />
                        </p>
                      ))}
                      {section.callout && (
                        <aside className="docs-callout" aria-label={section.callout.title[locale]}>
                          <AlertTriangle
                            className="docs-callout-icon"
                            size={20}
                            aria-hidden="true"
                          />
                          <div>
                            <strong>{section.callout.title[locale]}</strong>
                            <p>
                              <DocumentationText text={section.callout.body[locale]} />
                            </p>
                          </div>
                        </aside>
                      )}
                      {section.diagram && (
                        <figure className="docs-diagram">
                          <img
                            src={section.diagram.source[locale]}
                            alt={section.diagram.alt[locale]}
                          />
                        </figure>
                      )}
                      {section.definitions && (
                        <ul className="docs-definitions">
                          {section.definitions.map((definition) => (
                            <li key={definition.term.en}>
                              <strong>
                                <BrandText text={definition.term[locale]} />
                              </strong>{' '}
                              <BrandText text={definition.description[locale]} />
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.code && (
                        <CodeExample
                          key={locale}
                          language={section.codeLanguage}
                          code={
                            typeof section.code === 'string' ? section.code : section.code[locale]
                          }
                        />
                      )}
                    </section>
                  )
                })}
                <nav className="docs-related" aria-label={ui.related}>
                  <h2>{ui.related}</h2>
                  <div className="docs-related-grid">
                    {article.related.map((related) => {
                      const item = articles.find((entry) => entry.slug === related)!
                      return (
                        <Link
                          className="docs-related-card"
                          key={related}
                          to="/docs/$slug"
                          params={{ slug: related }}
                        >
                          <BookOpen className="docs-related-icon" size={18} aria-hidden="true" />
                          <span>
                            <BrandText text={item.title[locale]} />
                          </span>
                          <ArrowUpRight
                            className="docs-related-arrow"
                            size={16}
                            aria-hidden="true"
                          />
                        </Link>
                      )
                    })}
                  </div>
                </nav>
              </>
            ) : (
              <p>{ui.notFoundHelp}</p>
            )}
            <footer>
              <Link to="/docs">{ui.overview}</Link>
              <Link to="/">{ui.application}</Link>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}

function BrandText({ text }: { text: string }) {
  return text.split(/(Okoscope)/g).map((part, index) =>
    part === 'Okoscope' ? (
      <strong className="docs-brand-text" key={index}>
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

const documentationLinks = {
  'https://okoscope.com/onboarding': 'https://okoscope.com/onboarding',
  'https://okoscope.com': 'https://okoscope.com',
  'https://github.com/ihippik/okoscope': 'https://github.com/ihippik/okoscope',
  'deploy/kubernetes/agent/daemonset.yaml':
    'https://github.com/ihippik/okoscope/blob/main/deploy/kubernetes/agent/daemonset.yaml',
  'deploy/kubernetes/common/secret.example.yaml':
    'https://github.com/ihippik/okoscope/blob/main/deploy/kubernetes/common/secret.example.yaml',
  'deploy/kubernetes/common/namespace.yaml':
    'https://github.com/ihippik/okoscope/blob/main/deploy/kubernetes/common/namespace.yaml',
  'deploy/kubernetes/common/postgres.yaml':
    'https://github.com/ihippik/okoscope/blob/main/deploy/kubernetes/common/postgres.yaml',
  'deploy/kubernetes/common':
    'https://github.com/ihippik/okoscope/tree/main/deploy/kubernetes/common',
  'deploy/kubernetes/agent':
    'https://github.com/ihippik/okoscope/tree/main/deploy/kubernetes/agent',
} as const

const documentationLinkPattern = new RegExp(
  `(${Object.keys(documentationLinks)
    .sort((left, right) => right.length - left.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})`,
  'g',
)

function DocumentationText({ text }: { text: string }) {
  return text.split(documentationLinkPattern).map((part, index) => {
    const href = documentationLinks[part as keyof typeof documentationLinks]
    return href ? (
      <a href={href} key={index}>
        <BrandText text={part} />
      </a>
    ) : (
      <BrandText text={part} key={index} />
    )
  })
}

function renderCodeTokens(tokens: string | Prism.Token | (string | Prism.Token)[]): ReactNode {
  if (typeof tokens === 'string') return tokens
  if (Array.isArray(tokens)) {
    return tokens.map((token, index) =>
      typeof token === 'string' ? (
        token
      ) : (
        <span className={`token ${token.type}`} key={index}>
          {renderCodeTokens(token.content)}
        </span>
      ),
    )
  }
  return <span className={`token ${tokens.type}`}>{renderCodeTokens(tokens.content)}</span>
}

function CodeExample({ code, language }: { code: string; language: 'bash' | 'yaml' | undefined }) {
  const { locale } = useLocalization()
  const ui = controls[locale]
  const grammar = language ? Prism.languages[language] : undefined
  const [status, setStatus] = useState<'copied' | 'copyFailed' | null>(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus('copyFailed')
    }
  }
  return (
    <div className="docs-code">
      <div className="docs-code-toolbar">
        {language && (
          <span className="docs-code-language">{language === 'bash' ? 'Bash' : 'YAML'}</span>
        )}
        <button type="button" onClick={() => void copy()}>
          {ui.copy}
        </button>
        <span role="status">{status ? ui[status] : ''}</span>
      </div>
      <pre tabIndex={0} aria-label={ui.example}>
        <code translate="no" className={language ? `language-${language}` : undefined}>
          {grammar ? renderCodeTokens(Prism.tokenize(code, grammar)) : code}
        </code>
      </pre>
    </div>
  )
}
