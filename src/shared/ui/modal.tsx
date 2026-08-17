import type { ReactNode } from 'react'
import { Button } from './button'

export function Modal({
  title,
  description,
  children,
  onClose,
  closeDisabled = false,
}: {
  title: string
  description: string
  children: ReactNode
  onClose: () => void
  closeDisabled?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <h2 id="modal-title" className="text-xl font-semibold">
          {title}
        </h2>
        <p id="modal-description" className="mt-2 text-sm text-slate-300">
          {description}
        </p>
        <div className="mt-5">{children}</div>
        <Button className="mt-5" variant="ghost" onClick={onClose} disabled={closeDisabled}>
          Close
        </Button>
      </div>
    </div>
  )
}
