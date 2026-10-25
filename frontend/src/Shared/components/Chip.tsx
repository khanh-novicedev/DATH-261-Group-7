import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@shared/utils'

export function Chip({ selected, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
        selected ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
        className,
      )}
      {...props}
    />
  )
}
