import { ApiClientError } from '../api/client'
import { Button } from './button'
import { Card } from './card'

export function ErrorState({
  error,
  title = 'Something went wrong',
  onRetry,
}: {
  error: unknown
  title?: string
  onRetry?: () => void
}) {
  const detail = error instanceof ApiClientError ? error.detail : null
  return (
    <Card role="alert" className="border-rose-900/70">
      <h2 className="text-lg font-semibold text-rose-200">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">
        {detail?.message ?? 'An unexpected error occurred.'}
      </p>
      {detail?.requestId && (
        <p className="mt-3 font-mono text-xs text-slate-400">
          Request ID:{' '}
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
          Try again
        </Button>
      )}
    </Card>
  )
}
