import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { organizationOptions } from '../shared/api/queries'
import { useApi } from '../shared/api/context'
import { Card } from '../shared/ui/card'
import { ErrorState } from '../shared/ui/error-state'
import { Loading } from '../shared/ui/loading'

export const Route = createFileRoute('/')({ component: OrganizationHome })

function OrganizationHome() {
  useEffect(() => {
    document.title = 'Organization · Okoscope'
  }, [])
  const query = useQuery(organizationOptions(useApi()))
  if (query.isPending) return <Loading label="Loading Organization…" />
  if (query.isError)
    return (
      <ErrorState
        title="Organization could not be loaded"
        error={query.error}
        onRetry={() => void query.refetch()}
      />
    )
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Organization</p>
        <h1 className="mt-2 text-4xl font-semibold">{query.data.name}</h1>
        <p className="mt-2 font-mono text-sm text-slate-500">{query.data.slug}</p>
      </div>
      <Card>
        <h2 className="text-xl font-semibold">Explore your environment</h2>
        <p className="mt-2 text-slate-400">Browse Projects and their Applications.</p>
        <Link
          className="mt-5 inline-flex rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          to="/projects"
        >
          View projects
        </Link>
      </Card>
    </div>
  )
}
