import type { components, operations } from './schema'

export type BuildInfo = components['schemas']['BuildInfo']
export type Organization = components['schemas']['Organization']
export type Project = components['schemas']['Project']
export type ProjectPage = components['schemas']['ProjectPage']
export type Application = components['schemas']['Application']
export type ApplicationPage = components['schemas']['ApplicationPage']
export type ErrorEnvelope = components['schemas']['Error']
export type RuntimeGroup = components['schemas']['RuntimeGroup']
export type RuntimeGroupPage = components['schemas']['RuntimeGroupPage']
export type RuntimeGroupDetail = components['schemas']['RuntimeGroupDetail']
export type EventOccurrence = components['schemas']['EventOccurrence']
export type NetworkConnectSemanticSummary = components['schemas']['NetworkConnectSemanticSummary']
export type NetworkDnsQuerySemanticSummary = components['schemas']['NetworkDnsQuerySemanticSummary']
export type NetworkDnsResponseSemanticSummary =
  components['schemas']['NetworkDnsResponseSemanticSummary']
export type NetworkConnectPayload = components['schemas']['NetworkConnectPayload']
export type NetworkDnsQueryPayload = components['schemas']['NetworkDnsQueryPayload']
export type NetworkDnsResponsePayload = components['schemas']['NetworkDnsResponsePayload']
export type DnsContext = components['schemas']['DnsContext']
export type OccurrencePage = components['schemas']['OccurrencePage']
export type FirstSeenNotificationSummary = components['schemas']['FirstSeenNotificationSummary']
export type Release = components['schemas']['Release']
export type ReleasePage = components['schemas']['ReleasePage']
export type RuntimeDiff = components['schemas']['RuntimeDiff']
export type RuntimeDiffEntry = components['schemas']['RuntimeDiffEntry']
export type InventoryKind = components['schemas']['InventoryKind']
export type InventoryFacet = components['schemas']['InventoryFacet']
export type InventoryItem = components['schemas']['InventoryItem']
export type InventoryItemPage = components['schemas']['InventoryItemPage']
export type InventorySummary = components['schemas']['InventorySummary']
export type InventoryFacetPage = components['schemas']['InventoryFacetPage']
export type InventoryItemDetail = components['schemas']['InventoryItemDetail']
export type InventoryReleaseEvidence = components['schemas']['InventoryReleaseEvidence']
export type InventoryReleasePresencePage = components['schemas']['InventoryReleasePresencePage']
export type InventorySighting = components['schemas']['InventorySighting']
export type InventorySightingPage = components['schemas']['InventorySightingPage']
export type InventoryGroup = components['schemas']['InventoryGroup']
export type InventoryGroupPage = components['schemas']['InventoryGroupPage']
export type InventoryOccurrence = components['schemas']['InventoryOccurrence']
export type InventoryOccurrencePage = components['schemas']['InventoryOccurrencePage']
export type InventoryListQuery = NonNullable<
  operations['listApplicationRuntimeInventory']['parameters']['query']
>
export type InventorySummaryQuery = NonNullable<
  operations['getApplicationRuntimeInventorySummary']['parameters']['query']
>
export type InventoryFacetQuery = NonNullable<
  operations['listApplicationRuntimeInventoryFacetOptions']['parameters']['query']
>
export type InventoryEvidenceQuery = NonNullable<
  operations['listApplicationRuntimeInventoryItemOccurrences']['parameters']['query']
>
export type RuntimeGroupQuery = operations['listRuntimeGroups']['parameters']['query']
export type RuntimeGroupOccurrenceQuery = NonNullable<
  operations['listRuntimeGroupOccurrences']['parameters']['query']
>
export type AcknowledgeRuntimeGroupResponse =
  operations['acknowledgeRuntimeGroup']['responses'][200]['content']['application/json']
export type ResolveRuntimeGroupResponse =
  operations['resolveRuntimeGroup']['responses'][200]['content']['application/json']
export type ReopenRuntimeGroupResponse =
  operations['reopenRuntimeGroup']['responses'][200]['content']['application/json']
