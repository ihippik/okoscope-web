import { Link } from '@tanstack/react-router'
import type { ChangeEvent } from 'react'
import { formatCount, formatTimestamp } from '../tenant/format'
import { JsonDetailsViewer } from '../observability/components'
import type {
  InventoryFacet,
  InventoryFacetPage,
  InventoryGroupPage,
  InventoryItem,
  InventoryKind,
  InventoryOccurrencePage,
  InventoryReleaseEvidence,
  InventoryReleasePresencePage,
  InventorySightingPage,
  InventorySummary,
  Release,
} from '../../shared/api/types'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import type { InventorySearch } from './url-state'

export const inventoryKinds: { kind: InventoryKind; label: string }[] = [
  { kind: 'process', label: 'Processes' },
  { kind: 'destination', label: 'Destinations' },
  { kind: 'domain', label: 'Domains' },
  { kind: 'syscall', label: 'Syscalls' },
]

export function InventorySummaryCards({
  summary,
  activeKind,
  onKind,
}: {
  summary: InventorySummary
  activeKind: InventoryKind
  onKind: (kind: InventoryKind) => void
}) {
  const counts = new Map(summary.kinds.map((entry) => [entry.kind, entry]))
  return (
    <section
      aria-label="Runtime inventory summary"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {inventoryKinds.map(({ kind, label }) => {
        const value = counts.get(kind)
        return (
          <button
            key={kind}
            type="button"
            aria-pressed={activeKind === kind}
            onClick={() => onKind(kind)}
            className={`rounded-xl border p-4 text-left ${activeKind === kind ? 'border-cyan-300 bg-cyan-950/50' : 'border-slate-700 bg-slate-900/80'}`}
          >
            <span className="font-semibold">{label}</span>
            <span className="mt-2 block text-2xl font-bold">
              {formatCount(value?.item_count ?? 0)}
            </span>
            <span className="text-xs text-slate-400">
              {formatCount(value?.occurrence_count ?? 0)} occurrences
            </span>
          </button>
        )
      })}
    </section>
  )
}

