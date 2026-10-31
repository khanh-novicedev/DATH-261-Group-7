import { mockResponse } from '@shared/utils'
import type { UserSummary } from '@shared/types'
import type { BreakoutRoom, NoteColor, RoomMessage, WhiteboardNote } from '../types'

const user = (n: number) => ({ id: `u-${n}`, fullName: 'User name', role: 'STUDENT' as const })
const me = { id: 'u-learner-1', fullName: 'User name', role: 'STUDENT' as const }
const instructor = { id: 'u-instructor-1', fullName: 'Instructor name', role: 'TEACHER' as const }

const note = (id: number, color: NoteColor, posX: number, posY: number): WhiteboardNote => ({
  id: `n-${id}`,
  content: 'Content',
  posX,
  posY,
  color,
  createdBy: user(id % 4),
})

const msg = (id: number, sender: UserSummary, isBroadcast = false): RoomMessage => ({
  id: `m-${id}`,
  sender,
  content: isBroadcast ? 'Broadcast message' : 'Message',
  isBroadcast,
  sentAt: new Date().toISOString(),
})

export function getMyRoom(sessionId: string): Promise<BreakoutRoom> {
  return mockResponse({
    id: 'r-3',
    name: 'Room 3',
    sessionId,
    sessionTitle: 'Session title',
    courseTitle: 'Course title',
    endsAt: new Date(Date.now() + 12 * 60_000 + 45_000).toISOString(),
    participants: [me, user(1), user(2), user(3)],
    columns: ['Column 1', 'Column 2', 'Column 3'],
    notes: [
      note(1, 'yellow', 24, 48),
      note(2, 'yellow', 24, 192),
      note(3, 'blue', 224, 48),
      note(4, 'blue', 224, 192),
      note(5, 'green', 424, 48),
      note(6, 'green', 424, 192),
      note(7, 'pink', 424, 336),
    ],
    messages: [msg(0, instructor, true), msg(1, user(1)), msg(2, user(2)), msg(3, me), msg(4, user(3))],
  })
}

export const CURRENT_USER = me
