import type { LessonType, UserSummary, UUID } from '@shared/types'

export interface LessonDetail {
  id: UUID
  courseId: UUID
  courseTitle: string
  sequenceNumber: number
  title: string
  description: string
  type: LessonType
  contentUrl: string | null
  isCompleted: boolean
  previousLessonId: UUID | null
  nextRoute: string | null
  courseLessonCount: number
  completedCount: number
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
