import { Link } from '@tanstack/react-router'
import { CircleAlert, Copy, DoorOpen, Network, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type React from 'react'
import type {
  EventOccurrence,
  DnsContext,
  FirstSeenNotificationSummary,
  FileActivitySemanticSummary,
  FileCreatePayload,
  FileModifyPayload,
  FileDeletePayload,
  FileRenamePayload,
  NetworkConnectPayload,
  NetworkConnectSemanticSummary,
  InboundNetworkSemanticSummary,
  NetworkAcceptPayload,
  NetworkListenPayload,
  NetworkDnsQueryPayload,
  NetworkDnsResponsePayload,
  Release,
  RuntimeDiffEntry,
  RuntimeGroup,
} from '../../shared/api/types'
import type { RuntimeGroupSearch } from './url-state'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { formatCount, formatTimestamp } from '../tenant/format'
import {
  directionLabel,
  formatEndpoint,
  getEventKindLabel,
  getWildcardEndpointLabel,
} from './presentation'

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
export function RuntimeDiffClassificationBadge({ classification }: { classification: string }) {
  const label =
    (
      {
        new: 'New',
        disappeared: 'No longer observed',
        unchanged: 'Still observed',
      } as Record<string, string>
    )[classification] ?? 'Unknown'
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
const isDnsSummary = (value: RuntimeGroup['semantic_summary']) =>
  'query_type' in value && 'name' in value
const isInboundSummary = (
  value: RuntimeGroup['semantic_summary'],
): value is InboundNetworkSemanticSummary => 'local_address' in value && 'local_port' in value
const isFileActivitySummary = (
  value: RuntimeGroup['semantic_summary'],
): value is FileActivitySemanticSummary => 'operation' in value && 'path' in value

export const FILE_PATH_HELP =
  'Path reported by the process. It may contain symlinks and is not a canonical filesystem path.'

export function FilePathValue({ path, label = 'Syscall path' }: { path: string; label?: string }) {
  const [message, setMessage] = useState('')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(path)
      setMessage('Path copied')
    } catch {
      setMessage('Could not copy path')
    }
  }
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-2">
      <span
        className="block max-w-[42rem] truncate font-mono"
        title={`${path}\n\n${FILE_PATH_HELP}`}
        aria-label={`${label}: ${path}. ${FILE_PATH_HELP}`}
      >
        {path}
      </span>
      <Button variant="ghost" onClick={() => void copy()} aria-label={`Copy ${label}`}>
        <Copy size={14} aria-hidden="true" /> Copy
      </Button>
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </span>
  )
}

export const replacementLabel = (value: boolean | null | undefined) =>
  value === true ? 'Replaced' : value === false ? 'Not replaced' : 'Unknown'

export function FileActivitySummary({ value }: { value: FileActivitySemanticSummary }) {
  const rename = value.operation === 'rename'
  return (
    <dl
      className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
      aria-label="File activity summary"
    >
      <dt>Operation</dt>
      <dd className="capitalize">{value.operation}</dd>
      <dt>Process</dt>
      <dd className="break-all font-mono">{value.process_command}</dd>
      <dt>{rename ? 'Old syscall path' : 'Syscall path'}</dt>
      <dd className="min-w-0">
        <FilePathValue path={value.path} label={rename ? 'Old syscall path' : 'Syscall path'} />
      </dd>
      {rename && value.new_path && (
        <>
          <dt>New syscall path</dt>
          <dd className="min-w-0">
            <FilePathValue path={value.new_path} label="New syscall path" />
          </dd>
        </>
      )}
      {rename && (
        <>
          <dt>Replacement</dt>
          <dd>{replacementLabel(value.replaced)}</dd>
        </>
      )}
      <dt className="sr-only">Path semantics</dt>
      <dd className="col-span-2 text-xs text-slate-400" title={FILE_PATH_HELP}>
        {FILE_PATH_HELP}
      </dd>
      {value.operation === 'modify' && (
        <>
          <dt className="sr-only">Collection window</dt>
          <dd className="col-span-2 text-xs text-slate-400">
            Modify activity is aggregated in fixed five-second windows. It does not represent every
            individual write or guarantee instantaneous visibility.
          </dd>
        </>
      )}
    </dl>
  )
}

export function EndpointValue({
  addressFamily,
  address,
  port,
}: {
  addressFamily: 'ipv4' | 'ipv6'
  address: string
  port: number
}) {
  const wildcard = getWildcardEndpointLabel(addressFamily, address)
  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-2">
      <span className="break-all font-mono">{formatEndpoint(addressFamily, address, port)}</span>
      {wildcard && (
        <span className="rounded-full border border-slate-600 px-2 py-0.5 text-xs text-slate-300">
          {wildcard}
        </span>
      )}
    </span>
  )
}

