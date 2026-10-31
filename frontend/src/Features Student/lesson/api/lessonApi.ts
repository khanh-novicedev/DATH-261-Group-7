import { mockResponse } from '@shared/utils'
import type { LessonDetail, QnaPost, QnaThread } from '../types'

const learner = (n: number) => ({ id: `u-${n}`, fullName: 'User name', role: 'STUDENT' as const })
const instructor = { id: 'u-instructor-1', fullName: 'Instructor name', role: 'TEACHER' as const }
const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString()

const COURSE_LESSONS = 8
const specialRoutes: Record<number, string> = {
  3: '/student/quiz/a-3',
  5: '/student/live/s-5',
  6: '/student/assignments/a-6',
  8: '/student/quiz/a-8',
}

export function getLesson(courseId: string, lessonId: string): Promise<LessonDetail> {
  const seq = Number(lessonId.replace(/\D/g, '')) || 1
  const next = seq + 1
  return mockResponse({
    id: lessonId,
    courseId,
    courseTitle: 'Course title',
    sequenceNumber: seq,
    title: 'Lesson title',
    description: 'Lesson description',
    type: 'VIDEO' as const,
    contentUrl: null,
    isCompleted: false,
    previousLessonId: seq > 1 ? `l-${seq - 1}` : null,
    nextRoute: next > COURSE_LESSONS ? null : (specialRoutes[next] ?? `/student/courses/${courseId}/lessons/l-${next}`),
    courseLessonCount: COURSE_LESSONS,
    completedCount: Math.min(seq - 1, COURSE_LESSONS - 1),
  })
}

export function getQna(lessonId: string): Promise<QnaThread[]> {
  void lessonId
  return mockResponse([
    {
      id: 'qna-1', author: learner(1), content: 'Question content', createdAt: ago(10), parentId: null,
      replies: [{ id: 'qna-1-r', author: instructor, content: 'Answer content', createdAt: ago(5), parentId: 'qna-1' }],
    },
    { id: 'qna-2', author: learner(2), content: 'Question content', createdAt: ago(5), parentId: null, replies: [] },
  ])
}

export function postQuestion(lessonId: string, author: QnaPost['author'], content: string): Promise<QnaThread> {
  void lessonId
  return mockResponse({ id: crypto.randomUUID(), author, content, createdAt: new Date().toISOString(), parentId: null, replies: [] })
}

export function markComplete(lessonId: string, completedCount: number, total: number): Promise<{ courseCompleted: boolean }> {
  void lessonId
  return mockResponse({ courseCompleted: completedCount + 1 >= total })
}
