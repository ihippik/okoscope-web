import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, CheckCircle2, CircleDot, Sparkles } from 'lucide-react'
import type {
  AttentionNotificationProblem,
  AttentionPriority,
  AttentionPriorityItem,
  AttentionReasonCode,
  AttentionRecommendation,
  AttentionRecommendationKind,
  AttentionReleaseComparison,
} from '../../shared/api/types'
import { formatNumber, useLocalization, type MessageKey } from '../../shared/i18n'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { getEventKindLabel } from '../observability/presentation'
import { attentionDestination, type AttentionDestination } from './routing'

const priorityKeys: Record<AttentionPriority, MessageKey> = {
  urgent: 'priorityUrgent',
  high: 'priorityHigh',
  normal: 'priorityNormal',
}
const recommendationKeys: Record<AttentionRecommendationKind, MessageKey> = {
  review_failed_deliveries: 'reviewFailedDeliveries',
  configure_webhook_destination: 'configureWebhook',
  review_notification_backlog: 'reviewBacklog',
  review_release_changes: 'reviewReleaseChanges',
  review_new_discoveries: 'reviewNewDiscoveries',
}
const recommendationActionKeys: Partial<Record<AttentionRecommendationKind, MessageKey>> = {
  review_release_changes: 'checkAction',
  review_new_discoveries: 'reviewAction',
}

export function PriorityBadge({ priority }: { priority: AttentionPriority }) {
  const { t } = useLocalization()
  const tone =
    priority === 'urgent'
      ? 'border-rose-500 bg-rose-950/60 text-rose-100'
      : priority === 'high'
        ? 'border-amber-500 bg-amber-950/50 text-amber-100'
        : 'border-cyan-700 bg-cyan-950/50 text-cyan-100'
  const Icon = priority === 'urgent' ? AlertTriangle : priority === 'high' ? Sparkles : CircleDot
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}
    >
      <Icon size={13} aria-hidden="true" />
      {t(priorityKeys[priority])}
    </span>
  )
}

export function reasonText(
  reason: AttentionReasonCode,
  facts: AttentionPriorityItem['facts'],
  t: ReturnType<typeof useLocalization>['t'],
) {
  if (reason === 'notification_health_failing' || reason === 'terminal_deliveries_failed')
    return t('reasonNotificationFailing', { count: facts.failed_count ?? facts.reason_count })
  if (reason === 'notification_health_backlogged')
    return t('reasonNotificationBacklogged', { count: facts.reason_count })
  if (reason === 'notification_health_retrying')
    return t('reasonNotificationRetrying', { count: facts.reason_count })
  if (reason === 'enabled_destination_missing') return t('reasonDestinationMissing')
  if (reason === 'release_runtime_changed')
    return t('reasonReleaseChanged', {
      newCount: facts.new_count ?? 0,
      disappearedCount: facts.disappeared_count ?? 0,
    })
  if (reason === 'discovery_first_seen_in_window')
    return t('reasonDiscoveryNew', { count: facts.reason_count })
  if (reason === 'container_restart_loop_observed' && facts.restart_loop)
    return t('reasonRestartLoop', {
      container: facts.restart_loop.container_name,
      count: facts.restart_loop.observed_restart_count,
    })
  if (reason === 'policy_review_required')
    return t('reasonPolicyReviewRequired', { count: facts.reason_count })
  if (reason === 'policy_conflict') return t('reasonPolicyConflict', { count: facts.reason_count })
  if (reason === 'policy_unclassified')
    return t('reasonPolicyUnclassified', { count: facts.reason_count })
  if (reason === 'policy_evaluation_pending')
    return t('reasonPolicyEvaluationPending', { count: facts.reason_count })
  return t('reasonDiscoveryOpen', { count: facts.reason_count })
}

const policyRecommendationKeys: Partial<Record<AttentionReasonCode, MessageKey>> = {
  policy_review_required: 'reviewPolicyRequired',
  policy_conflict: 'reviewPolicyConflicts',
  policy_unclassified: 'reviewPolicyUnclassified',
  policy_evaluation_pending: 'reviewPolicyPending',
}

