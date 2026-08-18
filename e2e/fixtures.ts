import type { Page, Route } from '@playwright/test'

const organization = {
  id: '00000000-0000-4000-8000-000000000001',
  slug: 'acme',
  name: 'Acme',
  created_at: '2026-08-17T12:00:00Z',
}
const project = {
  id: '00000000-0000-4000-8000-000000000002',
  slug: 'platform',
  name: 'Platform',
  created_at: '2026-08-17T12:00:00Z',
  archived_at: null,
  application_count: 1,
  runtime_group_count: 3,
}
const application = {
  id: '00000000-0000-4000-8000-000000000003',
  project_id: project.id,
  slug: 'gateway',
  name: 'Gateway',
  created_at: '2026-08-17T12:00:00Z',
  release_count: 2,
  runtime_group_count: 3,
  latest_observed_at: null,
}
const group = {
  id: '00000000-0000-4000-8000-000000000004',
  project_id: project.id,
  application_id: application.id,
  cluster_id: '00000000-0000-4000-8000-000000000005',
  namespace: 'production',
  workload_kind: 'Deployment',
  workload_name: 'gateway',
  fingerprint_version: 1,
  event_kind: 'network.connect',
  semantic_summary: {
    process_command: '/app/gateway',
    address_family: 'ipv4',
    destination_address: '203.0.113.7',
    destination_port: 443,
  },
  status: 'open',
  first_seen_at: '2026-08-17T10:00:00Z',
  first_seen_event_id: '00000000-0000-4000-8000-000000000006',
  last_seen_at: '2026-08-17T12:00:00Z',
  occurrence_count: 12,
  representative_event_id: '00000000-0000-4000-8000-000000000006',
  status_changed_at: null,
  status_changed_by: null,
}
const occurrence = {
  id: '00000000-0000-4000-8000-000000000007',
  event_id: group.representative_event_id,
  observed_at: '2026-08-17T12:00:00Z',
  node_name: 'node-1',
  namespace: 'production',
  pod_name: 'gateway-abc',
  container_name: 'gateway',
  process_command: '/app/gateway serve',
  event_kind: 'network.connect',
  payload: {
    type: 'NetworkConnect',
    data: {
      address_family: 'ipv4',
      destination_address: '203.0.113.7',
      destination_port: 443,
      outcome: 'succeeded',
    },
  },
  release_id: '00000000-0000-4000-8000-000000000008',
  release_version: 'v2',
}
const targetRelease = {
  id: '00000000-0000-4000-8000-000000000008',
  project_id: project.id,
  application_id: application.id,
  version: 'v2',
  description: 'Current',
  deployed_at: '2026-08-17T11:00:00Z',
  created_at: '2026-08-17T11:00:00Z',
}
const baselineRelease = {
  id: '00000000-0000-4000-8000-000000000009',
  project_id: project.id,
  application_id: application.id,
  version: 'v1',
  description: 'Baseline',
  deployed_at: '2026-08-16T11:00:00Z',
  created_at: '2026-08-16T11:00:00Z',
}
const releases = [targetRelease, baselineRelease]

const json = (route: Route, body: unknown, status = 200, requestId = 'e2e-request') =>
  route.fulfill({
    status,
    contentType: 'application/json',
    headers: { 'x-request-id': requestId },
    body: JSON.stringify(body),
  })

