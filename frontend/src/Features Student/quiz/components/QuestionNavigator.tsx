import { cn } from '@shared/utils'
import type { Quiz, QuizAnswers } from '../types'

export function QuestionNavigator({
  quiz,
  answers,
  current,
  onSelect,
}: {
  quiz: Quiz
  answers: QuizAnswers
  current: number
  onSelect: (i: number) => void
}) {
  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {quiz.questions.map((q, i) => {
          const answered = Boolean(answers[q.id])
          const isCurrent = i === current
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isCurrent}
              className={cn(
                'flex h-[38px] w-[38px] items-center justify-center rounded-lg text-sm font-medium',
                answered && !isCurrent && 'bg-slate-900 text-white',
                isCurrent && 'border-2 border-slate-900 bg-white text-slate-700',
                !answered && !isCurrent && 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <ul className="space-y-2 text-xs text-slate-600">
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px] bg-slate-900" /> Answered
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px] border-2 border-slate-900" /> Current
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-[3px] border border-slate-300" /> Unanswered
        </li>
      </ul>
    </>
  )
}
