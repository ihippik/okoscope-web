import { Link } from '@tanstack/react-router'
import { CircleAlert, Copy, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type React from 'react'
import type {
  EventOccurrence,
  FirstSeenNotificationSummary,
  NetworkConnectPayload,
  NetworkConnectSemanticSummary,
  Release,
  RuntimeDiffEntry,
  RuntimeGroup,
} from '../../shared/api/types'
import type { RuntimeGroupSearch } from './url-state'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { formatCount, formatTimestamp } from '../tenant/format'

export const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000
export const isRecentlyFirstSeen = (value: string, now = Date.now()) => {
  const observed = Date.parse(value)
  return Number.isFinite(observed) && observed <= now && now - observed <= RECENT_WINDOW_MS
}

export type RuntimeGroupLifecycleAction = 'acknowledge' | 'resolve' | 'reopen'
export const validLifecycleActions = (status: string): RuntimeGroupLifecycleAction[] => {
  if (status === 'open') return ['acknowledge', 'resolve']
  if (status === 'acknowledged') return ['resolve', 'reopen']
  if (status === 'resolved') return ['reopen']
  return []
}

const notificationCopy: Record<
  FirstSeenNotificationSummary['state'],
  { label: string; description: string }
> = {
  pending: {
    label: 'Pending',
    description:
      'Delivery has not completed. If the delivery worker is disabled, it will remain pending.',
  },
  not_configured: {
    label: 'Not configured',
    description: 'No webhook destination is configured for this project.',
  },
  delivering: { label: 'Delivering', description: 'Delivery is currently in progress.' },
  delivered: { label: 'Delivered', description: 'The first-seen notification was delivered.' },
  terminally_failed: {
    label: 'Delivery failed',
    description: 'Delivery stopped after a terminal failure.',
  },
  backfill_suppressed: {
    label: 'Backfill suppressed',
    description: 'Notification was intentionally suppressed for backfilled data.',
  },
}
export const getNotificationPresentation = (state: FirstSeenNotificationSummary['state']) =>
  notificationCopy[state]

export function NotificationSummary({
  notification,
}: {
  notification: FirstSeenNotificationSummary
}) {
  const copy = getNotificationPresentation(notification.state)
  return (
    <Card>
      <h2 className="text-xl font-semibold">First-seen notification</h2>
      <p className="mt-3 font-semibold">{copy.label}</p>
      <p className="mt-1 text-sm text-slate-400">{copy.description}</p>
      <dl className="details mt-4">
        <dt>Deliveries</dt>
        <dd>{formatCount(notification.delivery_count)}</dd>
        <dt>Succeeded</dt>
        <dd>{formatCount(notification.succeeded_count)}</dd>
        <dt>Failed</dt>
        <dd>{formatCount(notification.failed_count)}</dd>
      </dl>
    </Card>
  )
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-slate-400">{description}</p>
    </Card>
  )
}
export const ApiErrorPanel = ErrorState
export function PaginationControls({
  nextCursor,
  onNext,
}: {
  nextCursor: string | null
  onNext: (cursor: string) => void
}) {
  if (!nextCursor) return null
  return (
    <div className="flex justify-end">
      <Button variant="outline" onClick={() => onNext(nextCursor)}>
        Next page
      </Button>
    </div>
  )
}
export function RuntimeGroupStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full border border-cyan-700 bg-cyan-950 px-2 py-1 text-xs font-bold uppercase text-cyan-200">
      {status}
    </span>
  )
}
export function RuntimeDiffClassificationBadge({
  classification,
}: {
  classification: RuntimeDiffEntry['classification']
}) {
  const label = classification.toUpperCase()
  return (
    <span
      className={
        classification === 'new'
          ? 'inline-flex gap-1 rounded-full bg-amber-300 px-2 py-1 text-xs font-black text-slate-950'
          : 'inline-flex rounded-full border border-slate-600 px-2 py-1 text-xs font-bold'
      }
    >
      {classification === 'new' && <Sparkles size={13} aria-hidden="true" />}
      {label}
    </span>
  )
}
function renderJson(value: unknown, depth: number, budget: { count: number }): React.ReactNode {
  if (budget.count++ > 150) return <span className="text-slate-500">… output limited</span>
  if (depth > 4) return <span className="text-slate-500">… nested value</span>
  if (value === null) return <span className="text-violet-300">null</span>
  if (typeof value === 'string')
    return <span className="break-all text-emerald-300">“{value}”</span>
  if (typeof value === 'number' || typeof value === 'boolean')
    return <span className="text-amber-300">{String(value)}</span>
  if (Array.isArray(value))
    return (
      <ol className="ml-5 list-decimal">
        {value.map((item, index) => (
          <li key={index}>{renderJson(item, depth + 1, budget)}</li>
        ))}
      </ol>
    )
  if (typeof value === 'object')
    return (
      <dl className="ml-3 border-l border-slate-700 pl-3">
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className="grid grid-cols-[minmax(6rem,auto)_1fr] gap-2">
            <dt className="break-all text-sky-300">{key}</dt>
            <dd className="min-w-0">{renderJson(item, depth + 1, budget)}</dd>
          </div>
        ))}
      </dl>
    )
  return <span className="text-slate-500">Unknown value</span>
}
export function JsonDetailsViewer({
  value,
  label = 'JSON details',
}: {
  value: unknown
  label?: string
}) {
  const [message, setMessage] = useState('')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(value, null, 2))
      setMessage('JSON copied')
    } catch {
      setMessage('Could not copy JSON')
    }
  }
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm" aria-label={label}>
      <div className="mb-3 flex justify-end">
        <Button variant="ghost" onClick={() => void copy()} aria-label={`Copy ${label}`}>
          <Copy size={14} aria-hidden="true" /> Copy JSON
        </Button>
      </div>
      <div className="overflow-x-auto">{renderJson(value, 0, { count: 0 })}</div>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  )
}
const isNetworkSummary = (
  value: RuntimeGroup['semantic_summary'],
): value is NetworkConnectSemanticSummary => 'destination_address' in value

