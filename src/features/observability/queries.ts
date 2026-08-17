import { queryOptions } from '@tanstack/react-query'
import type { ApiClient } from '../../shared/api/client'
import type {
  ReleasePage,
  RuntimeDiff,
  RuntimeGroupDetail,
  RuntimeGroupPage,
} from '../../shared/api/types'
import type { ReleaseSearch, RuntimeDiffSearch, RuntimeGroupSearch } from './url-state'

const params = (input: Record<string, string | number | undefined>) => {
  const value = new URLSearchParams()
  Object.entries(input).forEach(([key, item]) => {
    if (item !== undefined) value.set(key, String(item))
  })
  const suffix = value.toString()
  return suffix ? `?${suffix}` : ''
}
const normalized = <T extends object>(value: T) =>
  Object.fromEntries(
    Object.entries(value)
      .sort()
      .filter(([, v]) => v !== undefined),
  )

export const observabilityKeys = {
  runtimeGroups: (projectId: string, applicationId: string, search: RuntimeGroupSearch) =>
    ['runtime-groups', projectId, applicationId, normalized(search)] as const,
  runtimeGroup: (projectId: string, applicationId: string, groupId: string) =>
    ['runtime-group', projectId, applicationId, groupId] as const,
  releases: (projectId: string, applicationId: string, search: ReleaseSearch) =>
    ['releases', projectId, applicationId, normalized(search)] as const,
  runtimeDiff: (
    projectId: string,
    applicationId: string,
    targetReleaseId: string,
    search: RuntimeDiffSearch,
  ) =>
    [
      'runtime-diff',
      projectId,
      applicationId,
      targetReleaseId,
      search.baseline ?? null,
      search.cursor ?? null,
    ] as const,
}
export const runtimeGroupsOptions = (
  api: ApiClient,
  projectId: string,
  applicationId: string,
  search: RuntimeGroupSearch,
) =>
  queryOptions({
    queryKey: observabilityKeys.runtimeGroups(projectId, applicationId, search),
    queryFn: () =>
      api.get<RuntimeGroupPage>(
        `/api/v1/runtime-groups${params({ project_id: projectId, application_id: applicationId, ...search, limit: 50 })}`,
        { protected: true },
      ),
  })
export const runtimeGroupOptions = (
  api: ApiClient,
  projectId: string,
  applicationId: string,
  groupId: string,
) =>
  queryOptions({
    queryKey: observabilityKeys.runtimeGroup(projectId, applicationId, groupId),
    queryFn: () =>
      api.get<RuntimeGroupDetail>(`/api/v1/runtime-groups/${encodeURIComponent(groupId)}`, {
        protected: true,
      }),
  })
export const releasesOptions = (
  api: ApiClient,
  projectId: string,
  applicationId: string,
  search: ReleaseSearch,
) =>
  queryOptions({
    queryKey: observabilityKeys.releases(projectId, applicationId, search),
    queryFn: () =>
      api.get<ReleasePage>(
        `/api/v1/projects/${encodeURIComponent(projectId)}/applications/${encodeURIComponent(applicationId)}/releases${params({ ...search, limit: 50 })}`,
        { protected: true },
      ),
  })
export const runtimeDiffOptions = (
  api: ApiClient,
  projectId: string,
  applicationId: string,
  targetReleaseId: string,
  search: RuntimeDiffSearch,
) =>
  queryOptions({
    queryKey: observabilityKeys.runtimeDiff(projectId, applicationId, targetReleaseId, search),
    queryFn: () =>
      api.get<RuntimeDiff>(
        `/api/v1/projects/${encodeURIComponent(projectId)}/applications/${encodeURIComponent(applicationId)}/releases/${encodeURIComponent(targetReleaseId)}/runtime-diff${params({ baseline_id: search.baseline, cursor: search.cursor, limit: 50 })}`,
        { protected: true },
      ),
  })
