import { useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Button, Card } from '@shared/components'
import { cn } from '@shared/utils'
import type { Quiz, QuizAttempt } from '../types'

export function QuizResult({ quiz, attempt }: { quiz: Quiz; attempt: QuizAttempt }) {
  const navigate = useNavigate()
  const Icon = attempt.passed ? CheckCircle2 : XCircle

  return (
    <Card className="mx-auto flex max-w-[560px] flex-col items-center gap-4 p-8 text-center">
      <Icon className={cn('h-12 w-12', attempt.passed ? 'text-green-600' : 'text-red-500')} />
      <div className="space-y-1">
        <p className="text-sm text-slate-500">Your score</p>
        <p className="text-4xl font-bold text-slate-900">
          {attempt.totalScore}/{attempt.maxScore}
        </p>
        <p className={cn('text-sm font-medium', attempt.passed ? 'text-green-700' : 'text-red-600')}>
          {attempt.passed ? 'Passed' : `Not passed · pass score ${quiz.passScore}`}
        </p>
      </div>
      <p className="text-xs text-slate-500">Submitted {new Date(attempt.attemptedAt).toLocaleString()} · This quiz can only be taken once.</p>
      <Button onClick={() => navigate(`/student/courses/${quiz.courseId}`)}>Back to course</Button>
    </Card>
  )
}