export function SemanticSummary({ value }: { value: RuntimeGroup['semantic_summary'] }) {
  if (!isNetworkSummary(value)) return <JsonDetailsViewer value={value} label="Semantic summary" />
  return (
    <dl
      className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
      aria-label="Network destination summary"
    >
      <dt className="text-slate-300">Process</dt>
      <dd className="break-all font-mono">{value.process_command}</dd>
      <dt className="text-slate-300">Address family</dt>
      <dd>{value.address_family === 'ipv4' ? 'IPv4' : 'IPv6'}</dd>
      <dt className="text-slate-300">Destination</dt>
      <dd className="break-all font-mono">{value.destination_address}</dd>
      <dt className="text-slate-300">Port</dt>
      <dd>{value.destination_port}</dd>
    </dl>
  )
}

const networkOutcomeCopy: Record<NetworkConnectPayload['data']['outcome'], string> = {
  succeeded: 'Syscall succeeded',
  in_progress: 'Connection attempt continues asynchronously; establishment is not confirmed',
  failed: 'Syscall failed',
}

function NetworkOccurrence({ payload }: { payload: NetworkConnectPayload }) {
  return (
    <dl
      className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
      aria-label="Network connection attempt"
    >
      <dt className="text-slate-300">Address family</dt>
      <dd>{payload.data.address_family === 'ipv4' ? 'IPv4' : 'IPv6'}</dd>
      <dt className="text-slate-300">Destination</dt>
      <dd className="break-all font-mono">{payload.data.destination_address}</dd>
      <dt className="text-slate-300">Port</dt>
      <dd>{payload.data.destination_port}</dd>
      <dt className="text-slate-300">Outcome</dt>
      <dd>{networkOutcomeCopy[payload.data.outcome]}</dd>
      {payload.data.errno !== undefined && (
        <>
          <dt className="text-slate-300">Errno</dt>
          <dd>{payload.data.errno}</dd>
        </>
      )}
    </dl>
  )
}

