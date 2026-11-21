import type { UUID } from '@shared/types'
import { apiClient, unwrap } from './client'
import type { PageResponse, QnaPostDto, QnaThreadDto } from './types'

interface FlatQna {
  id: UUID
  authorId: UUID
  authorName: string
  parentId: UUID | null
  content: string
  createdAt: string
}

const MAX_PAGE_SIZE = 100

function toPost(qna: FlatQna): QnaPostDto {
  return {
    id: qna.id,
    author: { id: qna.authorId, fullName: qna.authorName, role: null },
    content: qna.content,
    createdAt: qna.createdAt,
  }
}

function toThreads(rows: FlatQna[]): QnaThreadDto[] {
  const threads = rows.filter((q) => q.parentId === null).map((q): QnaThreadDto => ({ ...toPost(q), replies: [] }))
  const threadsById = new Map(threads.map((t) => [t.id, t]))
  for (const q of rows) {
    if (q.parentId) threadsById.get(q.parentId)?.replies.push(toPost(q))
  }
  return threads
}

export async function getLessonQna(lessonId: string): Promise<QnaThreadDto[]> {
  const data = await unwrap<PageResponse<QnaThreadDto> | FlatQna[]>(
    apiClient.get(`/lessons/${lessonId}/qna`, { params: { size: MAX_PAGE_SIZE } }),
  )
  return Array.isArray(data) ? toThreads(data) : data.items
}

export async function askQuestion(lessonId: string, content: string): Promise<QnaThreadDto> {
  const created = await unwrap<QnaPostDto | FlatQna>(apiClient.post(`/lessons/${lessonId}/qna`, { content }))
  const post = 'author' in created ? created : toPost(created)
  return { ...post, replies: [] }
}
