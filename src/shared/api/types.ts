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
export type Release = components['schemas']['Release']
export type ReleasePage = components['schemas']['ReleasePage']
export type RuntimeDiff = components['schemas']['RuntimeDiff']
export type RuntimeDiffEntry = components['schemas']['RuntimeDiffEntry']
export type RuntimeGroupQuery = operations['listRuntimeGroups']['parameters']['query']
export type ReleaseQuery = NonNullable<operations['listReleases']['parameters']['query']>
export type RuntimeDiffQuery = NonNullable<operations['getRuntimeDiff']['parameters']['query']>

// Compile-time contract fixtures for the OpenAPI shapes used by the MVP.
export const contractFixture = {
  buildInfo: {
    service_version: '0.1.0',
    git_commit: 'unknown',
    api_version: 'v1',
    required_database_migration: 5,
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
    status: 'open',
    namespace: 'default',
    workload_kind: 'Deployment',
    workload_name: 'api',
    since: '2026-08-17T00:00:00Z',
    cursor: 'cursor',
    limit: 50,
  } satisfies RuntimeGroupQuery,
  releaseQuery: { cursor: 'cursor', limit: 50 } satisfies ReleaseQuery,
  runtimeDiffQuery: {
    baseline_id: 'baseline',
    cursor: 'cursor',
    limit: 50,
  } satisfies RuntimeDiffQuery,
  dynamicJson: { nested: true } satisfies RuntimeGroup['semantic_summary'],
}
