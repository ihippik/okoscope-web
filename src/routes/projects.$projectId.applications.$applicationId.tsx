import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { formatCount, formatTimestamp } from '../features/tenant/format'
import { ApplicationWorkers } from '../features/tenant/application-workers'
import { applicationOptions, projectOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { Card } from '../shared/ui/card'
import { ErrorState } from '../shared/ui/error-state'
import { Loading } from '../shared/ui/loading'

export const Route = createFileRoute('/projects/$projectId/applications/$applicationId')({
  component: ApplicationPage,
})

function ApplicationPage() {
  const { projectId, applicationId } = Route.useParams()
  const location = useLocation()
  const api = useApi()
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  useEffect(() => {
    if (application.data) document.title = `${application.data.name} · Okoscope`
  }, [application.data])
  if (project.isPending || application.isPending) return <Loading label="Loading Application…" />
  if (project.isError || application.isError)
    return (
      <ErrorState
        title="Application not found"
        error={application.error ?? project.error}
        onRetry={() => {
          void project.refetch()
          void application.refetch()
        }}
      />
    )
  const applicationPath = `/projects/${projectId}/applications/${applicationId}`
  if (location.pathname !== applicationPath) return <Outlet />
  return (
    <div className="space-y-7">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link to="/">Organization</Link>
        <span>/</span>
        <Link to="/projects">Projects</Link>
        <span>/</span>
        <Link to="/projects/$projectId" params={{ projectId }}>
          {project.data.name}
        </Link>
        <span>/</span>
        <span aria-current="page">{application.data.name}</span>
      </nav>
      <Card>
        <p className="eyebrow">Application</p>
        <h1 className="mt-2 text-4xl font-semibold">{application.data.name}</h1>
        <p className="mt-2 font-mono text-sm text-slate-500">{application.data.slug}</p>
        <p className="mt-5 max-w-3xl text-lg text-slate-300">
          See which processes this application starts, where it connects, and what changes after
          each release.
        </p>
        <dl className="details mt-7">
          <dt>Releases</dt>
          <dd>
            <Link
              className="underline"
              to="/projects/$projectId/applications/$applicationId/releases"
              params={{ projectId, applicationId }}
            >
              {formatCount(application.data.release_count)}
            </Link>
          </dd>
          <dt>New discoveries</dt>
          <dd>
            <Link
              className="underline"
              to="/projects/$projectId/applications/$applicationId/runtime-groups"
              params={{ projectId, applicationId }}
            >
              {formatCount(application.data.runtime_group_count)}
            </Link>
          </dd>
          <dt>Latest observation</dt>
          <dd>{formatTimestamp(application.data.latest_observed_at)}</dd>
          <dt>Created</dt>
          <dd>{formatTimestamp(application.data.created_at)}</dd>
        </dl>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            className="rounded-xl border border-slate-700 p-4 transition hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            to="/projects/$projectId/applications/$applicationId/runtime-inventory"
            params={{ projectId, applicationId }}
          >
            <strong className="block text-lg">Application Activity</strong>
            <span className="mt-1 block text-sm text-slate-400">
              Processes, connections, and domains observed in this application.
            </span>
          </Link>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-left opacity-70"
          >
            <strong className="block text-lg">Recommendations</strong>
            <span className="mt-1 block text-sm text-slate-400">
              Coming soon: suggested actions based on observed activity.
            </span>
          </button>
          <Link
            className="rounded-xl border border-slate-700 p-4 transition hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            to="/projects/$projectId/applications/$applicationId/runtime-groups"
            params={{ projectId, applicationId }}
          >
            <strong className="block text-lg">New discoveries</strong>
            <span className="mt-1 block text-sm text-slate-400">
              Newly observed behavior to review. A discovery is not automatically a problem.
            </span>
          </Link>
          <Link
            className="rounded-xl border border-slate-700 p-4 transition hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            to="/projects/$projectId/applications/$applicationId/releases"
            params={{ projectId, applicationId }}
          >
            <strong className="block text-lg">Releases and changes</strong>
            <span className="mt-1 block text-sm text-slate-400">
              Compare observed activity between releases.
            </span>
          </Link>
        </div>
      </Card>
      <ApplicationWorkers projectId={projectId} applicationId={applicationId} />
    </div>
  )
}
