import type { UserSummary, UUID } from '@shared/types'

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink'

export interface WhiteboardNote {
  id: UUID
  content: string
  posX: number
  posY: number
  color: NoteColor
  createdBy: UserSummary
}

export interface RoomMessage {
  id: UUID
  sender: UserSummary
  content: string
  isBroadcast: boolean
  sentAt: string
}

export interface BreakoutRoom {
  id: UUID
  name: string
  sessionId: UUID
  sessionTitle: string
  courseTitle: string
  endsAt: string
  participants: UserSummary[]
  columns: string[]
  notes: WhiteboardNote[]
  messages: RoomMessage[]
}

export type LiveSessionStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED'

export interface LiveSession {
  id: UUID
  title: string
  courseId: UUID
  courseTitle: string
  lessonSequence: number
  scheduledTime: string
  status: LiveSessionStatus
  myRoomId: UUID | null
}

export type RoomEvent =
  | { kind: 'note:add'; note: WhiteboardNote }
  | { kind: 'note:update'; id: UUID; patch: Partial<WhiteboardNote> }
  | { kind: 'message:send'; message: RoomMessage }

export interface SessionHistory {
  session: LiveSession
  roomName: string
  columns: string[]
  finalNotes: WhiteboardNote[]
  messages: RoomMessage[]
  feedbackSent: boolean
}
