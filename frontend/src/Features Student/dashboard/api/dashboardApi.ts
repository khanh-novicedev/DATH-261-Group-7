import { mockResponse } from '@shared/utils'
import type { DashboardData, EnrolledCourse } from '../types'

const instructor = { id: 'u-instructor-1', fullName: 'Instructor name', role: 'INSTRUCTOR' as const }

const enrolments: EnrolledCourse[] = [
  {
    enrolmentId: 'e-1',
    course: { id: 'c-1', title: 'Course title', instructor },
    completionStatus: 'IN_PROGRESS',
    completedLessons: 4,
    totalLessons: 10,
    lastPositionLesson: { id: 'l-4', sequenceNumber: 4, title: 'Lesson title' },
    accent: 'amber',
  },
  {
    enrolmentId: 'e-2',
    course: { id: 'c-2', title: 'Course title', instructor },
    completionStatus: 'IN_PROGRESS',
    completedLessons: 7,
    totalLessons: 8,
    lastPositionLesson: { id: 'l-7', sequenceNumber: 7, title: 'Lesson title' },
    accent: 'sky',
  },
  {
    enrolmentId: 'e-3',
    course: { id: 'c-3', title: 'Course title', instructor },
    completionStatus: 'IN_PROGRESS',
    completedLessons: 1,
    totalLessons: 12,
    lastPositionLesson: { id: 'l-1', sequenceNumber: 1, title: 'Lesson title' },
    accent: 'emerald',
  },
]

export function getDashboard(): Promise<DashboardData> {
  return mockResponse({
    continueLearning: enrolments[0],
    upcomingSession: {
      id: 's-5',
      title: 'Session title',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      learnerCount: 0,
      roomCount: 0,
    },
    inProgress: enrolments,
  })
}

export function getMyCourses(): Promise<EnrolledCourse[]> {
  return mockResponse(enrolments)
}