export async function mockApi(page: Page) {
  let groupStatus: 'open' | 'acknowledged' | 'resolved' = 'open'
  const destination = {
    id: '00000000-0000-4000-8000-000000000010',
    project_id: project.id,
    name: 'Operations',
    url: 'https://receiver.example/hooks',
    enabled: true,
    deliver_backfill: false,
    revision: 1,
    created_at: '2026-08-17T12:00:00Z',
    updated_at: '2026-08-17T12:00:00Z',
    disabled_at: null as string | null,
  }
  const delivery = {
    id: '00000000-0000-4000-8000-000000000011',
    project_id: project.id,
    destination_id: destination.id,
    outbox_message_id: null,
    origin: 'test',
    source: 'operator',
    event_name: 'notification.test',
    semantic_metadata: {
      application_id: application.id,
      group_id: group.id,
      event_kind: 'notification.test',
    },
    destination: { id: destination.id, name: destination.name, enabled: true },
    status: 'pending',
    available_at: '2026-08-17T12:00:00Z',
    next_attempt_at: '2026-08-17T12:05:00Z',
    recovery_generation: 0,
    attempt_count: 1,
    total_attempt_count: 1,
    max_attempts: 5,
    last_error_class: null,
    terminal_reason: null,
    created_at: '2026-08-17T12:00:00Z',
    updated_at: '2026-08-17T12:00:01Z',
    terminal_at: null,
    retry_allowed: true,
    cancel_allowed: true,
    last_recovery_operation_id: null,
  }
  let destinations: (typeof destination)[] = []
  let deliveries: (typeof delivery)[] = []
  const recoveryOperation = {
    id: '00000000-0000-4000-8000-000000000013',
    project_id: project.id,
    command_type: 'retry',
    target_delivery_id: delivery.id as string | null,
    actor_kind: 'api_credential',
    actor_id: '00000000-0000-4000-8000-000000000014',
    request_id: 'recovery-request',
    outcome: 'completed',
    selected_count: 1,
    retried_count: 1,
    cancelled_count: 0,
    skipped_count: 0,
    remaining_count: 0,
    created_at: '2026-08-17T13:00:00Z',
    completed_at: '2026-08-17T13:00:01Z',
  }
  let recoveries: (typeof recoveryOperation)[] = []
  await page.route('**/api/v1/**', async (route) => {
    const url = new URL(route.request().url())
    const path = url.pathname
    if (path === '/api/v1/build-info')
      return json(route, {
        service_version: '0.1.0',
        git_commit: 'abcdef',
        api_version: 'v1',
        required_database_migration: 7,
      })
    if (!route.request().headers().authorization)
      return json(
        route,
        { error: 'unauthorized', message: 'Credential required', request_id: 'auth-id' },
        401,
        'auth-id',
      )
    if (path === '/api/v1/organization') return json(route, organization)
    if (path === '/api/v1/projects') return json(route, { items: [project], next_cursor: null })
    if (path === `/api/v1/projects/${project.id}`) return json(route, project)
    if (path === `/api/v1/projects/${project.id}/notification-health`)
      return json(route, {
        state: 'idle',
        delivery_enabled: true,
        enabled_destination_count: destinations.length,
        pending_count: 0,
        due_count: 0,
        retrying_count: 0,
        in_flight_count: 0,
        expired_lease_count: 0,
        failed_count: 0,
        oldest_due_age_seconds: null,
        observed_at: '2026-08-17T20:00:00Z',
      })
    const destinationBase = `/api/v1/projects/${project.id}/webhook-destinations`
    if (path === destinationBase && route.request().method() === 'GET')
      return json(route, destinations)
    if (path === destinationBase && route.request().method() === 'POST') {
      destinations = [destination]
      return json(route, { ...destination, secret: 'one-time-signing-secret' }, 201)
    }
    if (path === `${destinationBase}/${destination.id}` && route.request().method() === 'GET')
      return json(route, destinations[0] ?? destination)
    if (path === `${destinationBase}/${destination.id}` && route.request().method() === 'PATCH')
      return json(route, {
        ...destination,
        ...(route.request().postDataJSON() as object),
        revision: 2,
      })
    if (path === `${destinationBase}/${destination.id}/test`) {
      deliveries = [delivery]
      return json(route, delivery)
    }
    if (path === `${destinationBase}/${destination.id}/rotate-secret`)
      return json(route, { ...destination, secret: 'rotated-one-time-secret' })
    if (path === `${destinationBase}/${destination.id}/disable`) {
      destinations = [{ ...destination, enabled: false, disabled_at: '2026-08-17T13:00:00Z' }]
      return json(route, destinations[0])
    }
    const deliveryBase = `/api/v1/projects/${project.id}/notification-deliveries`
    if (path === deliveryBase) return json(route, { items: deliveries, next_cursor: null })
    if (path === `${deliveryBase}/bulk-retry`) {
      recoveries = [
        {
          ...recoveryOperation,
          command_type: 'bulk_retry',
          target_delivery_id: null as string | null,
        },
      ]
      return json(route, {
        operation_id: recoveryOperation.id,
        selected_count: 1,
        retried_count: 1,
        skipped_count: 0,
        remaining_count: 0,
        has_more: false,
        replayed: false,
        completed_at: recoveryOperation.completed_at,
      })
    }
    if (path === `${deliveryBase}/${delivery.id}/retry`) {
      recoveries = [recoveryOperation]
      return json(route, {
        operation_id: recoveryOperation.id,
        delivery_id: delivery.id,
        status: 'pending',
        recovery_generation: 1,
        current_attempt_count: 0,
        total_attempt_count: 1,
        replayed: false,
        completed_at: recoveryOperation.completed_at,
      })
    }
    if (path === `${deliveryBase}/${delivery.id}/cancel`) {
      recoveries = [
        { ...recoveryOperation, command_type: 'cancel', retried_count: 0, cancelled_count: 1 },
      ]
      return json(route, {
        operation_id: recoveryOperation.id,
        delivery_id: delivery.id,
        status: 'cancelled',
        recovery_generation: 0,
        current_attempt_count: 1,
        total_attempt_count: 1,
        replayed: false,
        completed_at: recoveryOperation.completed_at,
      })
    }
    if (path === `${deliveryBase}/${delivery.id}`)
      return json(route, {
        ...delivery,
        attempts: [
          {
            id: '00000000-0000-4000-8000-000000000012',
            recovery_generation: 0,
            attempt_number: 1,
            started_at: '2026-08-17T12:00:00Z',
            finished_at: '2026-08-17T12:00:01Z',
            duration_ms: 1000,
            outcome: 'retry',
            http_status: 503,
            error_class: null,
            response_excerpt: 'must not render',
          },
        ],
      })
    const recoveryBase = `/api/v1/projects/${project.id}/notification-recovery-operations`
    if (path === recoveryBase) return json(route, { items: recoveries, next_cursor: null })
    if (path === `${recoveryBase}/${recoveryOperation.id}`)
      return json(route, {
        ...(recoveries[0] ?? recoveryOperation),
        affected_deliveries: [
          {
            delivery_id: delivery.id,
            recovery_generation: 1,
            action: 'retried',
            created_at: recoveryOperation.completed_at,
          },
        ],
      })
    if (path === `/api/v1/projects/${project.id}/applications`)
      return json(route, { items: [application], next_cursor: null })
    if (path === `/api/v1/projects/${project.id}/applications/${application.id}`)
      return json(route, application)
    if (path === '/api/v1/runtime-groups')
      return json(route, { items: [{ ...group, status: groupStatus }], next_cursor: null })
    if (path === `/api/v1/runtime-groups/${group.id}/occurrences`)
      return json(route, { items: [occurrence], next_cursor: null })
    const action = path.match(
      new RegExp(`/api/v1/runtime-groups/${group.id}/(acknowledge|resolve|reopen)$`),
    )?.[1]
    if (action && route.request().method() === 'POST') {
      groupStatus =
        action === 'acknowledge' ? 'acknowledged' : action === 'resolve' ? 'resolved' : 'open'
      return json(route, {
        ...group,
        status: groupStatus,
        status_changed_at: '2026-08-17T13:00:00Z',
      })
    }
    if (path === `/api/v1/runtime-groups/${group.id}`)
      return json(route, {
        ...group,
        status: groupStatus,
        representative_event: occurrence,
        notification: { state: 'pending', delivery_count: 0, succeeded_count: 0, failed_count: 0 },
      })
    if (path === `/api/v1/projects/${project.id}/applications/${application.id}/releases`)
      return json(route, { items: releases, next_cursor: null })
    if (
      path ===
      `/api/v1/projects/${project.id}/applications/${application.id}/releases/${targetRelease.id}/runtime-diff`
    )
      return json(route, {
        baseline: baselineRelease,
        target: targetRelease,
        items: [
          {
            group_id: group.id,
            classification: 'new',
            event_kind: group.event_kind,
            semantic_summary: group.semantic_summary,
            baseline_occurrence_count: 0,
            baseline_first_seen_at: null,
            baseline_last_seen_at: null,
            target_occurrence_count: 12,
            target_first_seen_at: group.first_seen_at,
            target_last_seen_at: group.last_seen_at,
          },
        ],
        next_cursor: null,
      })
    return json(
      route,
      { error: 'not_found', message: 'resource not found', request_id: 'missing-id' },
      404,
      'missing-id',
    )
  })
  return {
    organization,
    project,
    application,
    group,
    releases,
    destination,
    delivery,
    recoveryOperation,
  }
}

export async function authenticate(page: Page) {
  await page.getByLabel('Bearer credential').fill('e2e-secret')
  await page.getByRole('button', { name: 'Start session' }).click()
}
