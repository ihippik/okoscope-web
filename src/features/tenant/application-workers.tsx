import { useInfiniteQuery } from '@tanstack/react-query'
import { applicationWorkersOptions } from '../../shared/api/queries'
import type { ApplicationWorker } from '../../shared/api/types'
import { useApi } from '../../shared/api/context'
import { useT } from '../../shared/i18n'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { Loading } from '../../shared/ui/loading'
import { formatTimestamp } from './format'

function WorkerDetails({ worker }: { worker: ApplicationWorker }) {
  const t = useT()
  const unavailable = t('notReported')
  const fields = [
    [t('cluster'), worker.cluster_name],
    [t('node'), worker.node_name],
    [t('linuxKernel'), worker.kernel_release ?? unavailable],
    [t('architecture'), worker.architecture ?? unavailable],
    [t('agentVersion'), worker.agent_version],
    [t('firstApplicationObservation'), formatTimestamp(worker.first_observed_at)],
    [t('lastApplicationObservation'), formatTimestamp(worker.last_observed_at)],
    [t('lastAgentSignal'), formatTimestamp(worker.agent_last_seen_at)],
  ] as const
  return (
    <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
      {fields.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-slate-500">{label}</dt>
          <dd className="mt-1 break-words font-mono text-slate-200">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ApplicationWorkers({
  projectId,
  applicationId,
}: {
  projectId: string
  applicationId: string
}) {
  const t = useT()
  const query = useInfiniteQuery(applicationWorkersOptions(useApi(), projectId, applicationId))

  if (query.isPending) return <Loading label={t('workersLoading')} />
  if (query.isError && !query.data)
    return (
      <ErrorState
        title={t('workersLoadFailed')}
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )

  const workers = query.data.pages
    .flatMap((page) => page.items)
    .filter(
      (worker, index, all) => all.findIndex((item) => item.agent_id === worker.agent_id) === index,
    )

  return (
    <section aria-labelledby="worker-nodes-heading">
      <div className="mb-4">
        <h2 id="worker-nodes-heading" className="text-2xl font-semibold">
          {t('workerNodes')}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{t('workerNodesHelp')}</p>
      </div>
      {query.isRefetchError && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-amber-900/70 p-3 text-sm text-amber-200"
        >
          {t('workersRefreshFailed')}
        </p>
      )}
      {!workers.length ? (
        <Card>
          <p className="text-slate-400">{t('workersEmpty')}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {workers.map((worker) => (
            <Card key={worker.agent_id} className="overflow-hidden">
              <WorkerDetails worker={worker} />
            </Card>
          ))}
        </div>
      )}
      {query.hasNextPage && (
        <Button
          className="mt-5"
          variant="outline"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
        >
          {query.isFetchingNextPage ? t('loadingMoreWorkers') : t('loadMoreWorkers')}
        </Button>
      )}
    </section>
  )
}
