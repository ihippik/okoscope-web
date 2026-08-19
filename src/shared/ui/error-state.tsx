import { ApiClientError } from '../api/client'
import { Button } from './button'
import { Card } from './card'
import { useT } from '../i18n'

export function ErrorState({
  error,
  title,
  onRetry,
}: {
  error: unknown
  title?: string
  onRetry?: () => void
}) {
  const t = useT()
  const detail = error instanceof ApiClientError ? error.detail : null
  return (
    <Card role="alert" className="border-rose-900/70">
      <h2 className="text-lg font-semibold text-rose-200">{title ?? t('somethingWrong')}</h2>
      <p className="mt-2 text-sm text-slate-300">{detail?.message ?? t('unexpectedError')}</p>
      {detail?.kind === 'api' && (
        <p className="mt-2 text-xs text-slate-400">{t('errorCode', { code: detail.code })}</p>
      )}
      {detail?.requestId && (
        <p className="mt-3 font-mono text-xs text-slate-400">
          {t('requestId')}{' '}
          <button
            className="underline"
            onClick={() => void navigator.clipboard?.writeText(detail.requestId)}
          >
            {detail.requestId}
          </button>
        </p>
      )}
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          {t('tryAgain')}
        </Button>
      )}
    </Card>
  )
}
