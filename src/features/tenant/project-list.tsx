import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { projectsOptions } from '../../shared/api/queries'
import { useApi } from '../../shared/api/context'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { Loading } from '../../shared/ui/loading'
import { formatCount } from './format'

export function ProjectList() {
  const query = useInfiniteQuery(projectsOptions(useApi()))
  const refreshError = query.error
  const hasData = Boolean(query.data)
  if (query.isPending) return <Loading label="Loading projects…" />
  if (query.isError && !hasData)
    return (
      <ErrorState
        title="Projects could not be loaded"
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )
  if (!query.data) return <Loading label="Loading projects…" />
  const projects = query.data.pages
    .flatMap((page) => page.items)
    .filter((project, index, all) => all.findIndex((item) => item.id === project.id) === index)
  if (!projects.length)
    return (
      <Card>
        <h2 className="text-xl font-semibold">No projects yet</h2>
        <p className="mt-2 text-slate-400">This Organization has no Projects.</p>
      </Card>
    )
  return (
    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>
      <div className="grid gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            <Card className="transition hover:border-cyan-800">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="mt-1 font-mono text-sm text-slate-500">{project.slug}</p>
                </div>
                {project.archived_at && (
                  <span className="rounded-full bg-amber-950 px-3 py-1 text-xs text-amber-200">
                    Archived
                  </span>
                )}
              </div>
              <dl className="mt-5 flex gap-8 text-sm">
                <div>
                  <dt className="text-slate-500">Applications</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatCount(project.application_count)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Runtime groups</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {formatCount(project.runtime_group_count)}
                  </dd>
                </div>
              </dl>
            </Card>
          </Link>
        ))}
      </div>
      {query.hasNextPage && (
        <Button
          className="mt-5"
          variant="outline"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load more projects'}
        </Button>
      )}
      {refreshError && hasData && (
        <div className="mt-4">
          <ErrorState title="Projects could not be refreshed" error={refreshError} />
        </div>
      )}
    </section>
  )
}
