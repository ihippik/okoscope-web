import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  ApiErrorPanel,
  OccurrenceTimeline,
  NotificationSummary,
  OwnershipError,
  RuntimeGroupStatusBadge,
  SemanticSummary,
  validLifecycleActions,
} from '../features/observability/components'
import {
  invalidateRuntimeGroupLifecycle,
  runRuntimeGroupLifecycle,
  runtimeGroupOccurrencesOptions,
  runtimeGroupOptions,
  type RuntimeGroupLifecycleAction,
} from '../features/observability/queries'
import {
  parseRuntimeGroupDetailSearch,
  runtimeGroupListSearch,
} from '../features/observability/url-state'
import { applicationOptions, projectOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { Card } from '../shared/ui/card'
import { Loading } from '../shared/ui/loading'
import { Button } from '../shared/ui/button'
import { formatCount, formatTimestamp } from '../features/tenant/format'

export const Route = createFileRoute(
  '/projects/$projectId/applications/$applicationId/runtime-groups/$groupId',
)({ validateSearch: parseRuntimeGroupDetailSearch, component: RuntimeGroupDetailPage })
function RuntimeGroupDetailPage() {
  const { projectId, applicationId, groupId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const api = useApi()
  const queryClient = useQueryClient()
  const [confirmResolve, setConfirmResolve] = useState(false)
  const resolveTrigger = useRef<HTMLElement | null>(null)
  const project = useQuery(projectOptions(api, projectId))
  const application = useQuery(applicationOptions(api, projectId, applicationId))
  const group = useQuery(runtimeGroupOptions(api, projectId, applicationId, groupId))
  const occurrences = useQuery(
    runtimeGroupOccurrencesOptions(
      api,
      projectId,
      applicationId,
      groupId,
      search.occurrence_cursor,
    ),
  )
  const lifecycle = useMutation({
    mutationFn: (action: RuntimeGroupLifecycleAction) =>
      runRuntimeGroupLifecycle(api, groupId, action),
    onSuccess: async () => {
      await invalidateRuntimeGroupLifecycle(queryClient, projectId, applicationId, groupId)
    },
  })
  useEffect(() => {
    document.title = `Runtime Group · ${application.data?.name ?? 'Okoscope'}`
  }, [application.data])
  useEffect(() => {
    if (!confirmResolve) resolveTrigger.current?.focus()
  }, [confirmResolve])
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
            search={runtimeGroupListSearch(search)}
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
          search={runtimeGroupListSearch(search)}
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
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{group.data.event_kind}</h1>
          <RuntimeGroupStatusBadge status={group.data.status} />
        </div>
        <p className="mt-2 text-slate-400">
          {group.data.namespace} · {group.data.workload_kind}/{group.data.workload_name}
        </p>
        <dl className="details mt-5">
          <dt>First-seen event ID</dt>
          <dd className="break-all font-mono text-xs">{group.data.first_seen_event_id}</dd>
          <dt>First seen</dt>
          <dd>{formatTimestamp(group.data.first_seen_at)}</dd>
          <dt>Last seen</dt>
          <dd>{formatTimestamp(group.data.last_seen_at)}</dd>
          <dt>Occurrences</dt>
          <dd>{formatCount(group.data.occurrence_count)}</dd>
          <dt>Status changed</dt>
          <dd>
            {group.data.status_changed_at
              ? formatTimestamp(group.data.status_changed_at)
              : 'Unavailable'}
          </dd>
          <dt>Cluster</dt>
          <dd className="break-all font-mono text-xs">{group.data.cluster_id}</dd>
        </dl>
        <LifecycleControls
          status={group.data.status}
          pending={lifecycle.isPending}
          onAction={(action) => {
            if (action !== 'resolve') return lifecycle.mutate(action)
            if (document.activeElement instanceof HTMLElement)
              resolveTrigger.current = document.activeElement
            setConfirmResolve(true)
          }}
        />
        {lifecycle.isError && (
          <div className="mt-4">
            <ApiErrorPanel title="Lifecycle update failed" error={lifecycle.error} />
          </div>
        )}
        <div className="mt-5">
          <SemanticSummary value={group.data.semantic_summary} />
        </div>
      </Card>
      <NotificationSummary notification={group.data.notification} />
      <section>
        <h2 className="mb-3 text-2xl font-semibold">Representative event</h2>
        <OccurrenceTimeline occurrences={[group.data.representative_event]} />
      </section>
      <section aria-labelledby="occurrences-heading">
        <h2 id="occurrences-heading" className="mb-3 text-2xl font-semibold">
          Occurrences
        </h2>
        {occurrences.isPending ? (
          <Loading label="Loading occurrences…" />
        ) : occurrences.isError ? (
          <ApiErrorPanel
            title="Occurrences unavailable"
            error={occurrences.error}
            onRetry={() => void occurrences.refetch()}
          />
        ) : occurrences.data.items.length ? (
          <div className="space-y-4">
            <OccurrenceTimeline occurrences={occurrences.data.items} />
            {occurrences.data.next_cursor && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() =>
                    void navigate({
                      search: {
                        ...search,
                        occurrence_cursor: occurrences.data.next_cursor ?? undefined,
                      },
                    })
                  }
                >
                  Next occurrence page
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <h3 className="text-xl font-semibold">No occurrences</h3>
            <p className="mt-2 text-slate-400">No occurrence evidence is available on this page.</p>
          </Card>
        )}
      </section>
      {confirmResolve && (
        <ResolveConfirmation
          pending={lifecycle.isPending}
          onCancel={() => setConfirmResolve(false)}
          onConfirm={() =>
            lifecycle.mutate('resolve', { onSuccess: () => setConfirmResolve(false) })
          }
        />
      )}
    </div>
  )
}

function LifecycleControls({
  status,
  pending,
  onAction,
}: {
  status: string
  pending: boolean
  onAction: (action: RuntimeGroupLifecycleAction) => void
}) {
  const labels: Record<RuntimeGroupLifecycleAction, string> = {
    acknowledge: 'Acknowledge',
    resolve: 'Resolve',
    reopen: 'Reopen',
  }
  return (
    <div className="mt-5 flex flex-wrap gap-3" aria-label="Lifecycle actions" aria-busy={pending}>
      {validLifecycleActions(status).map((action) => (
        <Button
          key={action}
          variant={action === 'resolve' ? 'outline' : 'default'}
          disabled={pending}
          onClick={() => onAction(action)}
        >
          {pending ? 'Updating…' : labels[action]}
        </Button>
      ))}
    </div>
  )
}

function ResolveConfirmation({
  pending,
  onCancel,
  onConfirm,
}: {
  pending: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [])
  return (
    <div
      ref={dialogRef}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="resolve-title"
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-6"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !pending) onCancel()
      }}
    >
      <Card className="max-w-md">
        <h2 id="resolve-title" className="text-2xl font-semibold">
          Resolve this runtime group?
        </h2>
        <p className="mt-3 text-slate-400">
          Resolve marks the current behavior as handled. You can reopen it later.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={pending} onClick={onConfirm}>
            {pending ? 'Resolving…' : 'Confirm resolve'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
