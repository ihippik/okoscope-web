import { useEffect, useState } from 'react'
import type { IssuedApplicationCredential, ProvisionedApplication } from '../../shared/api/types'
import { useT } from '../../shared/i18n'
import { Button } from '../../shared/ui/button'
import { Card } from '../../shared/ui/card'

export const kubernetesSecret = (slug: string, token: string) => `apiVersion: v1
kind: Secret
metadata:
  name: okoscope-application-credentials
  namespace: okoscope
type: Opaque
stringData:
  ${slug}: ${token}`

export const agentConfig = (slug: string, namespace: string) => `scope:
  workloads:
    - namespace: ${namespace}
      labels:
        app: ${slug}
      applicationCredentialFile: /var/run/secrets/okoscope/applications/${slug}`

async function copy(
  value: string,
  setAnnouncement: (value: string) => void,
  success: string,
  failure: string,
) {
  try {
    if (!navigator.clipboard) throw new Error('clipboard unavailable')
    await navigator.clipboard.writeText(value)
    setAnnouncement(success)
  } catch {
    setAnnouncement(failure)
  }
}

export function ConnectAgent({
  application,
  credential,
  onClose,
}: {
  application: ProvisionedApplication
  credential: IssuedApplicationCredential
  onClose: () => void
}) {
  const t = useT()
  const [namespace, setNamespace] = useState('default')
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => () => setAnnouncement(''), [])
  const secret = kubernetesSecret(application.slug, credential.token)
  const config = agentConfig(application.slug, namespace)
  return (
    <Card className="border-amber-700/70">
      <p className="eyebrow">{t('connectAgent')}</p>
      <h2 className="mt-2 text-2xl font-semibold">{application.name}</h2>
      <p role="alert" className="mt-3 font-semibold text-amber-200">
        {t('tokenShownOnce')}
      </p>
      <SecretBlock
        label={t('applicationToken')}
        value={credential.token}
        onCopy={() =>
          void copy(credential.token, setAnnouncement, t('tokenCopied'), t('copyFailed'))
        }
        button={t('copyToken')}
      />
      <SecretBlock
        label={t('kubernetesSecret')}
        value={secret}
        onCopy={() => void copy(secret, setAnnouncement, t('secretCopied'), t('copyFailed'))}
        button={t('copySecret')}
      />
      <label className="mt-5 block text-sm font-medium" htmlFor="workload-namespace">
        {t('workloadNamespace')}
      </label>
      <input
        id="workload-namespace"
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
        value={namespace}
        onChange={(event) => setNamespace(event.target.value)}
      />
      <SecretBlock
        label={t('agentConfig')}
        value={config}
        onCopy={() => void copy(config, setAnnouncement, t('configCopied'), t('copyFailed'))}
        button={t('copyAgentConfig')}
      />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <Button className="mt-6" variant="outline" onClick={onClose}>
        {t('done')}
      </Button>
    </Card>
  )
}

function SecretBlock({
  label,
  value,
  onCopy,
  button,
}: {
  label: string
  value: string
  onCopy: () => void
  button: string
}) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-medium">{label}</h3>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-sm text-cyan-200">
        {value}
      </pre>
      <Button className="mt-2" onClick={onCopy}>
        {button}
      </Button>
    </div>
  )
}
