import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from './button'
import { useT } from '../i18n'

export function Modal({
  title,
  description,
  children,
  onClose,
  closeDisabled = false,
  showCloseButton = true,
}: {
  title: string
  description: string
  children: ReactNode
  onClose: () => void
  closeDisabled?: boolean
  showCloseButton?: boolean
}) {
  const t = useT()
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const focusable = dialog?.querySelector<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])',
    )
    focusable?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !closeDisabled) onClose()
      if (event.key !== 'Tab' || !dialog) return
      const items = [
        ...dialog.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((item) => !item.hasAttribute('disabled'))
      if (!items.length) return
      const first = items[0]!
      const last = items[items.length - 1]!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      previous?.focus()
    }
  }, [closeDisabled, onClose])
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4"
      role="presentation"
    >
      <div
        ref={dialogRef}
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
        {showCloseButton && (
          <Button className="mt-5" variant="ghost" onClick={onClose} disabled={closeDisabled}>
            {t('close')}
          </Button>
        )}
      </div>
    </div>
  )
}
