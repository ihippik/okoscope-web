import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { FormEvent, useState } from 'react'
import { buildInfoOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { credentialSession, useCredential } from '../shared/auth/session'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'
import { ErrorState } from '../shared/ui/error-state'
import { Loading } from '../shared/ui/loading'
import { useT } from '../shared/i18n'
import { LanguageSelector } from '../shared/i18n/language-selector'

export const REQUIRED_API_VERSION = 'v1'
export const REQUIRED_DATABASE_MIGRATION = 7
export const isBuildCompatible = (info: unknown): boolean => {
  if (!info || typeof info !== 'object') return false
  const value = info as { api_version?: unknown; required_database_migration?: unknown }
  return (
    value.api_version === REQUIRED_API_VERSION &&
    typeof value.required_database_migration === 'number' &&
    value.required_database_migration >= REQUIRED_DATABASE_MIGRATION
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function NotFound() {
  const t = useT()
  return (
    <main id="main-content" className="page">
      <ErrorState title={t('pageNotFound')} error={new Error(t('notFound'))} />
    </main>
  )
}

function RootComponent() {
  const t = useT()
  const api = useApi()
  const build = useQuery(buildInfoOptions(api))
  const credential = useCredential()
  if (build.isPending)
    return (
      <main id="main-content" className="page">
        <Loading label={t('checkingBackend')} />
      </main>
    )
  if (build.isError)
    return (
      <main id="main-content" className="page">
        <ErrorState
          title={t('backendUnavailable')}
          error={build.error}
          onRetry={() => void build.refetch()}
        />
      </main>
    )
  const info = build.data
  if (!isBuildCompatible(info))
    return (
      <main id="main-content" className="page">
        <Card role="alert">
          <div className="mb-4 flex justify-end">
            <LanguageSelector />
          </div>
          <p className="eyebrow">{t('incompatibleDeployment')}</p>
          <h1 className="mt-3 text-3xl font-semibold">{t('incompatibleBackend')}</h1>
          <dl className="details">
            <dt>{t('expected')}</dt>
            <dd>{REQUIRED_API_VERSION}</dd>
            <dt>{t('actual')}</dt>
            <dd>{String(info?.api_version ?? t('unknown'))}</dd>
            <dt>{t('service')}</dt>
            <dd>{String(info?.service_version ?? t('unknown'))}</dd>
            <dt>{t('commit')}</dt>
            <dd className="font-mono text-xs">{String(info?.git_commit ?? t('unknown'))}</dd>
            <dt>{t('requiredMigration')}</dt>
            <dd>
              {REQUIRED_DATABASE_MIGRATION} {t('orNewer')}
            </dd>
            <dt>{t('actualMigration')}</dt>
            <dd>{String(info?.required_database_migration ?? t('unknown'))}</dd>
          </dl>
        </Card>
      </main>
    )
  if (!credential) return <CredentialPrompt />
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold tracking-tight">
            OKOSCOPE
          </Link>
          <nav aria-label={t('primaryNavigation')} className="flex items-center gap-2">
            <Link
              to="/projects"
              className="nav-link"
              activeProps={{ className: 'nav-link text-cyan-300' }}
            >
              {t('projects')}
            </Link>
            <Button variant="ghost" onClick={() => credentialSession.clear()}>
              {t('endSession')}
            </Button>
            <LanguageSelector />
          </nav>
        </div>
      </header>
      <main id="main-content" className="page">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-6 pb-8 text-xs text-slate-500">
        {t('webVersion', { version: __APP_VERSION__, commit: __GIT_COMMIT__ })}
      </footer>
    </div>
  )
}

function CredentialPrompt() {
  const t = useT()
  const [value, setValue] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (value.trim()) credentialSession.set(value)
  }
  return (
    <main id="main-content" className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <LanguageSelector />
        </div>
        <p className="eyebrow">{t('compatibleApi')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('connect')}</h1>
        <p className="mt-3 text-sm text-slate-400">{t('credentialHelp')}</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-medium" htmlFor="credential">
            {t('bearerCredential')}
          </label>
          <input
            id="credential"
            name="credential"
            type="password"
            autoComplete="off"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            required
          />
          <Button className="w-full" type="submit">
            {t('startSession')}
          </Button>
        </form>
      </Card>
    </main>
  )
}
