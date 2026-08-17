import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  ApiErrorPanel,
  EmptyState,
  OwnershipError,
  PaginationControls,
  RuntimeDiffList,
} from '../features/observability/components'
import { releasesOptions, runtimeDiffOptions } from '../features/observability/queries'
import { changeBaseline, parseRuntimeDiffSearch } from '../features/observability/url-state'
import { applicationOptions, projectOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { Card } from '../shared/ui/card'
import { Loading } from '../shared/ui/loading'
import { formatTimestamp } from '../features/tenant/format'

export const Route = createFileRoute(
  '/projects/$projectId/applications/$applicationId/releases/$targetReleaseId/runtime-diff',
)({ validateSearch: parseRuntimeDiffSearch, component: RuntimeDiffPage })
function RuntimeDiffPage() {
  const { projectId, applicationId, targetReleaseId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const api = useApi()
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  const releaseChoices = useQuery(releasesOptions(api, projectId, applicationId, {}))
  const diff = useQuery(runtimeDiffOptions(api, projectId, applicationId, targetReleaseId, search))
  useEffect(() => {
    document.title = `Runtime Diff · ${application.data?.name ?? 'Okoscope'}`
  }, [application.data])
  if (project.isPending || application.isPending || diff.isPending || releaseChoices.isPending)
    return <Loading label="Loading Runtime Diff…" />
  if (project.isError || application.isError || diff.isError || releaseChoices.isError)
    return (
      <ApiErrorPanel
        title="Runtime Diff unavailable"
        error={diff.error ?? releaseChoices.error ?? application.error ?? project.error}
        onRetry={() => void diff.refetch()}
      />
    )
  const owned = (r: typeof diff.data.target) =>
    r.project_id === projectId && r.application_id === applicationId
  if (
    !owned(diff.data.target) ||
    diff.data.target.id !== targetReleaseId ||
    (diff.data.baseline && !owned(diff.data.baseline))
  )
    return (
      <OwnershipError
        parent={
          <Link
            className="underline"
            to="/projects/$projectId/applications/$applicationId/releases"
            params={{ projectId, applicationId }}
          >
            Back to Releases
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
          to="/projects/$projectId/applications/$applicationId/releases"
          params={{ projectId, applicationId }}
        >
          Releases
        </Link>
        <span>/</span>
        <span aria-current="page">Runtime Diff</span>
      </nav>
      <div>
        <p className="eyebrow">Release comparison</p>
        <h1 className="mt-2 text-4xl font-semibold">Runtime Diff</h1>
      </div>
      <Card>
        <label className="block text-sm font-medium" htmlFor="baseline">
          Baseline release
        </label>
        <select
          id="baseline"
          className="mt-2 w-full rounded border border-slate-700 bg-slate-950 p-2"
          value={search.baseline ?? ''}
          onChange={(event) =>
            void navigate({ search: changeBaseline(search, event.target.value || undefined) })
          }
        >
          <option value="">Backend-selected baseline</option>
          {releaseChoices.data.items
            .filter((item) => item.id !== targetReleaseId)
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.version}
              </option>
            ))}
        </select>
        <dl className="details mt-5">
          <dt>Target</dt>
          <dd>
            {diff.data.target.version} · {formatTimestamp(diff.data.target.deployed_at)}
          </dd>
          <dt>Baseline</dt>
          <dd>
            {diff.data.baseline
              ? `${diff.data.baseline.version} · ${formatTimestamp(diff.data.baseline.deployed_at)}`
              : 'No baseline available'}
          </dd>
        </dl>
      </Card>
      {!diff.data.baseline ? (
        <EmptyState
          title="No comparison baseline"
          description="This is the first comparable release or no baseline is available."
        />
      ) : diff.data.items.length ? (
        <RuntimeDiffList
          entries={diff.data.items}
          projectId={projectId}
          applicationId={applicationId}
        />
      ) : (
        <EmptyState
          title="No runtime changes"
          description="The selected releases have no runtime diff entries."
        />
      )}
      <PaginationControls
        nextCursor={diff.data.next_cursor}
        onNext={(cursor) => void navigate({ search: { ...search, cursor } })}
      />
    </div>
  )
}
