import { enrol as enrolRequest, getCourse, getMyEnrolments, type EnrolmentDto } from '@shared/api'
import { accentFor } from '@shared/utils'
import type { CourseDetail } from '../types'

export async function getCourseDetail(courseId: string): Promise<CourseDetail> {
  const [course, enrolments] = await Promise.all([getCourse(courseId), getMyEnrolments().catch(() => [] as EnrolmentDto[])])
  return {
    id: course.id,
    title: course.title,
    description: course.description ?? '',
    category: course.category,
    accent: accentFor(course.id),
    learnerCount: 0,
    outline: (course.lessons ?? [])
      .slice()
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
      .map((l) => ({ sequenceNumber: l.sequenceNumber, title: l.title, type: l.type })),
    isEnrolled: enrolments.some((e) => e.courseId === courseId),
  }
}

export function enrol(courseId: string): Promise<EnrolmentDto> {
  return enrolRequest(courseId)
}
