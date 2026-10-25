import { cn } from '@shared/utils'

export interface RadioOptionProps {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
  compact?: boolean
}

export function RadioOption({ name, value, label, checked, onChange, compact }: RadioOptionProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm transition-colors',
        compact ? 'py-2.5' : 'py-3.5',
        checked ? 'border-[1.5px] border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      )}
    >
      <input type="radio" className="sr-only" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span
        aria-hidden
        className={cn(
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px]',
          checked ? 'border-slate-900' : 'border-slate-300',
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-slate-900" />}
      </span>
      <span className="flex-1">{label}</span>
    </label>
  )
}
