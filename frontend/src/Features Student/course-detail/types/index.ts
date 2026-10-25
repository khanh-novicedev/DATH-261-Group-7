import type { CourseSummary, LessonType, UUID } from '@shared/types'

export interface CourseOutlineItem {
  sequenceNumber: number
  title: string
  type: LessonType
  assignmentType?: 'QUIZ' | 'FILE_SUBMISSION'
}

export interface CourseDetail extends CourseSummary {
  accent: 'amber' | 'sky' | 'emerald' | 'violet' | 'rose' | 'teal'
  learnerCount: number
  outline: CourseOutlineItem[]
  isEnrolled: boolean
}

export interface EnrolResult {
  enrolmentId: UUID
  courseId: UUID
}
