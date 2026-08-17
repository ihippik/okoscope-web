import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { formatCount, formatTimestamp } from '../features/tenant/format'
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
          <dt>Runtime groups</dt>
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
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
            to="/projects/$projectId/applications/$applicationId/runtime-groups"
            params={{ projectId, applicationId }}
          >
            View runtime groups
          </Link>
          <Link
            className="rounded-lg border border-slate-600 px-4 py-2 font-semibold"
            to="/projects/$projectId/applications/$applicationId/releases"
            params={{ projectId, applicationId }}
          >
            View releases
          </Link>
        </div>
      </Card>
    </div>
  )
}
