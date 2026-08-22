import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
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
  const [discoveryView, setDiscoveryView] = useState<'grid' | 'list'>('grid')
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  const groups = useQuery(runtimeGroupsOptions(api, projectId, applicationId, search))
  useEffect(() => {
    document.title = `New discoveries · ${application.data?.name ?? 'Okoscope'}`
  }, [application.data])
  if (location.pathname !== `/projects/${projectId}/applications/${applicationId}/runtime-groups`)
    return <Outlet />
  if (project.isPending || application.isPending || groups.isPending)
    return <Loading label="Loading New discoveries…" />
  if (project.isError || application.isError || groups.isError)
    return (
      <ApiErrorPanel
        title="New discoveries unavailable"
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
        <p className="eyebrow">Application activity</p>
        <h1 className="mt-2 text-4xl font-semibold">New discoveries</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Behavior observed for the first time in this application. A discovery is not automatically
          a problem or security incident.
        </p>
      </div>
      <Filters
        search={search}
        apply={(updates) => void navigate({ search: changeRuntimeGroupFilters(search, updates) })}
      />
      <div className="flex justify-end">
        <div
          role="group"
          aria-label="Discovery layout"
          className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1"
        >
          <Button
            className="h-8 w-8 p-0"
            variant={discoveryView === 'grid' ? 'default' : 'ghost'}
            aria-label="Tile view"
            aria-pressed={discoveryView === 'grid'}
            title="Tile view"
            onClick={() => setDiscoveryView('grid')}
          >
            <LayoutGrid size={17} aria-hidden="true" />
          </Button>
          <Button
            className="h-8 w-8 p-0"
            variant={discoveryView === 'list' ? 'default' : 'ghost'}
            aria-label="List view"
            aria-pressed={discoveryView === 'list'}
            title="List view"
            onClick={() => setDiscoveryView('list')}
          >
            <List size={17} aria-hidden="true" />
          </Button>
        </div>
      </div>
      {groups.data.items.length ? (
        <RuntimeGroupList
          groups={groups.data.items}
          projectId={projectId}
          applicationId={applicationId}
          search={search}
          view={discoveryView}
        />
      ) : (
        <EmptyState
          title={filtered ? 'No matching discoveries' : 'No discoveries yet'}
          description={
            filtered
              ? 'Adjust the filters to broaden this view.'
              : 'Newly observed behavior will appear here.'
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
    <details
      open={Object.keys(search).some((key) => key !== 'cursor') || undefined}
      className="rounded-xl border border-slate-800 bg-slate-900 p-4"
    >
      <summary className="cursor-pointer text-lg font-semibold text-slate-200 marker:text-cyan-300">
        Advanced filters
      </summary>
      <p className="mt-2 text-sm text-slate-400">
        Narrow discoveries by behavior, review status, Kubernetes location, release, or time.
      </p>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
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
              list={key === 'event_kind' ? 'runtime-event-kinds' : undefined}
              defaultValue={search[key] ?? ''}
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
            />
            {key === 'event_kind' && (
              <datalist id="runtime-event-kinds">
                <option value="network.listen">Opened port</option>
                <option value="network.accept">Accepted inbound connection</option>
              </datalist>
            )}
          </label>
        ))}
        <label className="text-sm">
          Status
          <select
            name="status"
            value={search.status ?? ''}
            onChange={(e) => {
              const value = e.target.value
              apply({
                status:
                  value === 'open' || value === 'acknowledged' || value === 'resolved'
                    ? value
                    : undefined,
              })
            }}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
          >
            <option value="">Any</option>
            <option value="open">Open</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <label className="text-sm">
          Release ID
          <input
            name="release_id"
            value={search.release_id ?? ''}
            onChange={(e) => apply({ release_id: e.target.value.trim() || undefined })}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
          />
        </label>
        {(
          [
            ['first_seen_from', 'First seen from'],
            ['first_seen_to', 'First seen to'],
            ['last_seen_to', 'Last seen to'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            {label}
            <input
              name={key}
              type="datetime-local"
              value={search[key]?.slice(0, 16) ?? ''}
              onChange={(e) =>
                apply({
                  [key]: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
              className="mt-1 w-full rounded border border-slate-700 bg-slate-950 p-2"
            />
          </label>
        ))}
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
    </details>
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
      <span aria-current="page">New discoveries</span>
    </nav>
  )
}
