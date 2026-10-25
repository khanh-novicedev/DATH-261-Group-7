import { mockResponse } from '@shared/utils'
import type { LiveSession, SessionHistory } from '../types'
import { getMyRoom } from './liveRoomApi'

const firstSeen = new Map<string, number>()

export function resetDemoTimeline(sessionId: string, skipToRoom: boolean) {
  firstSeen.set(sessionId, skipToRoom ? Date.now() - 30_000 : Date.now())
}

export function getLiveSession(sessionId: string): Promise<LiveSession> {
  if (!firstSeen.has(sessionId)) firstSeen.set(sessionId, Date.now())
  const t0 = firstSeen.get(sessionId)!
  const elapsed = Date.now() - t0
  const ended = sessionId === 's-ended'
  return mockResponse(
    {
      id: sessionId,
      title: 'Session title',
      courseId: 'c-1',
      courseTitle: 'Course title',
      lessonSequence: 5,
      scheduledTime: new Date(ended ? Date.now() - 86_400_000 : t0 + 15_000).toISOString(),
      status: ended ? 'COMPLETED' : elapsed < 15_000 ? 'SCHEDULED' : 'ONGOING',
      myRoomId: !ended && elapsed >= 20_000 ? 'r-3' : null,
    } satisfies LiveSession,
    50,
  )
}

export async function getSessionHistory(sessionId: string): Promise<SessionHistory> {
  const [session, room] = await Promise.all([getLiveSession(sessionId), getMyRoom(sessionId)])
  return {
    session: { ...session, status: 'COMPLETED' },
    roomName: room.name,
    columns: room.columns,
    finalNotes: room.notes,
    messages: room.messages,
    feedbackSent: false,
  }
}
