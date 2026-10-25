import type { UUID } from '@shared/types'

export interface FileAssignment {
  id: UUID
  title: string
  instructions: string
  gradingCriteria: string
  deadline: string
  courseId: UUID
  courseTitle: string
  lessonSequence: number
}

export type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED'

export interface Submission {
  status: SubmissionStatus
  fileName?: string
  fileUrl?: string
  submittedAt?: string
  score?: number
  feedback?: string
}
