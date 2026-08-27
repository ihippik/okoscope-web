import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { applicationAttentionOptions } from '../../shared/api/queries'
import type { AttentionPriorityItem, AttentionReleaseComparison } from '../../shared/api/types'
import { inventoryDistributionOptions, inventorySummaryOptions } from '../runtime-inventory/queries'
import { isInventoryDestination } from '../runtime-inventory/components'
import { getNetworkScope } from '../observability/components'
import { runtimeGroupsOptions } from '../observability/queries'
import { useApi } from '../../shared/api/context'
import { useLocalization } from '../../shared/i18n'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { Loading } from '../../shared/ui/loading'
import { PriorityList, RecommendationList, SnapshotTime } from './components'

export function ApplicationAttention({
  projectId,
  applicationId,
}: {
  projectId: string
  applicationId: string
}) {
  const query = useQuery(applicationAttentionOptions(useApi(), projectId, applicationId, '24h'))
  const { t } = useLocalization()
  if (query.isPending) return <Loading label={t('loading')} />
  if (query.isError && !query.data)
    return (
      <ErrorState
        title={t('attentionLoadFailed')}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )
  const summary = query.data
  if (summary.project.id !== projectId || summary.application.id !== applicationId)
    return (
      <ErrorState
        title={t('applicationAttentionMismatch')}
        error={new Error(t('applicationAttentionMismatch'))}
        onRetry={() => void query.refetch()}
      />
    )
  return (
    <section aria-labelledby="application-attention-heading" className="space-y-6">
      <div>
        <h1 id="application-attention-heading" className="text-4xl font-semibold">
          {t('requiresAttention')}
        </h1>
        <p className="mt-1 text-sm text-slate-400">{t('attentionGuidanceHelp')}</p>
        <SnapshotTime value={summary.generated_at} />
      </div>
      {query.isRefetchError && (
        <Card role="alert" className="border-amber-700">
          <p>{t('snapshotStale')}</p>
        </Card>
      )}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [t('applicationNewDiscoveries'), summary.totals.new_discoveries],
          [t('applicationOpenDiscoveries'), summary.totals.open_discoveries],
          [t('applicationNewAfterRelease'), summary.totals.new_runtime_items],
          [t('applicationGoneAfterRelease'), summary.totals.disappeared_runtime_items],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg bg-slate-950 p-3">
            <dt className="text-xs text-slate-400">{label}</dt>
            <dd className="mt-1 text-xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <ObservedImpactFacts
        projectId={projectId}
        applicationId={applicationId}
        observedFrom={summary.window.from}
        observedTo={summary.window.to}
        releaseComparison={summary.release_comparison}
        priorityItems={summary.priority_items}
      />
      <RecommendationList recommendations={summary.recommendations} />
      {summary.priority_items.length > 0 && <PriorityList items={summary.priority_items} />}
    </section>
  )
}