export function InventoryTabs({
  activeKind,
  onKind,
}: {
  activeKind: InventoryKind
  onKind: (kind: InventoryKind) => void
}) {
  return (
    <div role="tablist" aria-label="Inventory behavior kind" className="flex flex-wrap gap-2">
      {inventoryKinds.map(({ kind, label }) => (
        <Button
          key={kind}
          role="tab"
          aria-selected={activeKind === kind}
          variant={activeKind === kind ? 'default' : 'outline'}
          onClick={() => onKind(kind)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

export function InventoryIdentity({ item }: { item: InventoryItem }) {
  const value = item.semantic_summary
  if (item.inventory_kind === 'process' && 'executable' in value)
    return <span className="break-all font-mono">{value.executable}</span>
  if (item.inventory_kind === 'destination' && 'destination_address' in value)
    return (
      <span className="break-all font-mono">
        {value.process_command} → {value.destination_address}:{value.destination_port} (
        {value.address_family})
      </span>
    )
  if (item.inventory_kind === 'domain' && 'name' in value && 'query_type' in value)
    return (
      <span className="break-all font-mono">
        {value.process_command} → {value.name} ({value.query_type})
      </span>
    )
  if (item.inventory_kind === 'syscall' && 'syscall' in value)
    return (
      <span className="break-all font-mono">
        {value.process_command} → {value.syscall}
      </span>
    )
  return <span className="text-rose-200">Unsupported identity</span>
}

export function InventoryList({
  items,
  projectId,
  applicationId,
}: {
  items: InventoryItem[]
  projectId: string
  applicationId: string
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">{item.inventory_kind}</p>
              <h2 className="mt-2 text-lg font-semibold">
                <InventoryIdentity item={item} />
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link
                to="/projects/$projectId/applications/$applicationId/runtime-inventory/$itemId"
                params={{ projectId, applicationId, itemId: item.id }}
                search={{ evidence: 'releases' }}
              >
                View evidence
              </Link>
            </Button>
          </div>
          <dl className="details mt-5">
            <dt>First observed</dt>
            <dd>{formatTimestamp(item.first_seen_at)}</dd>
            <dt>Last observed</dt>
            <dd>{formatTimestamp(item.last_seen_at)}</dd>
            <dt>Occurrences</dt>
            <dd>{formatCount(item.occurrence_count)}</dd>
          </dl>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:grid-cols-7">
            {[
              ['Releases', item.release_count],
              ['Clusters', item.cluster_count],
              ['Namespaces', item.namespace_count],
              ['Workloads', item.workload_count],
              ['Pods', item.pod_count],
              ['Containers', item.container_count],
              ['Groups', item.group_count],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-lg bg-slate-950 p-2">
                <span className="block text-xs text-slate-400">{label}</span>
                <strong>{formatCount(Number(value))}</strong>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

export const facetDefinitions: {
  facet: InventoryFacet
  field: keyof InventorySearch
  label: string
}[] = [
  { facet: 'cluster', field: 'cluster_id', label: 'Cluster' },
  { facet: 'namespace', field: 'namespace', label: 'Namespace' },
  { facet: 'workload_kind', field: 'workload_kind', label: 'Workload kind' },
  { facet: 'workload_name', field: 'workload_name', label: 'Workload name' },
  { facet: 'container_name', field: 'container_name', label: 'Container' },
]

export function FacetInput({
  label,
  field,
  value,
  page,
  onChange,
  onNext,
  onSearch,
}: {
  label: string
  field: string
  value?: string | undefined
  page?: InventoryFacetPage | undefined
  onChange: (value?: string) => void
  onNext?: ((cursor: string) => void) | undefined
  onSearch?: ((value?: string) => void) | undefined
}) {
  const listId = `inventory-${field}-options`
  return (
    <label className="text-sm">
      <span className="mb-1 block text-slate-300">{label}</span>
      <input
        className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
        list={listId}
        value={value ?? ''}
        onChange={(event) => {
          const next = event.target.value || undefined
          onSearch?.(next)
          onChange(next)
        }}
        autoComplete="off"
      />
      <datalist id={listId}>
        {page?.items.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
      {page?.next_cursor && onNext && (
        <Button
          type="button"
          className="mt-2"
          variant="ghost"
          onClick={() => page.next_cursor && onNext(page.next_cursor)}
        >
          More {label.toLowerCase()} options
        </Button>
      )}
    </label>
  )
}

export function InventoryFilterFields({
  search,
  releases,
  facets,
  onField,
  onFacetNext,
  onFacetSearch,
}: {
  search: InventorySearch
  releases: Release[]
  facets: Record<InventoryFacet, InventoryFacetPage | undefined>
  onField: (field: keyof InventorySearch, value?: string) => void
  onFacetNext?: ((facet: InventoryFacet, cursor: string) => void) | undefined
  onFacetSearch?: ((facet: InventoryFacet, value?: string) => void) | undefined
}) {
  const change =
    (field: keyof InventorySearch) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onField(field, event.target.value || undefined)
  return (
    <Card>
      <h2 className="text-lg font-semibold">Scope and filters</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block text-slate-300">Release</span>
          <select
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            value={search.release_id ?? ''}
            onChange={change('release_id')}
          >
            <option value="">All releases</option>
            {releases.map((release) => (
              <option key={release.id} value={release.id}>
                {release.version}
              </option>
            ))}
          </select>
        </label>
        {facetDefinitions.map(({ facet, field, label }) => (
          <FacetInput
            key={facet}
            label={label}
            field={field}
            value={search[field]}
            page={facets[facet]}
            onChange={(value) => onField(field, value)}
            onNext={(cursor) => onFacetNext?.(facet, cursor)}
            onSearch={(value) => onFacetSearch?.(facet, value)}
          />
        ))}
        <label className="text-sm">
          <span className="mb-1 block text-slate-300">Observed from</span>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            value={search.observed_from?.slice(0, 16) ?? ''}
            onChange={(event) =>
              onField(
                'observed_from',
                event.target.value ? new Date(event.target.value).toISOString() : undefined,
              )
            }
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-slate-300">Observed to</span>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2"
            value={search.observed_to?.slice(0, 16) ?? ''}
            onChange={(event) =>
              onField(
                'observed_to',
                event.target.value ? new Date(event.target.value).toISOString() : undefined,
              )
            }
          />
        </label>
      </div>
    </Card>
  )
}

const presenceCopy: Record<
  InventoryReleaseEvidence['presence'],
  { label: string; description: string; className: string }
> = {
  observed: {
    label: 'Observed',
    description: 'Trusted attributed occurrences support this relation.',
    className: 'text-emerald-200',
  },
  not_observed: {
    label: 'Not observed in available evidence',
    description: 'This item was not seen in the release’s available attributed evidence.',
    className: 'text-amber-200',
  },
  unknown: {
    label: 'Unknown',
    description: 'No trusted attributed evidence is available for evaluation.',
    className: 'text-slate-300',
  },
}

type EvidenceProps =
  | { kind: 'releases'; page: InventoryReleasePresencePage }
  | { kind: 'sightings'; page: InventorySightingPage }
  | { kind: 'groups'; page: InventoryGroupPage }
  | { kind: 'occurrences'; page: InventoryOccurrencePage }

export function EvidenceList(props: EvidenceProps) {
  if (props.kind === 'releases')
    return (
      <div className="space-y-3">
        {props.page.items.map((item) => {
          const copy = presenceCopy[item.presence]
          return (
            <Card key={item.release_id}>
              <h2 className="font-semibold">Release {item.version}</h2>
              <p className={`mt-2 font-semibold ${copy.className}`}>{copy.label}</p>
              <p className="text-sm text-slate-400">{copy.description}</p>
              <dl className="details mt-3">
                <dt>Release evidence</dt>
                <dd>{formatCount(item.release_evidence_count)}</dd>
                <dt>Occurrences</dt>
                <dd>
                  {item.occurrence_count === null
                    ? 'Unavailable'
                    : formatCount(item.occurrence_count)}
                </dd>
                <dt>First observed</dt>
                <dd>{formatTimestamp(item.first_seen_at)}</dd>
                <dt>Last observed</dt>
                <dd>{formatTimestamp(item.last_seen_at)}</dd>
              </dl>
            </Card>
          )
        })}
      </div>
    )
  if (props.kind === 'sightings')
    return (
      <div className="space-y-3">
        {props.page.items.map((item) => (
          <Card key={`${item.cluster_id}:${item.pod_uid}:${item.container_name}`}>
            <h2 className="break-all font-semibold">
              {item.workload_kind}/{item.workload_name}
            </h2>
            <dl className="details mt-3">
              <dt>Cluster</dt>
              <dd className="break-all">{item.cluster_id}</dd>
              <dt>Namespace</dt>
              <dd className="break-all">{item.namespace}</dd>
              <dt>Pod</dt>
              <dd className="break-all">{item.pod_name}</dd>
              <dt>Container</dt>
              <dd className="break-all">{item.container_name}</dd>
              <dt>Occurrences</dt>
              <dd>{formatCount(item.occurrence_count)}</dd>
              <dt>Observed</dt>
              <dd>
                {formatTimestamp(item.first_seen_at)} – {formatTimestamp(item.last_seen_at)}
              </dd>
            </dl>
          </Card>
        ))}
      </div>
    )
  if (props.kind === 'groups')
    return (
      <div className="space-y-3">
        {props.page.items.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="break-all font-semibold">{item.event_kind}</h2>
              <span>{item.status}</span>
            </div>
            <dl className="details mt-3">
              <dt>Workload</dt>
              <dd className="break-all">
                {item.workload_kind}/{item.workload_name}
              </dd>
              <dt>Namespace</dt>
              <dd className="break-all">{item.namespace}</dd>
              <dt>Occurrences</dt>
              <dd>{formatCount(item.occurrence_count)}</dd>
              <dt>Observed</dt>
              <dd>
                {formatTimestamp(item.first_seen_at)} – {formatTimestamp(item.last_seen_at)}
              </dd>
            </dl>
          </Card>
        ))}
      </div>
    )
  return (
    <div className="space-y-3">
      {props.page.items.map((item) => (
        <Card key={item.id}>
          <h2 className="break-all font-semibold">
            {item.event_kind} · {formatTimestamp(item.observed_at)}
          </h2>
          <dl className="details mt-3">
            <dt>Command</dt>
            <dd className="break-all">{item.process_command}</dd>
            <dt>Node</dt>
            <dd className="break-all">{item.node_name}</dd>
            <dt>Namespace</dt>
            <dd className="break-all">{item.namespace}</dd>
            <dt>Pod</dt>
            <dd className="break-all">{item.pod_name}</dd>
            <dt>Container</dt>
            <dd className="break-all">{item.container_name}</dd>
            <dt>Release</dt>
            <dd className="break-all">{item.release_version ?? 'Unavailable'}</dd>
          </dl>
          <div className="mt-4">
            <JsonDetailsViewer value={item.payload} label="Occurrence payload" />
          </div>
        </Card>
      ))}
    </div>
  )
}
