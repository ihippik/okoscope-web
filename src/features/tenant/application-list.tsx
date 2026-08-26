import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { applicationsOptions, queryKeys } from '../../shared/api/queries'
import { useApi } from '../../shared/api/context'
import { createApplication } from '../../shared/api/provisioning'
import type { CreatedApplication } from '../../shared/api/types'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { Loading } from '../../shared/ui/loading'
import { formatCount, formatTimestamp } from './format'
import { NamedResourceForm } from '../provisioning/entity-form'
import { ConnectAgent } from '../provisioning/connect-agent'
import { useT } from '../../shared/i18n'

export function ApplicationList({ projectId }: { projectId: string }) {
  const api = useApi()
  const t = useT()
  const queryClient = useQueryClient()
  const [created, setCreated] = useState<CreatedApplication | null>(null)
  const query = useInfiniteQuery(applicationsOptions(api, projectId))
  const create = useMutation({
    retry: false,
    mutationFn: (body: { name: string; slug: string }) => createApplication(api, projectId, body),
    onSuccess: (result) => {
      setCreated(result)
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications(projectId) })
    },
  })
  if (query.isPending) return <Loading label="Loading applications…" />
  if (query.isError)
    return (
      <ErrorState
        title="Applications could not be loaded"
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )
  const applications = query.data.pages
    .flatMap((page) => page.items)
    .filter(
      (application, index, all) => all.findIndex((item) => item.id === application.id) === index,
    )
  if (created)
    return (
      <ConnectAgent
        application={created.application}
        credential={created.credential}
        onClose={() => setCreated(null)}
      />
    )
  return (
    <section aria-labelledby="applications-heading">
      <h2 id="applications-heading" className="mb-4 text-2xl font-semibold">
        Applications
      </h2>
      <Card className="mb-5">
        <h3 className="text-xl font-semibold">{t('createApplicationTitle')}</h3>
        <p className="mt-2 text-slate-400">{t('createApplicationHelp')}</p>
        <NamedResourceForm
          label="Application"
          pending={create.isPending}
          error={create.error}
          onSubmit={create.mutate}
        />
      </Card>
      {!applications.length ? (
        <Card>
          <h2 className="text-xl font-semibold">No applications yet</h2>
          <p className="mt-2 text-slate-400">This Project has no Applications.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {applications.map((application) => (
            <Link
              key={application.id}
              to="/projects/$projectId/applications/$applicationId"
              params={{ projectId, applicationId: application.id }}
              className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <Card className="h-full transition hover:border-cyan-800">
                <h3 className="text-lg font-semibold">{application.name}</h3>
                <p className="font-mono text-sm text-slate-500">{application.slug}</p>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-slate-500">Releases</dt>
                    <dd>{formatCount(application.release_count)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Runtime groups</dt>
                    <dd>{formatCount(application.runtime_group_count)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-slate-500">Latest observation</dt>
                    <dd>{formatTimestamp(application.latest_observed_at)}</dd>
                  </div>
                </dl>
              </Card>
            </Link>
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
          {query.isFetchingNextPage ? 'Loading…' : 'Load more applications'}
        </Button>
      )}
    </section>
  )
}
