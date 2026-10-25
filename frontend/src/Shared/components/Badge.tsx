import type { HTMLAttributes } from 'react'
import { cn } from '@shared/utils'

export type BadgeTone = 'neutral' | 'warning' | 'success' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-slate-200 text-slate-900',
  warning: 'bg-amber-100 text-amber-800',
  success: 'bg-green-100 text-green-700',
  danger: 'bg-red-50 text-red-600',
}

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium', tones[tone], className)}
      {...props}
    />
  )
}
