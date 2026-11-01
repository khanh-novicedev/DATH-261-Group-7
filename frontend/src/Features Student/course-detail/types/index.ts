import type { LessonType, UUID } from '@shared/types'
import type { Accent } from '@shared/utils'

export interface CourseOutlineItem {
  sequenceNumber: number
  title: string
  type: LessonType
  assignmentType?: 'QUIZ' | 'FILE_SUBMISSION'
}

export interface CourseDetail {
  id: UUID
  title: string
  description: string
  category: string | null
  accent: Accent
  learnerCount: number
  outline: CourseOutlineItem[]
  isEnrolled: boolean
}
