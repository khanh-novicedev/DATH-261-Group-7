import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
}

export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-[440px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className="text-xl font-semibold text-slate-900">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        <div className="mt-4 space-y-4">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
