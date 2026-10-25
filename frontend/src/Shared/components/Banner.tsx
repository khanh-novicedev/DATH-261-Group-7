import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@shared/utils'

export type BannerTone = 'info' | 'warning' | 'danger' | 'success'

const tones: Record<BannerTone, string> = {
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-800',
}

export function Banner({ tone = 'info', icon: Icon, children, action, className }: { tone?: BannerTone; icon?: LucideIcon; children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div role="status" className={cn('flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm', tones[tone], className)}>
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <div className="flex-1">{children}</div>
      {action}
    </div>
  )
}
