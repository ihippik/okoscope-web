import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import {
  ApiErrorPanel,
  EmptyState,
  PaginationControls,
  RuntimeGroupList,
} from '../features/observability/components'
import { runtimeGroupsOptions } from '../features/observability/queries'
import {
  changeRuntimeGroupFilters,
  parseRuntimeGroupSearch,
} from '../features/observability/url-state'
import { applicationOptions, projectOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { Button } from '../shared/ui/button'
import { Loading } from '../shared/ui/loading'

export const Route = createFileRoute(
  '/projects/$projectId/applications/$applicationId/runtime-groups',
)({ validateSearch: parseRuntimeGroupSearch, component: RuntimeGroupsPage })
function RuntimeGroupsPage() {
  const { projectId, applicationId } = Route.useParams()
  const search = Route.useSearch()
  const location = useLocation()
  const navigate = useNavigate({ from: Route.fullPath })
  const api = useApi()
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  const groups = useQuery(runtimeGroupsOptions(api, projectId, applicationId, search))
  useEffect(() => {
    document.title = `Runtime Groups · ${application.data?.name ?? 'Okoscope'}`
  }, [application.data])
  if (location.pathname !== `/projects/${projectId}/applications/${applicationId}/runtime-groups`)
    return <Outlet />
  if (project.isPending || application.isPending || groups.isPending)
    return <Loading label="Loading Runtime Groups…" />
  if (project.isError || application.isError || groups.isError)
    return (
      <ApiErrorPanel
        title="Runtime Groups unavailable"
        error={groups.error ?? application.error ?? project.error}
        onRetry={() => {
          void project.refetch()
          void application.refetch()
          void groups.refetch()
        }}
      />
    )
  const filtered = Object.keys(search).some((key) => key !== 'cursor')
  return (
    <div className="space-y-6">
      <Breadcrumb
        projectId={projectId}
        applicationId={applicationId}
        project={project.data.name}
        application={application.data.name}
      />
      <div>
        <p className="eyebrow">Runtime observability</p>
        <h1 className="mt-2 text-4xl font-semibold">Runtime Groups</h1>
      </div>
      <Filters
        search={search}
        apply={(updates) => void navigate({ search: changeRuntimeGroupFilters(search, updates) })}
      />
      {groups.data.items.length ? (
        <RuntimeGroupList
          groups={groups.data.items}
          projectId={projectId}
          applicationId={applicationId}
        />
      ) : (
        <EmptyState
          title={filtered ? 'No matching runtime groups' : 'No runtime groups yet'}
          description={
            filtered
              ? 'Adjust the filters to broaden this view.'
              : 'Observed behavior will appear here.'
          }
        />
      )}
      <PaginationControls
        nextCursor={groups.data.next_cursor}
        onNext={(cursor) => void navigate({ search: { ...search, cursor } })}
      />
    </div>
  )
}
function Filters({
  search,
  apply,
}: {
  search: ReturnType<typeof parseRuntimeGroupSearch>
  apply: (value: Partial<ReturnType<typeof parseRuntimeGroupSearch>>) => void
}) {
  const fields = [
    ['event_kind', 'Event kind'],
    ['namespace', 'Namespace'],
    ['workload_kind', 'Workload kind'],
    ['workload_name', 'Workload name'],
  ] as const
  return (
    <form
      className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:grid-cols-2 lg:grid-cols-4"
      onSubmit={(event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        apply(
          Object.fromEntries(
            fields.map(([key]) => {
              const value = form.get(key)
              return [key, typeof value === 'string' && value.trim() ? value.trim() : undefined]
            }),
          ),
        )
      }}
    >
      {fields.map(([key, label]) => (
        <label key={key} className="text-sm">
          {label}
          <input
            name={key}
            defaultValue={search[key] ?? ''}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
          />
        </label>
      ))}
      <label className="text-sm">
        Status
        <select
          name="status"
          value={search.status ?? ''}
          onChange={(e) => apply({ status: e.target.value === 'open' ? 'open' : undefined })}
          className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
        >
          <option value="">Any</option>
          <option value="open">Open</option>
        </select>
      </label>
      <label className="text-sm">
        Observed since
        <input
          name="since"
          type="datetime-local"
          defaultValue={search.since?.slice(0, 16) ?? ''}
          onChange={(e) =>
            apply({ since: e.target.value ? new Date(e.target.value).toISOString() : undefined })
          }
          className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
        />
      </label>
      <div className="flex items-end">
        <Button type="submit">Apply filters</Button>
      </div>
    </form>
  )
}
function Breadcrumb({
  projectId,
  applicationId,
  project,
  application,
}: {
  projectId: string
  applicationId: string
  project: string
  application: string
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs flex-wrap">
      <Link to="/projects">Projects</Link>
      <span>/</span>
      <Link to="/projects/$projectId" params={{ projectId }}>
        {project}
      </Link>
      <span>/</span>
      <Link
        to="/projects/$projectId/applications/$applicationId"
        params={{ projectId, applicationId }}
      >
        {application}
      </Link>
      <span>/</span>
      <span aria-current="page">Runtime Groups</span>
    </nav>
  )
}
