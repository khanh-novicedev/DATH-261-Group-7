import { findMyCourseProgress, getCourse } from '@shared/api'
import type { LessonType } from '@shared/types'
import type { CourseSyllabus } from '../types'

const TYPE_LABEL: Record<LessonType, string> = {
  VIDEO: 'Video',
  TEXT: 'Document',
  LIVE_PRACTICE: 'Live practice',
}

export async function getCourseSyllabus(courseId: string): Promise<CourseSyllabus> {
  const [course, progress] = await Promise.all([getCourse(courseId), findMyCourseProgress(courseId)])
  const lessons = (course.lessons ?? []).slice().sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  const completedIds = new Set(progress?.lessons.filter((p) => p.isCompleted).map((p) => p.lessonId))
  const remaining = lessons.filter((l) => !completedIds.has(l.id))
  const currentId = remaining.find((l) => l.id === progress?.lastPositionLessonId)?.id ?? remaining[0]?.id

  return {
    course: { id: course.id, title: course.title, description: course.description ?? '', category: course.category },
    isEnrolled: course.enrolled ?? progress !== undefined,
    learnerCount: 0,
    forum: { threadCount: 0, unansweredCount: 0 },
    items: lessons.map((l) => ({
      lessonId: l.id,
      sequenceNumber: l.sequenceNumber,
      title: l.title,
      type: l.type,
      meta: TYPE_LABEL[l.type] ?? 'Lesson',
      status: completedIds.has(l.id) ? 'done' : progress && l.id === currentId ? 'current' : 'todo',
      liveSessionId: l.type === 'LIVE_PRACTICE' ? l.id : undefined,
    })),
  }
}
