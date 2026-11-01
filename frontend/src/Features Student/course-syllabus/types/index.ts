import type { AssignmentType, LessonType, UUID } from '@shared/types'

export type LessonStatus = 'done' | 'current' | 'todo'

export interface SyllabusItem {
  lessonId: UUID
  sequenceNumber: number
  title: string
  type: LessonType
  meta: string
  status: LessonStatus
  assignment?: { id: UUID; type: AssignmentType }
  liveSessionId?: UUID
}

export interface CourseSyllabus {
  course: { id: UUID; title: string; description: string; category: string | null }
  isEnrolled: boolean
  learnerCount: number
  forum: { threadCount: number; unansweredCount: number }
  items: SyllabusItem[]
}
