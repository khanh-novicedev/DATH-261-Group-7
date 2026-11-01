import type { CompletionStatus, UUID } from '@shared/types'
import type { Accent } from '@shared/utils'

export interface EnrolledCourse {
  enrolmentId: UUID
  course: { id: UUID; title: string; category: string | null }
  completionStatus: CompletionStatus
  completedLessons: number
  totalLessons: number
  lastPositionLesson: { id: UUID; sequenceNumber: number; title: string } | null
  accent: Accent
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
