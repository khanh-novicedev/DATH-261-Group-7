import { mockResponse } from '@shared/utils'
import type { UUID } from '@shared/types'

export type ReportedEntityType = 'LESSON' | 'QNA' | 'FORUM_THREAD'

export interface ReportInput {
  reportedEntityType: ReportedEntityType
  reportedEntityId: UUID
  reason: string
}

export function reportContent(input: ReportInput): Promise<{ ok: true }> {
  void input
  return mockResponse({ ok: true as const }, 300)
}
