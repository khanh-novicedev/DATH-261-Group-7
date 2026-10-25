import type { SyllabusItem } from '../types'

export function itemRoute(courseId: string, item: SyllabusItem) {
  if (item.assignment?.type === 'QUIZ') return `/student/quiz/${item.assignment.id}`
  if (item.assignment?.type === 'FILE_SUBMISSION') return `/student/assignments/${item.assignment.id}`
  if (item.liveSessionId) return `/student/live/${item.liveSessionId}`
  return `/student/courses/${courseId}/lessons/${item.lessonId}`
}
