import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import type { ApiClient } from './client'
import type {
  Application,
  ApplicationPage,
  BuildInfo,
  Organization,
  Project,
  ProjectPage,
} from './types'

const withCursor = (path: string, cursor: string | null) =>
  `${path}?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`

export const queryKeys = {
  buildInfo: ['build-info'] as const,
  organization: ['organization'] as const,
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  applications: (projectId: string) => ['projects', projectId, 'applications'] as const,
  application: (projectId: string, applicationId: string) =>
    ['projects', projectId, 'applications', applicationId] as const,
}

export const buildInfoOptions = (api: ApiClient) =>
  queryOptions({
    queryKey: queryKeys.buildInfo,
    queryFn: () => api.get<BuildInfo>('/api/v1/build-info'),
    staleTime: 30_000,
    retry: false,
  })
export const organizationOptions = (api: ApiClient) =>
  queryOptions({
    queryKey: queryKeys.organization,
    queryFn: () => api.get<Organization>('/api/v1/organization', { protected: true }),
  })
export const projectOptions = (api: ApiClient, id: string) =>
  queryOptions({
    queryKey: queryKeys.project(id),
    queryFn: () =>
      api.get<Project>(`/api/v1/projects/${encodeURIComponent(id)}`, { protected: true }),
  })
export const applicationOptions = (api: ApiClient, projectId: string, applicationId: string) =>
  queryOptions({
    queryKey: queryKeys.application(projectId, applicationId),
    queryFn: () =>
      api.get<Application>(
        `/api/v1/projects/${encodeURIComponent(projectId)}/applications/${encodeURIComponent(applicationId)}`,
        { protected: true },
      ),
  })
export const projectsOptions = (api: ApiClient) =>
  infiniteQueryOptions({
    queryKey: queryKeys.projects,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      api.get<ProjectPage>(withCursor('/api/v1/projects', pageParam), { protected: true }),
    getNextPageParam: (page) => page.next_cursor ?? undefined,
  })
export const applicationsOptions = (api: ApiClient, projectId: string) =>
  infiniteQueryOptions({
    queryKey: queryKeys.applications(projectId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      api.get<ApplicationPage>(
        withCursor(`/api/v1/projects/${encodeURIComponent(projectId)}/applications`, pageParam),
        { protected: true },
      ),
    getNextPageParam: (page) => page.next_cursor ?? undefined,
  })
