import { mockResponse } from '@shared/utils'
import type { CourseSyllabus, SyllabusItem } from '../types'

const items: SyllabusItem[] = [
  { lessonId: 'l-1', sequenceNumber: 1, title: 'Lesson title', type: 'VIDEO', meta: 'Video · 00 min', status: 'done' },
  { lessonId: 'l-2', sequenceNumber: 2, title: 'Lesson title', type: 'TEXT', meta: 'Document · 00 min read', status: 'done' },
  {
    lessonId: 'l-3', sequenceNumber: 3, title: 'Lesson title', type: 'TEXT', meta: 'Quiz · 10 questions · Score 8/10', status: 'done',
    assignment: { id: 'a-3', type: 'QUIZ' },
  },
  { lessonId: 'l-4', sequenceNumber: 4, title: 'Lesson title', type: 'VIDEO', meta: 'Video · 00 min', status: 'current' },
  {
    lessonId: 'l-5', sequenceNumber: 5, title: 'Lesson title', type: 'LIVE_PRACTICE', meta: 'Live practice · Date · Time', status: 'todo',
    liveSessionId: 's-5',
  },
  {
    lessonId: 'l-6', sequenceNumber: 6, title: 'Lesson title', type: 'TEXT', meta: 'Assignment · Due date', status: 'todo',
    assignment: { id: 'a-6', type: 'FILE_SUBMISSION' },
  },
  { lessonId: 'l-7', sequenceNumber: 7, title: 'Lesson title', type: 'TEXT', meta: 'Document · 00 min read', status: 'todo' },
  {
    lessonId: 'l-8', sequenceNumber: 8, title: 'Lesson title', type: 'TEXT', meta: 'Quiz · 15 questions', status: 'todo',
    assignment: { id: 'a-8', type: 'QUIZ' },
  },
]

export function getCourseSyllabus(courseId: string): Promise<CourseSyllabus> {
  return mockResponse({
    course: {
      id: courseId,
      title: 'Course title',
      description: 'Description',
      instructor: { id: 'u-instructor-1', fullName: 'Instructor name', role: 'INSTRUCTOR' },
    },
    learnerCount: 0,
    forum: { threadCount: 0, unansweredCount: 0 },
    items,
  })
}
