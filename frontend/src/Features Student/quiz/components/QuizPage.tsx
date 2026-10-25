import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Breadcrumb, Button, Card, CardTitle, Dialog, PageHeading, RadioOption } from '@shared/components'
import { cn } from '@shared/utils'
import { useQuizAttempt } from '../hooks/useQuizAttempt'
import { QuestionNavigator } from './QuestionNavigator'
import { QuizIntro } from './QuizIntro'
import { QuizResult } from './QuizResult'

export function QuizPage() {
  const { assignmentId = '' } = useParams()
  const a = useQuizAttempt(assignmentId)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { quiz, question, index, total } = a

  if (a.loading || !quiz) return <p className="text-sm text-slate-500">Loading…</p>

  const trySubmit = () => (a.unanswered > 0 ? setConfirmOpen(true) : void a.submit())

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: quiz.courseTitle, to: `/student/courses/${quiz.courseId}` },
          { label: `Lesson ${quiz.lessonSequence} · Lesson title` },
        ]}
      />
      <PageHeading
        title={quiz.title}
        subtitle={`${total} questions · One attempt · Auto-graded on submit`}
        actions={
          a.phase === 'running' && (
            <Badge>
              Question {index + 1} / {total}
            </Badge>
          )
        }
      />

      {a.phase === 'intro' && <QuizIntro quiz={quiz} onStart={a.start} />}
      {a.phase === 'done' && a.attempt && <QuizResult quiz={quiz} attempt={a.attempt} />}

      {a.phase === 'running' && question && (
        <div className="flex gap-6">
          <Card className="flex min-h-[440px] flex-1 flex-col gap-4 p-6">
            <p className="text-xs font-medium uppercase text-slate-500">Question {index + 1}</p>
            <h2 className="text-xl font-semibold">{question.content}</h2>
            <div className="space-y-2.5 pt-1">
              {question.options.map((o, i) => (
                <RadioOption
                  key={o.id}
                  name={question.id}
                  value={o.id}
                  label={`${'ABCD'[i]}.  ${o.content}`}
                  checked={a.answers[question.id] === o.id}
                  onChange={(v) => a.choose(question.id, v)}
                />
              ))}
            </div>
            <div className="mt-auto flex justify-between">
              <Button variant="outline" disabled={index === 0} onClick={() => a.goTo(index - 1)}>
                Previous
              </Button>
              <Button disabled={index === total - 1} onClick={() => a.goTo(index + 1)}>
                Next
              </Button>
            </div>
          </Card>

          <Card className="flex w-[272px] shrink-0 flex-col gap-4 p-5">
            <CardTitle>Questions</CardTitle>
            <QuestionNavigator quiz={quiz} answers={a.answers} current={index} onSelect={a.goTo} />
            <p className={cn('mt-auto text-xs', a.unanswered > 0 ? 'text-slate-500' : 'text-green-700')}>
              {a.unanswered > 0 ? `${a.unanswered} questions unanswered. You will be asked to confirm before submitting.` : 'All questions answered.'}
            </p>
            <Button fullWidth disabled={a.submitting} onClick={trySubmit}>
              Submit
            </Button>
          </Card>
        </div>
      )}

      <Dialog
        open={confirmOpen && a.phase === 'running'}
        onClose={() => setConfirmOpen(false)}
        title="Submit quiz?"
        description={`${a.unanswered} questions are still unanswered. You only get one attempt.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Go back
            </Button>
            <Button
              disabled={a.submitting}
              onClick={() => {
                setConfirmOpen(false)
                void a.submit()
              }}
            >
              Submit anyway
            </Button>
          </>
        }
      />
    </div>
  )
}
