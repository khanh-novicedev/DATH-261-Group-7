import { Star } from 'lucide-react'
import { cn } from '@shared/utils'

const LABELS = ['', 'Poor', 'Fair', 'Okay', 'Good', 'Great']

export function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} stars`} onClick={() => onChange(n)}>
          <Star className={cn('h-7 w-7', n <= value ? 'fill-amber-400 text-amber-500' : 'text-slate-300')} strokeWidth={1.5} />
        </button>
      ))}
      {value > 0 && (
        <span className="text-sm font-medium text-slate-700">
          {value}/5 · {LABELS[value]}
        </span>
      )}
    </div>
  )
}