export function RuntimeGroupList({
  groups,
  projectId,
  applicationId,
  search,
}: {
  groups: RuntimeGroup[]
  projectId: string
  applicationId: string
  search: RuntimeGroupSearch
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card
          key={group.id}
          className={isRecentlyFirstSeen(group.first_seen_at) ? 'border-amber-400/70' : ''}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  className="text-xl font-semibold text-cyan-200 underline"
                  to="/projects/$projectId/applications/$applicationId/runtime-groups/$groupId"
                  params={{ projectId, applicationId, groupId: group.id }}
                  search={search}
                >
                  {group.event_kind}
                </Link>
                <RuntimeGroupStatusBadge status={group.status} />
                {isRecentlyFirstSeen(group.first_seen_at) && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                    <Sparkles size={14} aria-hidden="true" /> Recently first seen
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {group.namespace} · {group.workload_kind}/{group.workload_name}
              </p>
            </div>
            <p className="text-sm">{formatCount(group.occurrence_count)} occurrences</p>
          </div>
          <div className="mt-4">
            <SemanticSummary value={group.semantic_summary} />
          </div>
          <dl className="details mt-4">
            <dt>First seen</dt>
            <dd>{formatTimestamp(group.first_seen_at)}</dd>
            <dt>Last seen</dt>
            <dd>{formatTimestamp(group.last_seen_at)}</dd>
          </dl>
        </Card>
      ))}
    </div>
  )
}
export function OccurrenceTimeline({ occurrences }: { occurrences: EventOccurrence[] }) {
  return (
    <ol className="space-y-4">
      {occurrences.map((item) => (
        <li key={item.id}>
          <Card>
            <p className="font-semibold">{formatTimestamp(item.observed_at)}</p>
            <dl className="details mt-3">
              <dt>Node</dt>
              <dd>{item.node_name || 'Unavailable'}</dd>
              <dt>Namespace</dt>
              <dd>{item.namespace || 'Unavailable'}</dd>
              <dt>Pod</dt>
              <dd>{item.pod_name || 'Unavailable'}</dd>
              <dt>Container</dt>
              <dd>{item.container_name || 'Unavailable'}</dd>
              <dt>Process</dt>
              <dd className="break-all font-mono text-sm">
                {item.process_command || 'Unavailable'}
              </dd>
              <dt>Event kind</dt>
              <dd>{item.event_kind}</dd>
              <dt>Release</dt>
              <dd>{item.release_version ?? item.release_id ?? 'Unavailable'}</dd>
            </dl>
            <div className="mt-4">
              {item.payload.type === 'NetworkConnect' ? (
                <NetworkOccurrence payload={item.payload} />
              ) : (
                <JsonDetailsViewer value={item.payload} label="Event payload" />
              )}
            </div>
          </Card>
        </li>
      ))}
    </ol>
  )
}
export function ReleaseList({
  releases,
  projectId,
  applicationId,
}: {
  releases: Release[]
  projectId: string
  applicationId: string
}) {
  return (
    <div className="space-y-4">
      {releases.map((release) => (
        <Card key={release.id}>
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{release.version}</h2>
              <p className="mt-2 text-slate-400">{release.description ?? 'No description'}</p>
              <p className="mt-2 text-sm">Deployed {formatTimestamp(release.deployed_at)}</p>
            </div>
            <Button asChild variant="outline">
              <Link
                to="/projects/$projectId/applications/$applicationId/releases/$targetReleaseId/runtime-diff"
                params={{ projectId, applicationId, targetReleaseId: release.id }}
              >
                View runtime diff
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
export function RuntimeDiffList({
  entries,
  projectId,
  applicationId,
}: {
  entries: RuntimeDiffEntry[]
  projectId: string
  applicationId: string
}) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <Card
          key={entry.group_id}
          className={entry.classification === 'new' ? 'border-amber-400/70' : ''}
        >
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex items-center gap-2">
              <RuntimeDiffClassificationBadge classification={entry.classification} />
              <strong>{entry.event_kind}</strong>
            </div>
            <Link
              className="text-cyan-200 underline"
              to="/projects/$projectId/applications/$applicationId/runtime-groups/$groupId"
              params={{ projectId, applicationId, groupId: entry.group_id }}
            >
              View group
            </Link>
          </div>
          <dl className="details my-4">
            <dt>Baseline occurrences</dt>
            <dd>
              {entry.baseline_occurrence_count === null
                ? '—'
                : formatCount(entry.baseline_occurrence_count)}
            </dd>
            <dt>Target occurrences</dt>
            <dd>
              {entry.target_occurrence_count === null
                ? '—'
                : formatCount(entry.target_occurrence_count)}
            </dd>
          </dl>
          <SemanticSummary value={entry.semantic_summary} />
        </Card>
      ))}
    </div>
  )
}
export function OwnershipError({ parent }: { parent: React.ReactNode }) {
  return (
    <Card role="alert" className="border-rose-900">
      <CircleAlert className="text-rose-300" />
      <h1 className="mt-3 text-2xl font-semibold">Resource does not belong to this Application</h1>
      <p className="mt-2 text-slate-400">
        The response was withheld because its ownership does not match this route.
      </p>
      <div className="mt-4">{parent}</div>
    </Card>
  )
}
