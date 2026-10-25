import { HelpCircle, ListChecks, RotateCcw } from 'lucide-react'
import { Banner, Button, Card, CardTitle, IconStat } from '@shared/components'
import type { Quiz } from '../types'

export function QuizIntro({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  return (
    <Card className="mx-auto flex max-w-[560px] flex-col gap-4 p-6">
      <CardTitle>Before you start</CardTitle>
      <p className="text-sm text-slate-600">{quiz.instructions}</p>
      <IconStat icon={HelpCircle}>{quiz.questions.length} questions</IconStat>
      <IconStat icon={ListChecks}>
        Pass score: {quiz.passScore}/{quiz.questions.length}
      </IconStat>
      <Banner tone="warning" icon={RotateCcw}>
        You only get one attempt. After submitting you can only review your score.
      </Banner>
      <Button onClick={onStart}>Start quiz</Button>
    </Card>
  )
}