function RestartLoopFacts({ facts }: { facts: AttentionPriorityItem['facts'] }) {
  const { locale, t } = useLocalization()
  if (!facts.restart_loop) return null
  return (
    <div className="mt-3 rounded-lg border border-dashed border-cyan-800 bg-cyan-950/20 p-3 text-sm">
      <span className="inline-flex rounded-full border border-dashed border-cyan-700 px-2 py-0.5 text-xs font-semibold text-cyan-200">
        {t('derivedFinding')}
      </span>
      <p className="mt-2 text-xs text-slate-400">
        {t('restartLoopWindow', {
          from: localDate(locale, facts.restart_loop.window_started_at),
          to: localDate(locale, facts.restart_loop.window_ended_at),
          version: facts.restart_loop.projection_version,
          threshold: facts.restart_loop.threshold,
        })}
      </p>
      <p className="mt-2 text-xs text-slate-400">{t('boundedFindingNote')}</p>
    </div>
  )
}

function RuntimeGroupIdentity({ item }: { item: AttentionPriorityItem }) {
  const { t } = useLocalization()
  const resource = item.resource
  if (resource.type !== 'runtime_group') return null
  const displayName = runtimeGroupDisplayName(resource)
  const [eventLabel, ...detailParts] = displayName.split(' — ')
  const details = detailParts.join(' — ').split(' · ').filter(Boolean)
  return (
    <p className="mt-2 text-sm text-cyan-200">
      {t('runtimeGroup')}:{' '}
      <strong className="inline-flex max-w-full flex-wrap items-center gap-2 font-semibold">
        <span className="text-emerald-200">{eventLabel}</span>
        {details[0] ? (
          <span>
            <span className="sr-only"> </span>
            <span className="text-white">[</span>
            <span className="text-violet-200">{details[0]}</span>
            <span className="text-white">]</span>
          </span>
        ) : null}
        {details[1] ? (
          <span className="inline-flex items-center gap-2">
            <span className="sr-only"> leads to </span>
            <ArrowRight size={14} className="text-white" aria-hidden="true" />
            <span className="text-amber-200">{details[1]}</span>
          </span>
        ) : null}
      </strong>
      <span className="mt-1 block text-slate-400">
        {resource.namespace} · {resource.workload_kind}/{resource.workload_name}
      </span>
    </p>
  )
}

export function runtimeGroupDisplayName(
  group: Pick<
    Extract<AttentionPriorityItem['resource'], { type: 'runtime_group' }>,
    'event_kind' | 'semantic_summary'
  >,
) {
  const summary = group.semantic_summary as Record<string, unknown>
  const identity = [
    summary.identity,
    summary.executable,
    summary.path,
    summary.name,
    summary.syscall,
    summary.container_name,
    summary.destination_address,
  ].find((value): value is string => typeof value === 'string' && value.length > 0)
  const termination =
    summary.termination && typeof summary.termination === 'object'
      ? (summary.termination as Record<string, unknown>)
      : null
  const outcome = termination
    ? termination.type === 'signaled' && typeof termination.signal_name === 'string'
      ? termination.signal_name
      : termination.type === 'exited' && typeof termination.status === 'number'
        ? `exit ${termination.status}`
        : null
    : typeof summary.exit_code === 'number'
      ? `exit ${summary.exit_code}`
      : typeof summary.restart_count === 'number'
        ? `restart ${summary.restart_count}`
        : null
  const kind = getEventKindLabel(group.event_kind, group.semantic_summary)
  const details = [identity, outcome].filter((value): value is string => Boolean(value))
  return details.length > 0 ? `${kind} — ${details.join(' · ')}` : kind
}

