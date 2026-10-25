import type { UserSummary, UUID } from '@shared/types'

export interface ForumThread {
  id: UUID
  courseId: UUID
  title: string
  preview: string
  author: UserSummary
  createdAt: string
  replyCount: number
}

export type ForumTab = 'all' | 'unanswered' | 'mine'

export interface ForumOverview {
  courseTitle: string
  threadCount: number
  unansweredCount: number
  memberCount: number
  rules: string[]
}