export type ReleaseQuery = NonNullable<operations['listReleases']['parameters']['query']>
export type RuntimeDiffQuery = NonNullable<operations['getRuntimeDiff']['parameters']['query']>
export type WebhookDestination = components['schemas']['WebhookDestination']
export type DestinationWithSecret = components['schemas']['DestinationWithSecret']
export type CreateWebhookDestination = components['schemas']['CreateWebhookDestination']
export type UpdateWebhookDestination = components['schemas']['UpdateWebhookDestination']
export type DeliverySummary = components['schemas']['DeliverySummary']
export type DeliveryPage = components['schemas']['DeliveryPage']
export type DeliveryAttempt = components['schemas']['DeliveryAttempt']
export type DeliveryDetail = components['schemas']['DeliveryDetail']
export type NotificationHealth = components['schemas']['NotificationHealth']
export type BulkRetryFilter = components['schemas']['BulkRetryFilter']
export type DeliveryRecoveryResult = components['schemas']['DeliveryRecoveryResult']
export type BulkRecoveryResult = components['schemas']['BulkRecoveryResult']
export type RecoveryCommandType = components['schemas']['RecoveryCommandType']
export type RecoveryOperationSummary = components['schemas']['RecoveryOperationSummary']
export type RecoveryOperationPage = components['schemas']['RecoveryOperationPage']
export type RecoveryOperationDetail = components['schemas']['RecoveryOperationDetail']
export type RecoveryOperationQuery = NonNullable<
  operations['listNotificationRecoveryOperations']['parameters']['query']
>
export type DeliveryQuery = NonNullable<
  operations['listNotificationDeliveries']['parameters']['query']
>

