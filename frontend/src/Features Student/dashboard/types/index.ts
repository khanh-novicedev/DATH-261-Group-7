import type { CompletionStatus, CourseSummary, UUID } from '@shared/types'

export interface EnrolledCourse {
  enrolmentId: UUID
  course: CourseSummary
  completionStatus: CompletionStatus
  completedLessons: number
  totalLessons: number
  lastPositionLesson: { id: UUID; sequenceNumber: number; title: string }
  accent: 'amber' | 'sky' | 'emerald' | 'violet' | 'rose' | 'teal'
}

export interface UpcomingLiveSession {
  id: UUID
  title: string
  scheduledTime: string
  learnerCount: number
  roomCount: number
}

export interface DashboardData {
  continueLearning: EnrolledCourse | null
  upcomingSession: UpcomingLiveSession | null
  inProgress: EnrolledCourse[]
}
