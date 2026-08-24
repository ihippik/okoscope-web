import type {
  AttentionReasonCode,
  AttentionRecommendationKind,
  AttentionResourceRef,
} from '../../shared/api/types'

export type AttentionActionContext = {
  recommendationKind?: AttentionRecommendationKind
  reasonCode?: AttentionReasonCode
}

export type AttentionDestination =
  | { kind: 'project'; projectId: string }
  | { kind: 'application'; projectId: string; applicationId: string }
  | { kind: 'notifications'; projectId: string }
  | {
      kind: 'runtime-group'
      projectId: string
      applicationId: string
      groupId: string
    }
  | {
      kind: 'runtime-diff'
      projectId: string
      applicationId: string
      targetReleaseId: string
      baselineReleaseId: string
    }

const notificationReasons = new Set<AttentionReasonCode>([
  'terminal_deliveries_failed',
  'notification_health_failing',
  'notification_health_backlogged',
  'notification_health_retrying',
  'enabled_destination_missing',
])

export function attentionDestination(
  resource: unknown,
  context: AttentionActionContext = {},
): AttentionDestination | null {
  if (!resource || typeof resource !== 'object' || !('type' in resource)) return null
  const value = resource as AttentionResourceRef
  if (value.type === 'project') {
    if (
      context.recommendationKind === 'review_failed_deliveries' ||
      context.recommendationKind === 'configure_webhook_destination' ||
      context.recommendationKind === 'review_notification_backlog' ||
      (context.reasonCode && notificationReasons.has(context.reasonCode))
    )
      return { kind: 'notifications', projectId: value.project_id }
    return { kind: 'project', projectId: value.project_id }
  }
  if (value.type === 'application')
    return {
      kind: 'application',
      projectId: value.project_id,
      applicationId: value.application_id,
    }
  if (value.type === 'runtime_group')
    return {
      kind: 'runtime-group',
      projectId: value.project_id,
      applicationId: value.application_id,
      groupId: value.runtime_group_id,
    }
  if (value.type === 'runtime_diff')
    return {
      kind: 'runtime-diff',
      projectId: value.project_id,
      applicationId: value.application_id,
      targetReleaseId: value.target_release_id,
      baselineReleaseId: value.baseline_release_id,
    }
  return null
}
