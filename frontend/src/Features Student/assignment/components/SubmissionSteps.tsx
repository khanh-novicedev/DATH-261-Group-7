import { cn } from '@shared/utils'
import type { SubmissionStatus } from '../types'

const steps: { status: SubmissionStatus; label: string; hint: string }[] = [
  { status: 'NOT_SUBMITTED', label: 'Not submitted', hint: 'Upload your file before the due date' },
  { status: 'SUBMITTED', label: 'Awaiting grading', hint: 'Cannot be edited after submitting' },
  { status: 'GRADED', label: 'Graded', hint: 'View score and feedback' },
]

export function SubmissionSteps({ status }: { status: SubmissionStatus }) {
  const currentIndex = steps.findIndex((s) => s.status === status)
  return (
    <ol className="space-y-3.5">
      {steps.map((s, i) => (
        <li key={s.status} className="flex gap-3">
          <span
            className={cn(
              'mt-0.5 h-5 w-5 shrink-0 rounded-full',
              i <= currentIndex ? 'bg-slate-900' : 'border-[1.5px] border-slate-300',
            )}
          />
          <span>
            <span className={cn('block text-sm font-medium', i === currentIndex ? 'text-slate-900' : 'text-slate-500')}>
              {s.label}
            </span>
            <span className="block text-xs text-slate-500">{i === currentIndex ? 'You are here' : s.hint}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}