// Compile-time contract fixtures for the OpenAPI shapes used by the MVP.
export const contractFixture = {
  buildInfo: {
    service_version: '0.1.0',
    git_commit: 'unknown',
    api_version: 'v1',
    required_database_migration: 7,
  } satisfies BuildInfo,
  nullableProjectArchive: null satisfies Project['archived_at'],
  nullableApplicationObservation: null satisfies Application['latest_observed_at'],
  error: {
    error: 'not_found',
    message: 'resource not found',
    request_id: 'fixture',
  } satisfies ErrorEnvelope,
  runtimeGroupQuery: {
    project_id: 'project',
    application_id: 'application',
    event_kind: 'exec',
    status: 'acknowledged',
    namespace: 'default',
    workload_kind: 'Deployment',
    workload_name: 'api',
    since: '2026-08-17T00:00:00Z',
    first_seen_from: '2026-08-16T00:00:00Z',
    first_seen_to: '2026-08-17T00:00:00Z',
    last_seen_to: '2026-08-17T12:00:00Z',
    release_id: 'release',
    cursor: 'cursor',
    limit: 50,
  } satisfies RuntimeGroupQuery,
  runtimeGroupOccurrenceQuery: {
    cursor: 'cursor',
    limit: 25,
  } satisfies RuntimeGroupOccurrenceQuery,
  releaseQuery: { cursor: 'cursor', limit: 50 } satisfies ReleaseQuery,
  runtimeDiffQuery: {
    baseline_id: 'baseline',
    cursor: 'cursor',
    limit: 50,
  } satisfies RuntimeDiffQuery,
  networkSemanticSummary: {
    process_command: 'curl',
    address_family: 'ipv4',
    destination_address: '203.0.113.7',
    destination_port: 443,
  } satisfies NetworkConnectSemanticSummary,
  networkOccurrencePayload: {
    type: 'NetworkConnect',
    data: {
      address_family: 'ipv6',
      destination_address: '2001:db8::7',
      destination_port: 443,
      outcome: 'in_progress',
      errno: 115,
    },
  } satisfies NetworkConnectPayload,
  dnsQueryPayload: {
    type: 'NetworkDnsQuery',
    data: {
      transaction_id: 42,
      direction: 'egress',
      transport: 'udp',
      resolver_address: '10.96.0.10',
      name: 'api.example.com',
      query_type: 'A',
    },
  } satisfies NetworkDnsQueryPayload,
  dnsResponsePayload: {
    type: 'NetworkDnsResponse',
    data: {
      transaction_id: 42,
      direction: 'ingress',
      transport: 'udp',
      resolver_address: '10.96.0.10',
      name: 'api.example.com',
      query_type: 'A',
      response_code: 'no_error',
      truncated: false,
      answers: [{ name: 'api.example.com', address: '203.0.113.7', ttl_seconds: 60 }],
      cname_chain: [],
      effective_ttl_seconds: 60,
    },
  } satisfies NetworkDnsResponsePayload,
  ambiguousDnsContext: {
    names: ['api.example.com', 'cdn.example.com'],
    observed_at: '2026-08-18T10:00:00Z',
    expires_at: '2026-08-18T10:01:00Z',
    confidence: 'observed_recently',
    ambiguous: true,
  } satisfies DnsContext,
  inventoryListQuery: {
    kind: 'process',
    release_id: 'release',
    cluster_id: 'cluster',
    namespace: 'production',
    workload_kind: 'Deployment',
    workload_name: 'payments',
    container_name: 'payments',
    observed_from: '2026-08-17T00:00:00Z',
    observed_to: '2026-08-18T00:00:00Z',
    search: 'pay',
    cursor: 'opaque',
    limit: 50,
  } satisfies InventoryListQuery,
  inventorySummary: {
    identity_version: 1,
    item_count: 1,
    occurrence_count: 12,
    first_seen_at: '2026-08-17T00:00:00Z',
    last_seen_at: '2026-08-18T00:00:00Z',
    kinds: [{ kind: 'process', item_count: 1, occurrence_count: 12 }],
  } satisfies InventorySummary,
  inventoryFacetPage: {
    items: [{ value: 'production', label: 'production', item_count: 1, occurrence_count: 12 }],
    next_cursor: null,
  } satisfies InventoryFacetPage,
  inventoryItemDetail: {
    id: '10000000-0000-4000-8000-000000000001',
    project_id: '20000000-0000-4000-8000-000000000001',
    application_id: '30000000-0000-4000-8000-000000000001',
    inventory_kind: 'process',
    identity_version: 1,
    semantic_summary: { executable: '/app/payments' },
    first_seen_at: '2026-08-17T00:00:00Z',
    last_seen_at: '2026-08-18T00:00:00Z',
    occurrence_count: 12,
    release_count: 2,
    cluster_count: 1,
    namespace_count: 1,
    workload_count: 1,
    pod_count: 2,
    container_count: 1,
    group_count: 1,
    evidence: {
      releases: '/releases',
      sightings: '/sightings',
      groups: '/groups',
      occurrences: '/occurrences',
    },
  } satisfies InventoryItemDetail,
  inventoryReleasePage: {
    items: [
      {
        release_id: '40000000-0000-4000-8000-000000000001',
        version: '2.14.0',
        deployed_at: '2026-08-18T00:00:00Z',
        presence: 'observed',
        occurrence_count: 8,
        first_seen_at: '2026-08-18T00:00:00Z',
        last_seen_at: '2026-08-18T01:00:00Z',
        release_evidence_count: 55,
      },
    ],
    next_cursor: null,
  } satisfies InventoryReleasePresencePage,
  inventorySightingPage: {
    items: [
      {
        cluster_id: '50000000-0000-4000-8000-000000000001',
        namespace: 'production',
        workload_kind: 'Deployment',
        workload_name: 'payments',
        pod_uid: 'pod-uid',
        pod_name: 'payments-1',
        container_name: 'payments',
        occurrence_count: 8,
        first_seen_at: '2026-08-18T00:00:00Z',
        last_seen_at: '2026-08-18T01:00:00Z',
      },
    ],
    next_cursor: null,
  } satisfies InventorySightingPage,
  inventoryGroupPage: {
    items: [
      {
        id: '60000000-0000-4000-8000-000000000001',
        cluster_id: '50000000-0000-4000-8000-000000000001',
        namespace: 'production',
        workload_kind: 'Deployment',
        workload_name: 'payments',
        event_kind: 'exec',
        status: 'open',
        first_seen_at: '2026-08-18T00:00:00Z',
        last_seen_at: '2026-08-18T01:00:00Z',
        occurrence_count: 8,
      },
    ],
    next_cursor: null,
  } satisfies InventoryGroupPage,
  inventoryOccurrencePage: {
    items: [
      {
        id: '70000000-0000-4000-8000-000000000001',
        event_id: '70000000-0000-4000-8000-000000000002',
        observed_at: '2026-08-18T00:00:00Z',
        cluster_id: '50000000-0000-4000-8000-000000000001',
        node_name: 'node-1',
        namespace: 'production',
        pod_uid: 'pod-uid',
        pod_name: 'payments-1',
        container_name: 'payments',
        process_command: '/app/payments',
        event_kind: 'exec',
        payload: {
          type: 'ProcessExec',
          data: { executable: '/app/payments', parent_command: null },
        },
        release_id: null,
        release_version: null,
      },
    ],
    next_cursor: null,
  } satisfies InventoryOccurrencePage,
  deliveryQuery: { cursor: 'cursor', limit: 50 } satisfies DeliveryQuery,
}
