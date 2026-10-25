import type { UUID } from '@shared/types'

export interface QuizOption {
  id: UUID
  content: string
}

export interface QuizQuestion {
  id: UUID
  content: string
  points: number
  options: QuizOption[]
}

export interface QuizAttempt {
  totalScore: number
  maxScore: number
  passed: boolean
  attemptedAt: string
}

export interface Quiz {
  id: UUID
  title: string
  instructions: string
  courseId: UUID
  courseTitle: string
  lessonSequence: number
  passScore: number
  questions: QuizQuestion[]
  attempt: QuizAttempt | null
}

export type QuizAnswers = Record<UUID, UUID>
