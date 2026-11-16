import { apiClient, findMyCourseProgress, getCourse, unwrap, type LessonDto } from '@shared/api'
import { mockResponse } from '@shared/utils'
import type { LessonDetail, LessonProgressUpdate, QnaPost, QnaThread } from '../types'

const learner = (n: number) => ({ id: `u-${n}`, fullName: 'User name', role: 'STUDENT' as const })
const instructor = { id: 'u-instructor-1', fullName: 'Instructor name', role: 'TEACHER' as const }
const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString()

function lessonRoute(courseId: string, lesson: LessonDto) {
  if (lesson.type === 'LIVE_PRACTICE') return `/student/live/${lesson.id}`
  return `/student/courses/${courseId}/lessons/${lesson.id}`
}

export async function getLesson(courseId: string, lessonId: string): Promise<LessonDetail> {
  const [course, progress] = await Promise.all([getCourse(courseId), findMyCourseProgress(courseId)])
  const lessons = (course.lessons ?? []).slice().sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  const index = lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) throw new Error('Lesson not found.')

  const lesson = lessons[index]
  const next = lessons[index + 1]
  return {
    id: lesson.id,
    courseId,
    courseTitle: course.title,
    sequenceNumber: lesson.sequenceNumber,
    title: lesson.title,
    type: lesson.type,
    contentUrl: lesson.contentUrl ?? null,
    isEnrolled: progress !== undefined,
    isCompleted: progress?.lessons.some((p) => p.lessonId === lesson.id && p.isCompleted) ?? false,
    previousLessonId: lessons[index - 1]?.id ?? null,
    nextRoute: next ? lessonRoute(courseId, next) : null,
  }
}

export function saveLessonProgress(courseId: string, lessonId: string, isCompleted: boolean): Promise<LessonProgressUpdate> {
  return unwrap(apiClient.put(`/courses/${courseId}/progress/lessons/${lessonId}`, { isCompleted }))
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
