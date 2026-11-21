import { apiClient, enrol as enrolRequest, findMyEnrolment, getCourse, unwrap, type EnrolResult } from '@shared/api'
import { accentFor } from '@shared/utils'
import type { CourseDetail } from '../types'

export async function getCourseDetail(courseId: string): Promise<CourseDetail> {
  const course = await getCourse(courseId)
  const isEnrolled = course.enrolled ?? Boolean(await findMyEnrolment(courseId).catch(() => undefined))
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? '',
    category: course.category,
    prerequisites: course.prerequisites ?? null,
    instructorName: course.instructor?.fullName ?? null,
    accent: accentFor(course.id),
    learnerCount: 0,
    outline: (course.lessons ?? [])
      .slice()
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map((l) => ({ sequenceNumber: l.sequenceNumber, title: l.title, type: l.type })),
    isEnrolled,
  }
}

export function enrol(courseId: string): Promise<EnrolResult> {
  return enrolRequest(courseId)
}

export function leaveCourse(courseId: string): Promise<void> {
  return unwrap(apiClient.delete(`/courses/${courseId}/enrolment`))
}
