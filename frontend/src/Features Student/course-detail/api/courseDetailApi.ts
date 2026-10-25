import { mockResponse } from '@shared/utils'
import type { CourseDetail, CourseOutlineItem, EnrolResult } from '../types'

const accents: CourseDetail['accent'][] = ['amber', 'sky', 'emerald', 'violet', 'rose', 'teal']

const enrolled = new Set(['c-1', 'c-2', 'c-3'])

const outline: CourseOutlineItem[] = [
  { sequenceNumber: 1, title: 'Lesson title', type: 'VIDEO' },
  { sequenceNumber: 2, title: 'Lesson title', type: 'TEXT' },
  { sequenceNumber: 3, title: 'Lesson title', type: 'TEXT', assignmentType: 'QUIZ' },
  { sequenceNumber: 4, title: 'Lesson title', type: 'VIDEO' },
  { sequenceNumber: 5, title: 'Lesson title', type: 'LIVE_PRACTICE' },
  { sequenceNumber: 6, title: 'Lesson title', type: 'TEXT', assignmentType: 'FILE_SUBMISSION' },
  { sequenceNumber: 7, title: 'Lesson title', type: 'TEXT' },
  { sequenceNumber: 8, title: 'Lesson title', type: 'TEXT', assignmentType: 'QUIZ' },
]

export function getCourseDetail(courseId: string): Promise<CourseDetail> {
  const n = Number(courseId.replace(/\D/g, '')) || 1
  return mockResponse({
    id: courseId,
    title: 'Course title',
    description: 'Description',
    category: `Category ${((n - 1) % 5) + 1}`,
    instructor: { id: 'u-instructor-1', fullName: 'Instructor name', role: 'INSTRUCTOR' },
    accent: accents[(n - 1) % accents.length],
    learnerCount: 0,
    outline,
    isEnrolled: enrolled.has(courseId),
  })
}

export function enrol(courseId: string): Promise<EnrolResult> {
  enrolled.add(courseId)
  return mockResponse({ enrolmentId: crypto.randomUUID(), courseId }, 300)
}
