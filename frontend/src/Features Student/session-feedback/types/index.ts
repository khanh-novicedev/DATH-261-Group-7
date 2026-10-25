import type { UUID } from '@shared/types'

export type Participation = 'LOW' | 'MEDIUM' | 'HIGH'

export interface SessionFeedbackInput {
  sessionId: UUID
  rating: number
  participation: Participation | null
  comment: string
}

export interface SessionSummary {
  sessionId: UUID
  courseId: UUID
  courseTitle: string
  lessonSequence: number
  roomName: string
  memberCount: number
  startedAt: string
  endedAt: string
  noteCount: number
  messageCount: number
  finalWhiteboardUrl: string | null
}