export function AttentionActionLink({
  destination,
  label,
  showArrow = true,
}: {
  destination: AttentionDestination | null
  label: string
  showArrow?: boolean
}) {
  const { t } = useLocalization()
  if (!destination) return <span className="text-sm text-slate-500">{t('actionUnavailable')}</span>
  const content = (
    <>
      {label}
      {showArrow ? <ArrowRight size={14} aria-hidden="true" /> : null}
    </>
  )
  if (destination.kind === 'project')
    return (
      <Button asChild variant="outline">
        <Link to="/projects/$projectId" params={{ projectId: destination.projectId }}>
          {content}
        </Link>
      </Button>
    )
  if (destination.kind === 'application')
    return (
      <Button asChild variant="outline">
        <Link
          to="/projects/$projectId/applications/$applicationId"
          params={{ projectId: destination.projectId, applicationId: destination.applicationId }}
        >
          {content}
        </Link>
      </Button>
    )
  if (destination.kind === 'runtime-groups')
    return (
      <Button asChild variant="outline">
        <Link
          to="/projects/$projectId/applications/$applicationId/runtime-groups"
          params={{
            projectId: destination.projectId,
            applicationId: destination.applicationId,
          }}
          search={destination.search}
        >
          {content}
        </Link>
      </Button>
    )
  if (destination.kind === 'notifications')
    return (
      <Button asChild variant="outline">
        <Link to="/projects/$projectId/notifications" params={{ projectId: destination.projectId }}>
          {content}
        </Link>
      </Button>
    )
  if (destination.kind === 'runtime-group')
    return (
      <Button asChild variant="outline">
        <Link
          to="/projects/$projectId/applications/$applicationId/runtime-groups/$groupId"
          params={{
            projectId: destination.projectId,
            applicationId: destination.applicationId,
            groupId: destination.groupId,
          }}
          search={{}}
        >
          {content}
        </Link>
      </Button>
    )
  return (
    <Button asChild variant="outline">
      <Link
        to="/projects/$projectId/applications/$applicationId/releases/$targetReleaseId/runtime-diff"
        params={{
          projectId: destination.projectId,
          applicationId: destination.applicationId,
          targetReleaseId: destination.targetReleaseId,
        }}
        search={{ baseline: destination.baselineReleaseId }}
      >
        {content}
      </Link>
    </Button>
  )
}

