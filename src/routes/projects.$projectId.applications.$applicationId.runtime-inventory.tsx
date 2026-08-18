import { useQuery } from '@tanstack/react-query'
import { Link, Outlet, createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  InventoryFilterFields,
  InventoryList,
  InventorySummaryCards,
  InventoryTabs,
} from '../features/runtime-inventory/components'
import {
  inventoryFacetOptions,
  inventoryListOptions,
  inventorySummaryOptions,
  isInvalidCursorError,
} from '../features/runtime-inventory/queries'
import { changeInventoryScope, parseInventorySearch } from '../features/runtime-inventory/url-state'
import type { InventorySearch } from '../features/runtime-inventory/url-state'
import type { InventoryFacet } from '../shared/api/types'
import { releasesOptions } from '../features/observability/queries'
import { applicationOptions, projectOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { ApiErrorPanel, EmptyState, PaginationControls } from '../features/observability/components'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'
import { Loading } from '../shared/ui/loading'

export const Route = createFileRoute(
  '/projects/$projectId/applications/$applicationId/runtime-inventory',
)({
  validateSearch: parseInventorySearch,
  component: RuntimeInventoryPage,
})

function RuntimeInventoryPage() {
  const { projectId, applicationId } = Route.useParams()
  const search: InventorySearch = Route.useSearch()
  const api = useApi()
  const location = useLocation()
  const navigate = useNavigate({ from: Route.fullPath })
  const [searchText, setSearchText] = useState<string>(search.search ?? '')
  const [facetCursors, setFacetCursors] = useState<Partial<Record<InventoryFacet, string>>>({})
  const [facetSearches, setFacetSearches] = useState<Partial<Record<InventoryFacet, string>>>({})
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  const summary = useQuery(inventorySummaryOptions(api, projectId, applicationId, search))
  const list = useQuery(inventoryListOptions(api, projectId, applicationId, search))
  const releases = useQuery(releasesOptions(api, projectId, applicationId, {}))
  const cluster = useQuery(
    inventoryFacetOptions(
      api,
      projectId,
      applicationId,
      'cluster',
      search,
      facetSearches.cluster,
      facetCursors.cluster,
    ),
  )
  const namespace = useQuery(
    inventoryFacetOptions(
      api,
      projectId,
      applicationId,
      'namespace',
      search,
      facetSearches.namespace,
      facetCursors.namespace,
    ),
  )
  const workloadKind = useQuery(
    inventoryFacetOptions(
      api,
      projectId,
      applicationId,
      'workload_kind',
      search,
      facetSearches.workload_kind,
      facetCursors.workload_kind,
    ),
  )
  const workloadName = useQuery(
    inventoryFacetOptions(
      api,
      projectId,
      applicationId,
      'workload_name',
      search,
      facetSearches.workload_name,
      facetCursors.workload_name,
    ),
  )
  const container = useQuery(
    inventoryFacetOptions(
      api,
      projectId,
      applicationId,
      'container_name',
      search,
      facetSearches.container_name,
      facetCursors.container_name,
    ),
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const value = searchText.trim().slice(0, 200) || undefined
      if (value !== search.search)
        void navigate({ search: changeInventoryScope(search, { search: value }), replace: true })
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [navigate, search, search.search, searchText])
  useEffect(() => {
    if (application.data && location.pathname.endsWith('/runtime-inventory'))
      document.title = `Runtime inventory · ${application.data.name} · Okoscope`
  }, [application.data, location.pathname])

  const path = `/projects/${projectId}/applications/${applicationId}/runtime-inventory`
  if (location.pathname !== path) return <Outlet />
  const setScope = (updates: Parameters<typeof changeInventoryScope>[1]) => {
    setFacetCursors({})
    void navigate({ search: changeInventoryScope(search, updates) })
  }
  const clearCursor = () => {
    const next = { ...search }
    delete next.cursor
    void navigate({ search: next, replace: true })
  }
  if (project.isPending || application.isPending)
    return <Loading label="Loading Runtime Inventory…" />
  if (project.isError || application.isError)
    return (
      <ApiErrorPanel
        title="Runtime Inventory scope not found"
        error={project.error ?? application.error}
        onRetry={() => {
          void project.refetch()
          void application.refetch()
        }}
      />
    )

  const facets = {
    cluster: cluster.data,
    namespace: namespace.data,
    workload_kind: workloadKind.data,
    workload_name: workloadName.data,
    container_name: container.data,
  }
  const cursorError = isInvalidCursorError(list.error)
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <Link to="/">Organization</Link>
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
        <span aria-current="page">Runtime Inventory</span>
      </nav>
      <header>
        <p className="eyebrow">Application</p>
        <h1 className="mt-2 text-4xl font-semibold">Runtime Inventory</h1>
        <p className="mt-2 text-slate-400">
          Observed behavior across the active application scope.
        </p>
      </header>
      {summary.isPending ? (
        <Loading label="Loading inventory summary…" />
      ) : summary.isError ? (
        <ApiErrorPanel
          title="Could not load inventory summary"
          error={summary.error}
          onRetry={() => void summary.refetch()}
        />
      ) : (
        <InventorySummaryCards
          summary={summary.data}
          activeKind={search.kind}
          onKind={(kind) => setScope({ kind })}
        />
      )}
      <Card>
        <label className="text-sm">
          <span className="mb-1 block text-slate-300">Search observed identity</span>
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            value={searchText}
            maxLength={200}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Executable, command, destination, domain, or syscall"
          />
        </label>
      </Card>
      <InventoryFilterFields
        search={search}
        releases={releases.data?.items ?? []}
        facets={facets}
        onField={(field, value) => setScope({ [field]: value })}
        onFacetNext={(facet, cursor) =>
          setFacetCursors((current) => ({ ...current, [facet]: cursor }))
        }
        onFacetSearch={(facet, value) =>
          setFacetSearches((current) => ({ ...current, [facet]: value }))
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InventoryTabs activeKind={search.kind} onKind={(kind) => setScope({ kind })} />
        <Button variant="ghost" onClick={() => void navigate({ search: { kind: search.kind } })}>
          Clear filters
        </Button>
      </div>
      {list.isPending ? (
        <Loading label={`Loading ${search.kind} inventory…`} />
      ) : list.isError ? (
        cursorError ? (
          <Card role="alert" className="border-amber-700">
            <h2 className="text-xl font-semibold">This cursor is no longer valid</h2>
            <p className="mt-2 text-slate-400">
              The collection scope is preserved. Return to its first page to continue.
            </p>
            <Button className="mt-4" onClick={clearCursor}>
              Return to first page
            </Button>
          </Card>
        ) : (
          <ApiErrorPanel
            title="Could not load Runtime Inventory"
            error={list.error}
            onRetry={() => void list.refetch()}
          />
        )
      ) : list.data.items.length === 0 ? (
        <EmptyState
          title={search.cursor ? 'End of inventory results' : 'No observed behavior'}
          description={
            search.cursor
              ? 'This terminal cursor page is empty. Use browser Back or return to the first page.'
              : 'No items match the active application scope and filters.'
          }
        />
      ) : (
        <InventoryList
          items={list.data.items}
          projectId={projectId}
          applicationId={applicationId}
        />
      )}
      {list.data && (
        <PaginationControls
          nextCursor={list.data.next_cursor}
          onNext={(cursor) => void navigate({ search: { ...search, cursor } })}
        />
      )}
      {search.cursor && list.data?.items.length === 0 && (
        <Button variant="outline" onClick={clearCursor}>
          Return to first page
        </Button>
      )}
      <details className="text-sm text-slate-400">
        <summary>Active scope</summary>
        <pre className="mt-2 overflow-auto whitespace-pre-wrap">
          {JSON.stringify(search, null, 2)}
        </pre>
      </details>
    </div>
  )
}
