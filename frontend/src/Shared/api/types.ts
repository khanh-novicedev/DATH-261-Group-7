import type { CompletionStatus, CourseStatus, LessonType, UUID } from '@shared/types'

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data?: T
  errorCode?: string
}

export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface LessonDto {
  id: UUID
  sequenceNumber: number
  title: string
  type: LessonType
  contentUrl?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CourseDto {
  id: UUID
  instructorId: UUID | null
  instructor?: InstructorSummary | null
  title: string
  description: string | null
  category: string | null
  prerequisites?: string | null
  status: CourseStatus
  enrolled?: boolean
  lessons: LessonDto[] | null
  createdAt?: string
  updatedAt?: string
}

export interface InstructorSummary {
  id: UUID
  fullName: string
}

export interface CourseCatalogItem {
  id: UUID
  title: string
  description: string | null
  category: string | null
  status: CourseStatus
  instructor: InstructorSummary | null
  lessonCount: number
}

export interface EnrolResult {
  enrolmentId: UUID
  courseId: UUID
  completionStatus: CompletionStatus
  enrolledAt: string
}

export interface EnrolmentDto {
  enrolmentId: UUID
  course: { id: UUID; title: string; category: string | null }
  completionStatus: CompletionStatus
  progressPercent: number
  lastPositionLessonId: UUID | null
  enrolledAt: string
}
