import { cn } from '@shared/utils'

export interface ProgressBarProps {
  value: number
  className?: string
  height?: number
}

export function ProgressBar({ value, className, height = 6 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden rounded-full bg-slate-200', className)}
      style={{ height }}
    >
      <div className="h-full rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
    </div>
  )
}