const localDate = (locale: string, value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export function SnapshotTime({ value }: { value: string }) {
  const { locale, t } = useLocalization()
  return (
    <p className="text-xs text-slate-500">
      <time dateTime={value}>{t('snapshotGenerated', { time: localDate(locale, value) })}</time>
    </p>
  )
}

export function PriorityList({ items }: { items: AttentionPriorityItem[] }) {
  const { locale, t } = useLocalization()
  return (
    <section aria-labelledby="priority-queue-heading" className="space-y-4">
      <div>
        <h2 id="priority-queue-heading" className="text-2xl font-semibold">
          {t('priorityQueue')}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{t('priorityQueueHelp')}</p>
        <p className="mt-1 text-xs text-slate-500">{t('operationalPriorityNote')}</p>
      </div>
      <ol className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="attention-item">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <PriorityBadge priority={item.priority} />
                  <h3 className="mt-3 text-lg font-semibold">
                    {item.project.name}
                    {item.application ? ` · ${item.application.name}` : ''}
                  </h3>
                  <RuntimeGroupIdentity item={item} />
                  <p className="mt-3 text-slate-200">
                    {reasonText(item.reason_code, item.facts, t)}
                  </p>
                  <RestartLoopFacts facts={item.facts} />
                  <time className="mt-2 block text-xs text-slate-500" dateTime={item.occurred_at}>
                    {localDate(locale, item.occurred_at)}
                  </time>
                </div>
                <AttentionActionLink
                  destination={attentionDestination(item.resource, {
                    reasonCode: item.reason_code,
                  })}
                  label={t('review')}
                  showArrow={false}
                />
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function RecommendationList({
  recommendations,
}: {
  recommendations: AttentionRecommendation[]
}) {
  const { t } = useLocalization()
  return (
    <section aria-labelledby="recommendations-heading" className="space-y-4">
      <div>
        <h2 id="recommendations-heading" className="text-2xl font-semibold">
          {t('nextActions')}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{t('nextActionsHelp')}</p>
      </div>
      {recommendations.length ? (
        <ol className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          {recommendations.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={item.priority} />
                  <h3 className="font-semibold">
                    {t(policyRecommendationKeys[item.reason_code] ?? recommendationKeys[item.kind])}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-slate-200">
                  {reasonText(item.reason_code, item.facts, t)}
                </p>
                <RestartLoopFacts facts={item.facts} />
                <p className="mt-1 text-xs text-slate-500">
                  {item.project.name}
                  {item.application ? ` · ${item.application.name}` : ''}
                </p>
              </div>
              <div className="shrink-0">
                <AttentionActionLink
                  destination={attentionDestination(item.resource, {
                    recommendationKind: item.kind,
                    reasonCode: item.reason_code,
                  })}
                  label={t(
                    policyRecommendationKeys[item.reason_code] ??
                      recommendationActionKeys[item.kind] ??
                      recommendationKeys[item.kind],
                  )}
                  showArrow={false}
                />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <Card>
          <p className="text-slate-300">{t('noRecommendations')}</p>
        </Card>
      )}
    </section>
  )
}

export function ReleaseComparisonCard({
  comparison,
  destination,
  heading,
}: {
  comparison: AttentionReleaseComparison
  destination: AttentionDestination | null
  heading: string
}) {
  const { locale, t } = useLocalization()
  return (
    <Card>
      <h3 className="text-xl font-semibold">{heading}</h3>
      <p className="mt-2 text-sm text-slate-400">
        {t('baselineRelease')}: {comparison.baseline_release?.display_name ?? t('noBaseline')} →{' '}
        {t('targetRelease')}: {comparison.target_release.display_name}
      </p>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
        {[
          [t('newBehavior'), comparison.new_count],
          [t('noLongerObserved'), comparison.disappeared_count],
          [t('stillObserved'), comparison.unchanged_count],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg bg-slate-950 p-3">
            <dt className="text-xs text-slate-400">{label}</dt>
            <dd className="mt-1 text-xl font-semibold">{formatNumber(locale, Number(value))}</dd>
          </div>
        ))}
      </dl>
      {comparison.largest_changes.length > 0 && (
        <div className="mt-5">
          <h4 className="font-semibold">{t('largestChanges')}</h4>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            {comparison.largest_changes.map((change) => (
              <li key={change.group_id} className="font-mono">
                {change.classification}: {change.occurrence_delta > 0 ? '+' : ''}
                {formatNumber(locale, change.occurrence_delta)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-slate-500">{t('boundedHighlights')}</p>
        </div>
      )}
      <div className="mt-5">
        <AttentionActionLink destination={destination} label={t('reviewReleaseChanges')} />
      </div>
    </Card>
  )
}

export function NotificationProblems({ problems }: { problems: AttentionNotificationProblem[] }) {
  const { locale, t } = useLocalization()
  return (
    <section aria-labelledby="notification-problems-heading" className="space-y-4">
      <div>
        <h2 id="notification-problems-heading" className="text-2xl font-semibold">
          {t('notificationProblems')}
        </h2>
        <p className="mt-1 text-sm text-slate-400">{t('notificationProblemsHelp')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {problems.map((problem) => (
          <Card key={problem.project.id}>
            <PriorityBadge priority={problem.priority} />
            <h3 className="mt-3 text-lg font-semibold">{problem.project.name}</h3>
            <p className="mt-2 text-sm text-slate-200">
              {reasonText(
                problem.reason_code,
                {
                  reason_count: problem.failed_count || problem.due_count || problem.retrying_count,
                  failed_count: problem.failed_count,
                },
                t,
              )}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">{t('due')}</dt>
                <dd>{formatNumber(locale, problem.due_count)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('retrying')}</dt>
                <dd>{formatNumber(locale, problem.retrying_count)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{t('failed')}</dt>
                <dd>{formatNumber(locale, problem.failed_count)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-slate-500">
              <time dateTime={problem.observed_at}>
                {t('notificationObserved', { time: localDate(locale, problem.observed_at) })}
              </time>
            </p>
            <div className="mt-4">
              <AttentionActionLink
                destination={{ kind: 'notifications', projectId: problem.project.id }}
                label={t('review')}
                showArrow={false}
              />
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function AllClear() {
  const { t } = useLocalization()
  return (
    <Card className="border-emerald-800/70 text-center">
      <CheckCircle2 className="mx-auto text-emerald-300" size={34} aria-hidden="true" />
      <h2 className="mt-3 text-2xl font-semibold">{t('allClear')}</h2>
      <p className="mt-2 text-slate-400">{t('allClearHelp')}</p>
      <Button asChild className="mt-5">
        <Link to="/projects">{t('browseProjects')}</Link>
      </Button>
    </Card>
  )
}
