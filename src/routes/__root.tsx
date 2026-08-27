import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { getCurrentUser, isAnonymousResponse, login, register } from '../shared/api/auth'
import { useApi } from '../shared/api/context'
import { buildInfoOptions } from '../shared/api/queries'
import type { LoginRequest, RegisterRequest } from '../shared/api/types'
import { authenticationSession, useAuthentication } from '../shared/auth/session'
import { useT } from '../shared/i18n'
import { LanguageSelector } from '../shared/i18n/language-selector'
import { Button } from '../shared/ui/button'
import { Brand, BrandMark } from '../shared/ui/brand'
import { Card } from '../shared/ui/card'
import { ErrorState } from '../shared/ui/error-state'
import { Loading } from '../shared/ui/loading'

export const REQUIRED_API_VERSION = 'v1'
export const REQUIRED_DATABASE_MIGRATION = 16
export const isBuildCompatible = (info: unknown): boolean => {
  if (!info || typeof info !== 'object') return false
  const value = info as { api_version?: unknown; required_database_migration?: unknown }
  return (
    value.api_version === REQUIRED_API_VERSION &&
    typeof value.required_database_migration === 'number' &&
    value.required_database_migration >= REQUIRED_DATABASE_MIGRATION
  )
}

export const Route = createRootRoute({ component: RootComponent, notFoundComponent: NotFound })

function NotFound() {
  const t = useT()
  return <ErrorState title={t('pageNotFound')} error={new Error(t('notFound'))} />
}

function RootComponent() {
  const t = useT()
  const api = useApi()
  const build = buildInfoOptions(api)
  const query = useQuery(build)
  if (query.isPending) return <StartupLoading label={t('checkingBackend')} />
  if (query.isError)
    return (
      <StartupError
        title={t('backendUnavailable')}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )
  if (!isBuildCompatible(query.data)) return <CompatibilityError info={query.data} />
  return <SessionGate />
}