export function InboundEventBadge({ eventKind }: { eventKind: string }) {
  if (eventKind !== 'network.listen' && eventKind !== 'network.accept') return null
  const accept = eventKind === 'network.accept'
  const Icon = accept ? Network : DoorOpen
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${accept ? 'border-violet-700 bg-violet-950 text-violet-200' : 'border-emerald-700 bg-emerald-950 text-emerald-200'}`}
    >
      <Icon size={13} aria-hidden="true" /> {getEventKindLabel(eventKind)}
    </span>
  )
}

export type NetworkScope = 'local' | 'private' | 'internet' | 'unknown'

export function getNetworkScope(address: string): NetworkScope {
  const normalized = address
    .trim()
    .toLowerCase()
    .replace(/^\[|\]$/g, '')
  if (normalized === 'localhost' || normalized === '::1') return 'local'

  const ipv4 = normalized.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const octets = ipv4.slice(1).map(Number)
    if (octets.some((octet) => octet > 255)) return 'unknown'
    const first = octets[0]!
    const second = octets[1]!
    if (first === 127) return 'local'
    if (
      first === 10 ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 169 && second === 254)
    )
      return 'private'
    if (first === 0 || first >= 224) return 'unknown'
    return 'internet'
  }

  if (normalized.includes(':')) {
    if (
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe8') ||
      normalized.startsWith('fe9') ||
      normalized.startsWith('fea') ||
      normalized.startsWith('feb')
    )
      return 'private'
    return normalized === '::' || normalized.startsWith('ff') ? 'unknown' : 'internet'
  }

  return 'unknown'
}

const networkScopePresentation: Record<
  NetworkScope,
  { label: string; tooltip: string; className: string }
> = {
  local: {
    label: 'Local',
    tooltip: 'Local connection: traffic stays on this computer and does not go to the internet.',
    className: 'border-emerald-700 bg-emerald-950 text-emerald-200',
  },
  private: {
    label: 'Local network',
    tooltip:
      'Private network connection: traffic may reach another device on the local network, but the address is not public.',
    className: 'border-sky-700 bg-sky-950 text-sky-200',
  },
  internet: {
    label: 'Internet',
    tooltip:
      'External connection: this is a public address reachable over the internet. External does not necessarily mean unsafe.',
    className: 'border-amber-700 bg-amber-950 text-amber-200',
  },
  unknown: {
    label: 'Unknown scope',
    tooltip: 'The destination scope could not be determined from this address.',
    className: 'border-slate-600 bg-slate-900 text-slate-300',
  },
}

export function NetworkScopeBadge({ address }: { address: string }) {
  const presentation = networkScopePresentation[getNetworkScope(address)]
  return (
    <span
      className={`inline-flex cursor-help items-center rounded-full border px-2 py-0.5 font-sans text-xs font-semibold ${presentation.className}`}
      title={presentation.tooltip}
      aria-label={`${presentation.label}. ${presentation.tooltip}`}
      tabIndex={0}
    >
      {presentation.label}
    </span>
  )
}

function DnsContextView({ context }: { context: DnsContext }) {
  return (
    <>
      <dt className="sr-only">DNS context</dt>
      <dd className="col-span-2 mt-2 rounded border border-cyan-900 bg-cyan-950/30 p-3">
        <p className="font-semibold text-cyan-200">Recently observed DNS evidence</p>
        <ul aria-label="Observed DNS names" className="mt-2 list-disc pl-5 font-mono">
          {context.names.map((name) => (
            <li key={name} className="break-all">
              {name}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-400">
          {context.ambiguous ? 'Ambiguous: multiple names were observed for this IP. ' : ''}
          Evidence expires {formatTimestamp(context.expires_at)}. The IP remains the canonical
          destination.
        </p>
      </dd>
    </>
  )
}

export function SemanticSummary({ value }: { value: RuntimeGroup['semantic_summary'] }) {
  if (isFileActivitySummary(value)) return <FileActivitySummary value={value} />
  if (isDnsSummary(value))
    return (
      <dl
        className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
        aria-label="DNS behavior summary"
      >
        <dt>Process</dt>
        <dd className="font-mono">{value.process_command}</dd>
        <dt>Name</dt>
        <dd className="break-all font-mono">{value.name}</dd>
        <dt>Query type</dt>
        <dd>{value.query_type}</dd>
        {'response_code' in value && (
          <>
            <dt>Response</dt>
            <dd>{value.response_code.toUpperCase()}</dd>
          </>
        )}
        <dt>Transport</dt>
        <dd>{value.transport.toUpperCase()}</dd>
      </dl>
    )
  if (isInboundSummary(value))
    return (
      <dl
        className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
        aria-label="Inbound connection summary"
      >
        <dt>Process</dt>
        <dd className="min-w-0 break-all font-mono">{value.process_command}</dd>
        <dt>Transport</dt>
        <dd>{value.transport.toUpperCase()}</dd>
        <dt>Address family</dt>
        <dd>{value.address_family === 'ipv4' ? 'IPv4' : 'IPv6'}</dd>
        <dt>Local endpoint</dt>
        <dd className="min-w-0">
          <EndpointValue
            addressFamily={value.address_family}
            address={value.local_address}
            port={value.local_port}
          />
        </dd>
      </dl>
    )
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
      <dd className="flex flex-wrap items-center gap-2 break-all font-mono">
        {value.destination_address}
        <NetworkScopeBadge address={value.destination_address} />
      </dd>
      <dt className="text-slate-300">Port</dt>
      <dd>{value.destination_port}</dd>
      {value.dns_context && <DnsContextView context={value.dns_context} />}
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
      <dd className="flex flex-wrap items-center gap-2 break-all font-mono">
        {payload.data.destination_address}
        <NetworkScopeBadge address={payload.data.destination_address} />
      </dd>
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
      {payload.data.dns_context && <DnsContextView context={payload.data.dns_context} />}
    </dl>
  )
}

function InboundNetworkOccurrence({
  payload,
}: {
  payload: NetworkListenPayload | NetworkAcceptPayload
}) {
  const data = payload.data
  return (
    <dl
      className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
      aria-label={payload.type === 'NetworkAccept' ? 'Accepted inbound connection' : 'TCP listener'}
    >
      <dt>Transport</dt>
      <dd>{data.transport.toUpperCase()}</dd>
      <dt>Address family</dt>
      <dd>{data.address_family === 'ipv4' ? 'IPv4' : 'IPv6'}</dd>
      <dt>Local endpoint</dt>
      <dd className="min-w-0">
        <EndpointValue
          addressFamily={data.address_family}
          address={data.local_address}
          port={data.local_port}
        />
      </dd>
      {payload.type === 'NetworkAccept' && (
        <>
          <dt>Remote endpoint</dt>
          <dd className="min-w-0">
            <EndpointValue
              addressFamily={payload.data.address_family}
              address={payload.data.remote_address}
              port={payload.data.remote_port}
            />
          </dd>
        </>
      )}
    </dl>
  )
}

function DnsOccurrence({
  payload,
}: {
  payload: NetworkDnsQueryPayload | NetworkDnsResponsePayload
}) {
  const data = payload.data
  return (
    <dl
      className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
      aria-label="DNS observation"
    >
      <dt>Name</dt>
      <dd className="break-all font-mono">{data.name}</dd>
      <dt>Query type</dt>
      <dd>{data.query_type}</dd>
      <dt>Transport</dt>
      <dd>{data.transport.toUpperCase()}</dd>
      <dt>Connection flow</dt>
      <dd>{directionLabel(data.direction)}</dd>
      <dt>Resolver</dt>
      <dd className="font-mono">{data.resolver_address}</dd>
      {'response_code' in data && (
        <>
          <dt>Response</dt>
          <dd>{data.response_code}</dd>
          <dt>Answers</dt>
          <dd>
            {data.answers.length
              ? data.answers
                  .map((answer) => `${answer.address} (${answer.ttl_seconds}s)`)
                  .join(', ')
              : 'No address answer'}
          </dd>
          <dt>CNAME chain</dt>
          <dd>
            {data.cname_chain.length
              ? data.cname_chain.map((item) => `${item.alias} → ${item.canonical}`).join(', ')
              : 'None'}
          </dd>
        </>
      )}
      <div className="col-span-2 mt-2 text-xs text-slate-400">
        Plaintext DNS evidence only. Cached or encrypted DNS may be unavailable.
      </div>
    </dl>
  )
}

function FileOccurrence({
  payload,
}: {
  payload: FileCreatePayload | FileModifyPayload | FileDeletePayload | FileRenamePayload
}) {
  const operation = payload.type.slice('file.'.length)
  const rename = payload.type === 'file.rename'
  return (
    <dl
      className="details rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm"
      aria-label="File activity occurrence"
    >
      <dt>Operation</dt>
      <dd className="capitalize">{operation}</dd>
      <dt>{rename ? 'Old syscall path' : 'Syscall path'}</dt>
      <dd className="min-w-0">
        <FilePathValue
          path={payload.data.path}
          label={rename ? 'Old syscall path' : 'Syscall path'}
        />
      </dd>
      {rename && (
        <>
          <dt>New syscall path</dt>
          <dd className="min-w-0">
            <FilePathValue path={payload.data.new_path} label="New syscall path" />
          </dd>
          <dt>Replacement</dt>
          <dd>{replacementLabel(payload.data.replaced)}</dd>
        </>
      )}
      <dt className="sr-only">Path semantics</dt>
      <dd className="col-span-2 text-xs text-slate-400">{FILE_PATH_HELP}</dd>
      {payload.type === 'file.modify' && (
        <>
          <dt className="sr-only">Collection window</dt>
          <dd className="col-span-2 text-xs text-slate-400">
            Modify activity is aggregated in fixed five-second windows; it is not a list of
            individual writes.
          </dd>
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
  view = 'list',
}: {
  groups: RuntimeGroup[]
  projectId: string
  applicationId: string
  search: RuntimeGroupSearch
  view?: 'grid' | 'list'
}) {
  return (
    <div data-view={view} className={view === 'grid' ? 'grid gap-4 lg:grid-cols-2' : 'space-y-4'}>
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
                  {getEventKindLabel(group.event_kind, group.semantic_summary)}
                </Link>
                <InboundEventBadge eventKind={group.event_kind} />
                <RuntimeGroupStatusBadge status={group.status} />
                {isRecentlyFirstSeen(group.first_seen_at) && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                    <Sparkles size={14} aria-hidden="true" /> Newly observed
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {group.namespace} · {group.workload_kind}/{group.workload_name}
              </p>
            </div>
            <p className="text-sm">{formatCount(group.occurrence_count)} observations</p>
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
export function OccurrenceTimeline({
  occurrences,
  view = 'list',
}: {
  occurrences: EventOccurrence[]
  view?: 'grid' | 'list'
}) {
  return (
    <ol data-view={view} className={view === 'grid' ? 'grid gap-4 lg:grid-cols-2' : 'space-y-4'}>
      {occurrences.map((item) => (
        <li key={item.id}>
          <Card>
            <p className="font-semibold">{formatTimestamp(item.observed_at)}</p>
            <p className="mt-2 text-sm font-semibold">{getEventKindLabel(item.event_kind)}</p>
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
              <dt>Release</dt>
              <dd>{item.release_version ?? item.release_id ?? 'Unavailable'}</dd>
            </dl>
            <details className="mt-4 rounded-lg border border-slate-700 p-3">
              <summary className="cursor-pointer font-semibold">Technical details</summary>
              <p className="mt-3 text-xs text-slate-400">Event kind: {item.event_kind}</p>
              <div className="mt-3">
                {item.payload.type === 'NetworkConnect' ? (
                  <NetworkOccurrence payload={item.payload} />
                ) : item.payload.type === 'NetworkListen' ||
                  item.payload.type === 'NetworkAccept' ? (
                  <InboundNetworkOccurrence payload={item.payload} />
                ) : item.payload.type === 'NetworkDnsQuery' ||
                  item.payload.type === 'NetworkDnsResponse' ? (
                  <DnsOccurrence payload={item.payload} />
                ) : item.payload.type === 'file.create' ||
                  item.payload.type === 'file.modify' ||
                  item.payload.type === 'file.delete' ||
                  item.payload.type === 'file.rename' ? (
                  <FileOccurrence payload={item.payload} />
                ) : (
                  <JsonDetailsViewer value={item.payload} label="Event payload" />
                )}
              </div>
            </details>
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
                View changes
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
              <strong>{getEventKindLabel(entry.event_kind, entry.semantic_summary)}</strong>
            </div>
            <Link
              className="text-cyan-200 underline"
              to="/projects/$projectId/applications/$applicationId/runtime-groups/$groupId"
              params={{ projectId, applicationId, groupId: entry.group_id }}
            >
              View discovery
            </Link>
          </div>
          <dl className="details my-4">
            <dt>Baseline observations</dt>
            <dd>
              {entry.baseline_occurrence_count === null
                ? '—'
                : formatCount(entry.baseline_occurrence_count)}
            </dd>
            <dt>Target observations</dt>
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
