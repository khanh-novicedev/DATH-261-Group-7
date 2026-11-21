import { apiClient, findMyCourseProgress, getCourse, unwrap, type LessonDto } from '@shared/api'
import type { LessonDetail, LessonProgressUpdate } from '../types'

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
