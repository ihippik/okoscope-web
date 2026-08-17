import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  ApiErrorPanel,
  OccurrenceTimeline,
  OwnershipError,
  RuntimeGroupStatusBadge,
  SemanticSummary,
} from '../features/observability/components'
import { runtimeGroupOptions } from '../features/observability/queries'
import { applicationOptions, projectOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { Card } from '../shared/ui/card'
import { Loading } from '../shared/ui/loading'
import { formatCount, formatTimestamp } from '../features/tenant/format'

export const Route = createFileRoute(
  '/projects/$projectId/applications/$applicationId/runtime-groups/$groupId',
)({ component: RuntimeGroupDetailPage })
function RuntimeGroupDetailPage() {
  const { projectId, applicationId, groupId } = Route.useParams()
  const api = useApi()
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  const group = useQuery(runtimeGroupOptions(api, projectId, applicationId, groupId))
  useEffect(() => {
    document.title = `Runtime Group · ${application.data?.name ?? 'Okoscope'}`
  }, [application.data])
  if (project.isPending || application.isPending || group.isPending)
    return <Loading label="Loading Runtime Group…" />
  if (project.isError || application.isError || group.isError)
    return (
      <ApiErrorPanel
        title="Runtime Group unavailable"
        error={group.error ?? application.error ?? project.error}
        onRetry={() => void group.refetch()}
      />
    )
  if (group.data.project_id !== projectId || group.data.application_id !== applicationId)
    return (
      <OwnershipError
        parent={
          <Link
            className="underline"
            to="/projects/$projectId/applications/$applicationId/runtime-groups"
            params={{ projectId, applicationId }}
          >
            Back to Runtime Groups
          </Link>
        }
      />
    )
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="breadcrumbs flex-wrap">
        <Link to="/projects">Projects</Link>
        <span>/</span>
        <Link to="/projects/$projectId" params={{ projectId }}>
          {project.data.name}
        </Link>
        <span>/</span>
        <Link
          to="/projects/$projectId/applications/$applicationId"
          params={{ projectId, applicationId }}
        >
          {application.data.name}
        </Link>
        <span>/</span>
        <Link
          to="/projects/$projectId/applications/$applicationId/runtime-groups"
          params={{ projectId, applicationId }}
        >
          Runtime Groups
        </Link>
        <span>/</span>
        <span aria-current="page">{group.data.event_kind}</span>
      </nav>
      <Card>
        <div className="flex gap-3">
          <h1 className="text-3xl font-semibold">{group.data.event_kind}</h1>
          <RuntimeGroupStatusBadge status={group.data.status} />
        </div>
        <p className="mt-2 text-slate-400">
          {group.data.namespace} · {group.data.workload_kind}/{group.data.workload_name}
        </p>
        <dl className="details mt-5">
          <dt>First seen</dt>
          <dd>{formatTimestamp(group.data.first_seen_at)}</dd>
          <dt>Last seen</dt>
          <dd>{formatTimestamp(group.data.last_seen_at)}</dd>
          <dt>Occurrences</dt>
          <dd>{formatCount(group.data.occurrence_count)}</dd>
        </dl>
        <div className="mt-5">
          <SemanticSummary value={group.data.semantic_summary} />
        </div>
      </Card>
      <section>
        <h2 className="mb-3 text-2xl font-semibold">Representative event</h2>
        <OccurrenceTimeline occurrences={[group.data.representative_event]} />
      </section>
      <section>
        <h2 className="mb-3 text-2xl font-semibold">Recent occurrences</h2>
        <OccurrenceTimeline occurrences={group.data.recent_occurrences} />
      </section>
    </div>
  )
}
