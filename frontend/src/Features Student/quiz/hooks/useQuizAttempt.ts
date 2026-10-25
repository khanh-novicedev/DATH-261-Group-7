import { useCallback, useEffect, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { getQuiz, submitQuiz } from '../api/quizApi'
import type { QuizAnswers, QuizAttempt } from '../types'

export function useQuizAttempt(assignmentId: string) {
  const { data: quiz, loading } = useAsync(() => getQuiz(assignmentId), [assignmentId])
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const total = quiz?.questions.length ?? 0

  useEffect(() => {
    if (quiz?.attempt) setAttempt(quiz.attempt)
  }, [quiz])

  const submit = useCallback(async () => {
    if (!quiz || submitting) return
    setSubmitting(true)
    try {
      setAttempt(await submitQuiz(assignmentId, answers, quiz.questions.length))
    } finally {
      setSubmitting(false)
    }
  }, [assignmentId, answers, quiz, submitting])

  const phase: 'intro' | 'running' | 'done' = attempt ? 'done' : started ? 'running' : 'intro'

  return {
    quiz,
    loading,
    phase,
    start: () => setStarted(true),
    index,
    total,
    question: quiz?.questions[index],
    answers,
    unanswered: total - Object.keys(answers).length,
    goTo: (i: number) => setIndex(Math.max(0, Math.min(total - 1, i))),
    choose: (questionId: string, optionId: string) => setAnswers((a) => ({ ...a, [questionId]: optionId })),
    submit,
    submitting,
    attempt,
  }
}
