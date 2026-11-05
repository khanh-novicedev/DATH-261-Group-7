import { getCourse, getMyEnrolments, type EnrolmentDto } from '@shared/api'
import type { LessonType } from '@shared/types'
import type { CourseSyllabus } from '../types'

const TYPE_LABEL: Record<LessonType, string> = {
  VIDEO: 'Video',
  TEXT: 'Document',
  LIVE_PRACTICE: 'Live practice',
}

export async function getCourseSyllabus(courseId: string): Promise<CourseSyllabus> {
  const [course, enrolments] = await Promise.all([getCourse(courseId), getMyEnrolments().catch(() => [] as EnrolmentDto[])])
  const enrolment = enrolments.find((e) => e.courseId === courseId)
  const lessons = (course.lessons ?? []).slice().sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  const currentId = enrolment?.lastPositionLessonId ?? lessons[0]?.id
  const currentIndex = Math.max(0, lessons.findIndex((l) => l.id === currentId))
  const completed = enrolment?.completionStatus === 'COMPLETED'

  return {
    course: { id: course.id, title: course.title, description: course.description ?? '', category: course.category },
    isEnrolled: Boolean(enrolment),
    learnerCount: 0,
    forum: { threadCount: 0, unansweredCount: 0 },
    items: lessons.map((l, i) => ({
      lessonId: l.id,
      sequenceNumber: l.sequenceNumber,
      title: l.title,
      type: l.type,
      meta: TYPE_LABEL[l.type] ?? 'Lesson',
      status: completed || (enrolment?.lastPositionLessonId && i < currentIndex) ? 'done' : i === currentIndex && enrolment ? 'current' : 'todo',
      liveSessionId: l.type === 'LIVE_PRACTICE' ? l.id : undefined,
    })),
  }
}
