import { mockResponse } from '@shared/utils'
import type { ForumOverview, ForumThread } from '../types'

const replyCounts = [12, 4, 0, 7, 2, 0, 3, 1, 5, 0]

const threads = (courseId: string): ForumThread[] =>
  replyCounts.map((replyCount, i) => ({
    id: `t-${i + 1}`,
    courseId,
    title: 'Thread title',
    preview: 'Content',
    author: { id: i % 3 === 0 ? 'u-learner-1' : `u-${i}`, fullName: 'User name', role: 'STUDENT' },
    createdAt: new Date(Date.now() - (i + 1) * 3_600_000).toISOString(),
    replyCount,
  }))

export function getThreads(courseId: string): Promise<ForumThread[]> {
  return mockResponse(threads(courseId))
}

export function getForumOverview(courseId: string): Promise<ForumOverview> {
  const list = threads(courseId)
  return mockResponse({
    courseTitle: 'Course title',
    threadCount: list.length,
    unansweredCount: list.filter((t) => t.replyCount === 0).length,
    memberCount: 0,
    rules: ['Rule 1', 'Rule 2', 'Rule 3'],
  })
}

export function createThread(courseId: string, author: ForumThread['author'], title: string, content: string): Promise<ForumThread> {
  return mockResponse({
    id: crypto.randomUUID(),
    courseId,
    title,
    preview: content,
    author,
    createdAt: new Date().toISOString(),
    replyCount: 0,
  })
}