function ObservedImpactFacts({
  projectId,
  applicationId,
  observedFrom,
  observedTo,
  releaseComparison,
  priorityItems,
}: {
  projectId: string
  applicationId: string
  observedFrom: string
  observedTo: string
  releaseComparison: AttentionReleaseComparison | null
  priorityItems: AttentionPriorityItem[]
}) {
  const { t } = useLocalization()
  const api = useApi()
  const deleted = useQuery(
    inventorySummaryOptions(api, projectId, applicationId, {
      kind: 'file_activity',
      operation: 'delete',
      observed_from: observedFrom,
      observed_to: observedTo,
    }),
  )
  const destinations = useQuery(
    inventoryDistributionOptions(api, projectId, applicationId, {
      kind: 'destination',
      observed_from: observedFrom,
      observed_to: observedTo,
    }),
  )
  const newListeners = useQuery(
    runtimeGroupsOptions(api, projectId, applicationId, {
      event_kind: 'network.listen',
      first_seen_from: observedFrom,
      first_seen_to: observedTo,
    }),
  )
  const internetObserved = destinations.data?.entries?.some((entry) => {
    const value = entry.semantic_summary
    return (
      isInventoryDestination(value) && getNetworkScope(value.destination_address) === 'internet'
    )
  })
  const internetOccurrences =
    destinations.data?.entries
      ?.filter((entry) => {
        const value = entry.semantic_summary
        return (
          isInventoryDestination(value) && getNetworkScope(value.destination_address) === 'internet'
        )
      })
      .reduce((total, entry) => total + entry.occurrence_count, 0) ?? 0
  const listenerOccurrences =
    newListeners.data?.items?.reduce((total, item) => total + item.occurrence_count, 0) ?? 0
  const largestIncrease = releaseComparison?.largest_changes
    .filter((change) => change.occurrence_delta > 0)
    .sort((left, right) => right.occurrence_delta - left.occurrence_delta)[0]
  const restartLoops = priorityItems.filter(
    (item) => item.reason_code === 'container_restart_loop_observed',
  )
  const firstRestartLoop = restartLoops.find((item) => item.resource.type === 'runtime_group')
  const restartLoopCardTone = restartLoopTone(restartLoops.length)
  const restartLoopCard = (
    <>
      <span className="text-sm text-slate-400">{t('restartLoops')}</span>
      <strong className="mt-1 block text-2xl">{restartLoops.length}</strong>
      <span className="mt-2 block text-xs text-slate-500">
        {restartLoops.length ? t('openRestartLoopFinding') : t('restartLoopsNotObserved')}
      </span>
    </>
  )
  return (
    <section aria-labelledby="observed-impact-heading" className="space-y-3">
      <h2 id="observed-impact-heading" className="text-2xl font-semibold">
        {t('observedImpact')}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {firstRestartLoop?.resource.type === 'runtime_group' ? (
          <Link
            className={`rounded-xl border p-4 transition hover:brightness-125 ${restartLoopCardTone}`}
            to="/projects/$projectId/applications/$applicationId/runtime-groups/$groupId"
            params={{
              projectId,
              applicationId,
              groupId: firstRestartLoop.resource.runtime_group_id,
            }}
            search={{}}
          >
            {restartLoopCard}
          </Link>
        ) : (
          <div className={`rounded-xl border p-4 ${restartLoopCardTone}`}>{restartLoopCard}</div>
        )}
        <Link
          className={`rounded-xl border p-4 transition hover:brightness-125 ${observedVolumeTone(deleted.data?.occurrence_count ?? 0)}`}
          to="/projects/$projectId/applications/$applicationId/runtime-inventory"
          params={{ projectId, applicationId }}
          search={{
            kind: 'file_activity',
            operation: 'delete',
            observed_from: observedFrom,
            observed_to: observedTo,
          }}
        >
          <span className="text-sm text-slate-400">{t('deletedFiles')}</span>
          <strong className="mt-1 block text-2xl">{deleted.data?.item_count ?? '—'}</strong>
          <span className="mt-2 block text-xs text-slate-500">{t('openDeletedFiles')}</span>
        </Link>
        <Link
          className={`rounded-xl border p-4 transition hover:brightness-125 ${observedVolumeTone(internetOccurrences)}`}
          to="/projects/$projectId/applications/$applicationId/runtime-inventory"
          params={{ projectId, applicationId }}
          search={{ kind: 'destination', observed_from: observedFrom, observed_to: observedTo }}
        >
          <span className="text-sm text-slate-400">{t('internetTraffic')}</span>
          <strong className="mt-1 block text-lg">
            {destinations.isPending
              ? '—'
              : internetObserved
                ? t('internetObserved')
                : t('internetNotConfirmed')}
          </strong>
          <span className="mt-2 block text-xs text-slate-500">{t('internetEvidenceNote')}</span>
        </Link>
        <Link
          className={`rounded-xl border p-4 transition hover:brightness-125 ${observedVolumeTone(listenerOccurrences)}`}
          to="/projects/$projectId/applications/$applicationId/runtime-groups"
          params={{ projectId, applicationId }}
          search={{
            event_kind: 'network.listen',
            first_seen_from: observedFrom,
            first_seen_to: observedTo,
          }}
        >
          <span className="text-sm text-slate-400">{t('newInboundPorts')}</span>
          <strong className="mt-1 block text-2xl">{newListeners.data?.items?.length ?? '—'}</strong>
          <span className="mt-2 block text-xs text-slate-500">
            {newListeners.data?.next_cursor ? t('boundedPortCount') : t('openInboundPorts')}
          </span>
        </Link>
        <div
          className={`rounded-xl border p-4 ${observedVolumeTone(largestIncrease?.occurrence_delta ?? 0)}`}
        >
          <span className="text-sm text-slate-400">{t('largestActivityIncrease')}</span>
          <strong className="mt-1 block text-lg">
            {largestIncrease
              ? t('additionalObservations', { count: largestIncrease.occurrence_delta })
              : t('noIncreaseEvidence')}
          </strong>
          <span className="mt-2 block text-xs text-slate-500">{t('growthEvidenceNote')}</span>
        </div>
      </div>
    </section>
  )
}

export function observedVolumeTone(count: number) {
  if (count >= 100) return 'border-rose-600 bg-rose-950/45'
  if (count >= 20) return 'border-orange-600 bg-orange-950/40'
  if (count >= 5) return 'border-amber-600 bg-amber-950/35'
  return 'border-emerald-700 bg-emerald-950/35'
}

export function restartLoopTone(count: number) {
  if (count > 1) return 'border-rose-600 bg-rose-950/45'
  if (count > 0) return 'border-amber-600 bg-amber-950/35'
  return observedVolumeTone(0)
}
