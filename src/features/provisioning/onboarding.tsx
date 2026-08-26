import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type {
  Organization,
  ProvisionedApplication,
  ProvisionedProject,
  IssuedApplicationCredential,
} from '../../shared/api/types'
import { useApi } from '../../shared/api/context'
import {
  adminApplicationsOptions,
  adminOrganizationsOptions,
  adminProjectsOptions,
  createApplication,
  createOrganization,
  createProject,
  provisioningKeys,
} from '../../shared/api/provisioning'
import { useT } from '../../shared/i18n'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'
import { ErrorState } from '../../shared/ui/error-state'
import { Loading } from '../../shared/ui/loading'
import { ConnectAgent } from './connect-agent'
import { NamedResourceForm } from './entity-form'

type SecretState = { application: ProvisionedApplication; credential: IssuedApplicationCredential }

export function OnboardingWizard() {
  const api = useApi()
  const t = useT()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const organizations = useQuery(adminOrganizationsOptions(api))
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [project, setProject] = useState<ProvisionedProject | null>(null)
  const [secret, setSecret] = useState<SecretState | null>(null)
  const projects = useQuery(adminProjectsOptions(api, organization?.id ?? ''))
  const applications = useQuery(adminApplicationsOptions(api, project?.id ?? ''))

  const createOrganizationMutation = useMutation({
    retry: false,
    mutationFn: (body: { name: string; slug: string }) => createOrganization(api, body),
    onSuccess: (data) => {
      setOrganization(data)
      void queryClient.invalidateQueries({ queryKey: provisioningKeys.organizations })
    },
  })
  const createProjectMutation = useMutation({
    retry: false,
    mutationFn: (body: { name: string; slug: string }) =>
      createProject(api, organization!.id, body),
    onSuccess: (data) => {
      setProject(data)
      void queryClient.invalidateQueries({
        queryKey: provisioningKeys.projects(data.organization_id),
      })
    },
  })
  const createApplicationMutation = useMutation({
    retry: false,
    mutationFn: (body: { name: string; slug: string }) => createApplication(api, project!.id, body),
    onSuccess: (data) => {
      setSecret({ application: data.application, credential: data.credential })
      createApplicationMutation.reset()
      void queryClient.invalidateQueries({
        queryKey: provisioningKeys.applications(data.application.project_id),
      })
    },
  })

  if (secret)
    return (
      <ConnectAgent
        application={secret.application}
        credential={secret.credential}
        onClose={() => {
          const applicationId = secret.application.id
          const projectId = secret.application.project_id
          setSecret(null)
          void navigate({
            to: '/admin/projects/$projectId/applications/$applicationId',
            params: { projectId, applicationId },
          })
        }}
      />
    )
  if (organizations.isPending) return <Loading label={t('loadingOrganizations')} />
  if (organizations.isError)
    return (
      <ErrorState
        title={t('organizationsLoadFailed')}
        error={organizations.error}
        onRetry={() => void organizations.refetch()}
      />
    )

  return (
    <div className="space-y-6">
      <Card>
        <p className="eyebrow">{t('onboarding')}</p>
        <h1 className="mt-2 text-3xl font-semibold">{t('provisionOkoscope')}</h1>
        <p className="mt-3 text-slate-400">{t('adminCredentialNotice')}</p>
        <ol className="mt-5 grid gap-2 text-sm sm:grid-cols-4">
          {[t('organization'), t('projectLabel'), t('applicationLabel'), t('connectAgent')].map(
            (step, index) => (
              <li key={step} className="rounded-lg border border-slate-700 px-3 py-2">
                {index + 1}. {step}
              </li>
            ),
          )}
        </ol>
      </Card>
      {!organization ? (
        <SelectionStep
          title={t('organization')}
          items={organizations.data.items}
          onSelect={setOrganization}
          render={(item) => item.name}
        >
          <NamedResourceForm
            label={t('organization')}
            pending={createOrganizationMutation.isPending}
            error={createOrganizationMutation.error}
            onSubmit={createOrganizationMutation.mutate}
          />
        </SelectionStep>
      ) : !project ? (
        <>
          <Button variant="ghost" onClick={() => setOrganization(null)}>
            {t('back')}
          </Button>
          {projects.isPending ? (
            <Loading label={t('loadingProjects')} />
          ) : projects.isError ? (
            <ErrorState
              title={t('projectsLoadFailed')}
              error={projects.error}
              onRetry={() => void projects.refetch()}
            />
          ) : (
            <SelectionStep
              title={t('projectLabel')}
              items={projects.data.items}
              onSelect={setProject}
              render={(item) => item.name}
            >
              <NamedResourceForm
                label={t('projectLabel')}
                pending={createProjectMutation.isPending}
                error={createProjectMutation.error}
                onSubmit={createProjectMutation.mutate}
              />
            </SelectionStep>
          )}
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => setProject(null)}>
            {t('back')}
          </Button>
          {applications.isPending ? (
            <Loading label={t('loadingApplications')} />
          ) : applications.isError ? (
            <ErrorState
              title={t('applicationsLoadFailed')}
              error={applications.error}
              onRetry={() => void applications.refetch()}
            />
          ) : (
            <SelectionStep
              title={t('applicationLabel')}
              items={applications.data.items}
              onSelect={(item) =>
                void navigate({
                  to: '/admin/projects/$projectId/applications/$applicationId',
                  params: { projectId: item.project_id, applicationId: item.id },
                })
              }
              render={(item) => item.name}
            >
              <NamedResourceForm
                label={t('applicationLabel')}
                pending={createApplicationMutation.isPending}
                error={createApplicationMutation.error}
                onSubmit={createApplicationMutation.mutate}
              />
            </SelectionStep>
          )}
        </>
      )}
    </div>
  )
}

function SelectionStep<T extends { id: string; slug: string }>({
  title,
  items,
  onSelect,
  render,
  children,
}: {
  title: string
  items: T[]
  onSelect: (item: T) => void
  render: (item: T) => string
  children: React.ReactNode
}) {
  const t = useT()
  return (
    <Card>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {items.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-slate-400">{t('selectExisting')}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <Button key={item.id} variant="outline" onClick={() => onSelect(item)}>
                <span>{render(item)}</span>
                <span className="ml-2 font-mono text-xs text-slate-400">{item.slug}</span>
              </Button>
            ))}
          </div>
          <div className="my-5 border-t border-slate-700" />
        </div>
      )}
      <h3 className="text-lg font-semibold">{t('createNew', { entity: title })}</h3>
      {children}
    </Card>
  )
}