function SessionGate() {
  const t = useT()
  const api = useApi()
  const auth = useAuthentication()

  const restore = () => {
    authenticationSession.checking()
    void getCurrentUser(api)
      .then(authenticationSession.authenticate)
      .catch((error) => {
        if (isAnonymousResponse(error)) authenticationSession.anonymous()
        else authenticationSession.fail(error)
      })
  }

  useEffect(() => {
    if (authenticationSession.get().status === 'checking') restore()
    // The compatible API instance is stable for the application lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])

  if (auth.status === 'checking') return <StartupLoading label={t('checkingSession')} />
  if (auth.status === 'error')
    return <StartupError title={t('sessionCheckFailed')} error={auth.error} onRetry={restore} />
  if (auth.status === 'anonymous')
    return <AuthenticationScreen expired={auth.reason === 'expired'} />
  return <AuthenticatedShell />
}

function AuthenticatedShell() {
  const t = useT()
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
            <Link
              to="/profile"
              className="nav-link"
              activeProps={{ className: 'nav-link text-cyan-300' }}
            >
              {t('profile')}
            </Link>
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

function AuthenticationScreen({ expired }: { expired: boolean }) {
  const t = useT()
  const api = useApi()
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organizationSlug, setOrganizationSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    try {
      const body = { email: email.trim(), password }
      const context =
        mode === 'login'
          ? await login(api, body satisfies LoginRequest)
          : await register(api, {
              ...body,
              organization_name: organizationName,
              organization_slug: organizationSlug,
            } satisfies RegisterRequest)
      setPassword('')
      clearProtectedQueries(queryClient)
      authenticationSession.authenticate(context)
    } catch (failure) {
      setPassword('')
      setError(failure)
    } finally {
      setPending(false)
    }
  }

  const changeName = (name: string) => {
    setOrganizationName(name)
    if (!slugEdited) setOrganizationSlug(slugify(name))
  }

  return (
    <main id="main-content" className="auth-layout min-h-screen p-6">
      <section className="max-w-xl self-center" aria-labelledby="auth-product-title">
        <BrandMark className="mb-6 h-24 w-32" />
        <p className="eyebrow">OKOSCOPE</p>
        <h1 id="auth-product-title" className="mt-3 text-4xl font-semibold sm:text-5xl">
          {t('authProductTitle')}
        </h1>
        <p className="mt-5 max-w-lg text-lg text-slate-300">{t('authProductHelp')}</p>
      </section>
      <Card className="w-full max-w-md self-center">
        <div className="mb-5 flex justify-end">
          <LanguageSelector />
        </div>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('authenticationMode')}>
          <Button
            type="button"
            variant={mode === 'login' ? 'default' : 'outline'}
            onClick={() => {
              setMode('login')
              setError(null)
            }}
          >
            {t('signIn')}
          </Button>
          <Button
            type="button"
            variant={mode === 'register' ? 'default' : 'outline'}
            onClick={() => {
              setMode('register')
              setError(null)
            }}
          >
            {t('registerOrganization')}
          </Button>
        </div>
        <h2 className="mt-6 text-2xl font-semibold">
          {mode === 'login' ? t('signInTitle') : t('registerTitle')}
        </h2>
        {expired && (
          <p role="status" className="mt-3 text-amber-200">
            {t('sessionExpired')}
          </p>
        )}
        <form className="mt-5 space-y-4" onSubmit={(event) => void submit(event)}>
          <Field label={t('email')} id="auth-email">
            <input
              id="auth-email"
              className="input"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field
            label={t('password')}
            id="auth-password"
            {...(mode === 'register' ? { help: t('passwordHelp') } : {})}
          >
            <input
              id="auth-password"
              className="input"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={mode === 'register' ? 12 : 1}
              maxLength={256}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {mode === 'register' && (
            <>
              <Field label={t('organizationName')} id="organization-name">
                <input
                  id="organization-name"
                  className="input"
                  required
                  maxLength={120}
                  value={organizationName}
                  onChange={(event) => changeName(event.target.value)}
                />
              </Field>
              <Field label={t('organizationSlug')} id="organization-slug" help={t('slugInvalid')}>
                <input
                  id="organization-slug"
                  className="input"
                  required
                  maxLength={63}
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  value={organizationSlug}
                  onChange={(event) => {
                    setSlugEdited(true)
                    setOrganizationSlug(event.target.value)
                  }}
                />
              </Field>
            </>
          )}
          {error !== null && (
            <ErrorState
              title={mode === 'login' ? t('signInFailed') : t('registrationFailed')}
              error={error}
            />
          )}
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? t('authenticating') : mode === 'login' ? t('signIn') : t('createAccount')}
          </Button>
        </form>
      </Card>
    </main>
  )
}

function Field({
  label,
  id,
  help,
  children,
}: {
  label: string
  id: string
  help?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  )
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 63)
}

export function clearProtectedQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'build-info' })
}

function StartupLoading({ label }: { label: string }) {
  return (
    <main id="main-content" className="page">
      <Loading label={label} />
    </main>
  )
}

function StartupError({
  title,
  error,
  onRetry,
}: {
  title: string
  error: unknown
  onRetry: () => void
}) {
  return (
    <main id="main-content" className="page">
      <ErrorState title={title} error={error} onRetry={onRetry} />
    </main>
  )
}

function CompatibilityError({
  info,
}: {
  info: {
    api_version?: string
    service_version?: string
    git_commit?: string
    required_database_migration?: number
  }
}) {
  const t = useT()
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
          <dd>{String(info.api_version ?? t('unknown'))}</dd>
          <dt>{t('service')}</dt>
          <dd>{String(info.service_version ?? t('unknown'))}</dd>
          <dt>{t('commit')}</dt>
          <dd className="font-mono text-xs">{String(info.git_commit ?? t('unknown'))}</dd>
          <dt>{t('requiredMigration')}</dt>
          <dd>
            {REQUIRED_DATABASE_MIGRATION} {t('orNewer')}
          </dd>
          <dt>{t('actualMigration')}</dt>
          <dd>{String(info.required_database_migration ?? t('unknown'))}</dd>
        </dl>
      </Card>
    </main>
  )
}
