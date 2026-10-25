export type UUID = string

export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'LEARNER'
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
export type LessonType = 'VIDEO' | 'TEXT' | 'LIVE_PRACTICE'
export type CompletionStatus = 'IN_PROGRESS' | 'COMPLETED'
export type AssignmentType = 'QUIZ' | 'FILE_SUBMISSION'
export type SessionStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED'
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED'

export interface UserSummary {
  id: UUID
  fullName: string
  role: UserRole
}

export interface CourseSummary {
  id: UUID
  title: string
  description?: string
  category?: string
  instructor: UserSummary
}
