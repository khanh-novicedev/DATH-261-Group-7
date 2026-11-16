import type { CompletionStatus, LessonType, UserSummary, UUID } from '@shared/types'

export interface LessonDetail {
  id: UUID
  courseId: UUID
  courseTitle: string
  sequenceNumber: number
  title: string
  type: LessonType
  contentUrl: string | null
  isEnrolled: boolean
  isCompleted: boolean
  previousLessonId: UUID | null
  nextRoute: string | null
}

export interface LessonProgressUpdate {
  completionStatus: CompletionStatus
  completedLessons: number
  totalLessons: number
  progressPercent: number
  lastPositionLessonId: UUID | null
}

export interface QnaPost {
  id: UUID
  author: UserSummary
  content: string
  createdAt: string
  parentId: UUID | null
}

export interface QnaThread extends QnaPost {
  replies: QnaPost[]
}
