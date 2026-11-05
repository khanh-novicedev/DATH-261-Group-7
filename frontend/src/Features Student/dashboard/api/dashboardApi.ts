import { getCourse, getMyEnrolments, type CourseDto, type EnrolmentDto } from '@shared/api'
import { accentFor } from '@shared/utils'
import type { DashboardData, EnrolledCourse } from '../types'

function toEnrolledCourse(e: EnrolmentDto, course: CourseDto | null): EnrolledCourse {
  const lessons = (course?.lessons ?? []).slice().sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  const last = lessons.find((l) => l.id === e.lastPositionLessonId) ?? lessons[0] ?? null
  const total = e.totalLessons ?? lessons.length
  return {
    enrolmentId: e.id,
    course: { id: e.courseId, title: course?.title ?? e.courseTitle, category: course?.category ?? null },
    completionStatus: e.completionStatus,
    completedLessons: e.completedLessons ?? (e.completionStatus === 'COMPLETED' ? total : 0),
    totalLessons: total,
    lastPositionLesson: last ? { id: last.id, sequenceNumber: last.sequenceNumber, title: last.title } : null,
    accent: accentFor(e.courseId),
  }
}

export async function getMyCourses(): Promise<EnrolledCourse[]> {
  const enrolments = await getMyEnrolments()
  const courses = await Promise.all(enrolments.map((e) => getCourse(e.courseId).catch(() => null)))
  return enrolments.map((e, i) => toEnrolledCourse(e, courses[i]))
}

export async function getDashboard(): Promise<DashboardData> {
  const courses = await getMyCourses()
  const inProgress = courses.filter((c) => c.completionStatus === 'IN_PROGRESS')
  return {
    continueLearning: inProgress[0] ?? null,
    upcomingSession: null,
    inProgress,
  }
}
