import { mockResponse } from '@shared/utils'
import type { FileAssignment, Submission } from '../types'

export function getAssignment(id: string): Promise<FileAssignment> {
  return mockResponse({
    id,
    title: 'Assignment title',
    instructions: 'Content',
    gradingCriteria: 'Grading criteria',
    deadline: new Date(Date.now() + (id === 'a-overdue' ? -2 : 9) * 24 * 3_600_000).toISOString(),
    courseId: 'c-1',
    courseTitle: 'Course title',
    lessonSequence: 6,
  })
}

export function getMySubmission(id: string): Promise<Submission> {
  if (id === 'a-graded') {
    return mockResponse({
      status: 'GRADED' as const,
      fileName: 'file-name.pdf',
      submittedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
      score: 8,
      feedback: 'Feedback',
    })
  }
  return mockResponse({ status: 'NOT_SUBMITTED' as const })
}

export function submitFile(id: string, file: File): Promise<Submission> {
  void id
  return mockResponse({ status: 'SUBMITTED' as const, fileName: file.name, submittedAt: new Date().toISOString() }, 400)
}
