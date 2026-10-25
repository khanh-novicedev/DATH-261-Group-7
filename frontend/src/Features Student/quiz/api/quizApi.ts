import { mockResponse } from '@shared/utils'
import type { Quiz, QuizAnswers, QuizAttempt } from '../types'

const makeQuestions = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `q-${i + 1}`,
    content: 'Question content',
    points: 1,
    options: ['A', 'B', 'C', 'D'].map((letter) => ({ id: `q-${i + 1}-${letter}`, content: 'Answer' })),
  }))

const attempts = new Map<string, QuizAttempt>([
  ['a-3', { totalScore: 8, maxScore: 10, passed: true, attemptedAt: new Date(Date.now() - 86_400_000).toISOString() }],
])

export function getQuiz(assignmentId: string): Promise<Quiz> {
  const count = assignmentId === 'a-3' ? 10 : 15
  return mockResponse({
    id: assignmentId,
    title: 'Quiz title',
    instructions: 'Instructions',
    courseId: 'c-1',
    courseTitle: 'Course title',
    lessonSequence: Number(assignmentId.replace(/\D/g, '')) || 8,
    passScore: Math.ceil(count * 0.6),
    questions: makeQuestions(count),
    attempt: attempts.get(assignmentId) ?? null,
  })
}

export function submitQuiz(assignmentId: string, answers: QuizAnswers, total: number): Promise<QuizAttempt> {
  const totalScore = Object.keys(answers).length
  const attempt: QuizAttempt = {
    totalScore,
    maxScore: total,
    passed: totalScore >= Math.ceil(total * 0.6),
    attemptedAt: new Date().toISOString(),
  }
  attempts.set(assignmentId, attempt)
  return mockResponse(attempt)
}
