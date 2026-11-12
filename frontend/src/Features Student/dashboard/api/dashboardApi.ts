import { getCourse, getMyEnrolments, type CourseDto, type EnrolmentDto } from '@shared/api'
import type { CompletionStatus } from '@shared/types'
import { accentFor } from '@shared/utils'
import type { DashboardData, EnrolledCourse } from '../types'

function toEnrolledCourse(e: EnrolmentDto, course: CourseDto | null): EnrolledCourse {
  const lessons = (course?.lessons ?? []).slice().sort((a, b) => a.sequenceNumber - b.sequenceNumber)
  const last = lessons.find((l) => l.id === e.lastPositionLessonId) ?? lessons[0] ?? null
  return {
    enrolmentId: e.enrolmentId,
    course: e.course,
    completionStatus: e.completionStatus,
    progressPercent: e.progressPercent,
    totalLessons: lessons.length,
    lastPositionLesson: last ? { id: last.id, sequenceNumber: last.sequenceNumber, title: last.title } : null,
    accent: accentFor(e.course.id),
  }
}

export async function getMyCourses(status?: CompletionStatus): Promise<EnrolledCourse[]> {
  const enrolments = await getMyEnrolments(status)
  const courses = await Promise.all(enrolments.map((e) => getCourse(e.course.id).catch(() => null)))
  return enrolments.map((e, i) => toEnrolledCourse(e, courses[i]))
}

export async function getDashboard(): Promise<DashboardData> {
  const inProgress = await getMyCourses('IN_PROGRESS')
  return {
    continueLearning: inProgress[0] ?? null,
    upcomingSession: null,
    inProgress,
  }
}
