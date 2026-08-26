import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { buildInfoOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import {
  DEVELOPMENT_ADMIN_API_CREDENTIAL,
  DEVELOPMENT_API_CREDENTIAL,
  credentialSession,
  getSessionMode,
  useCredential,
} from '../shared/auth/session'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'
import { ErrorState } from '../shared/ui/error-state'
import { Loading } from '../shared/ui/loading'
import { useT } from '../shared/i18n'
import { LanguageSelector } from '../shared/i18n/language-selector'
import { Brand, BrandMark } from '../shared/ui/brand'

export const REQUIRED_API_VERSION = 'v1'
export const REQUIRED_DATABASE_MIGRATION = 15
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
      <header className="app-header">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="brand-link" aria-label="OKOSCOPE">
            <Brand />
          </Link>
          <nav
            aria-label={t('primaryNavigation')}
            className="flex flex-wrap items-center justify-end gap-2"
          >
            <Link
              to="/projects"
              className="nav-link"
              activeProps={{ className: 'nav-link text-cyan-300' }}
            >
              {t('projects')}
            </Link>
            {getSessionMode() === 'admin' && (
              <Link
                to="/onboarding"
                className="nav-link"
                activeProps={{ className: 'nav-link text-cyan-300' }}
              >
                {t('onboarding')}
              </Link>
            )}
            <Link
              to="/profile"
              className="nav-link"
              activeProps={{ className: 'nav-link text-cyan-300' }}
            >
              {t('profile')}
            </Link>
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
  const navigate = useNavigate()
  const startSession = (
    credential: string,
    mode: 'tenant' | 'admin',
    destination?: '/onboarding',
  ) => {
    credentialSession.set(credential, mode)
    if (destination) void navigate({ to: destination })
  }
  return (
    <main id="main-content" className="grid min-h-screen place-items-center p-6">
      <Card className="credential-card w-full max-w-md">
        <BrandMark className="mx-auto mb-3 h-24 w-32" />
        <div className="mb-4 flex justify-end">
          <LanguageSelector />
        </div>
        <p className="eyebrow">{t('compatibleApi')}</p>
        <h1 className="mt-3 text-3xl font-semibold">{t('connect')}</h1>
        <div className="mt-6 space-y-4">
          <Button
            className="w-full"
            type="button"
            onClick={() => startSession(DEVELOPMENT_API_CREDENTIAL, 'tenant')}
          >
            {t('startSession')}
          </Button>
          <Button
            className="w-full"
            type="button"
            variant="outline"
            onClick={() => startSession(DEVELOPMENT_ADMIN_API_CREDENTIAL, 'admin', '/onboarding')}
          >
            {t('startOnboarding')}
          </Button>
        </div>
      </Card>
    </main>
  )
}
