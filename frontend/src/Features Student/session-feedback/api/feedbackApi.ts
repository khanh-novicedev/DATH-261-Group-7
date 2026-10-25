import { mockResponse } from '@shared/utils'
import type { SessionFeedbackInput, SessionSummary } from '../types'

export function getSessionSummary(sessionId: string): Promise<SessionSummary> {
  const ended = Date.now()
  return mockResponse({
    sessionId,
    courseId: 'c-1',
    courseTitle: 'Course title',
    lessonSequence: 5,
    roomName: 'Room 3',
    memberCount: 4,
    startedAt: new Date(ended - 45 * 60_000).toISOString(),
    endedAt: new Date(ended).toISOString(),
    noteCount: 0,
    messageCount: 0,
    finalWhiteboardUrl: null,
  })
}

export function sendFeedback(input: SessionFeedbackInput): Promise<{ ok: true }> {
  void input
  return mockResponse({ ok: true as const }, 300)
}
