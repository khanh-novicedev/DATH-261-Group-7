import { mockResponse } from '@shared/utils'
import type { CatalogCourse } from '../types'

const instructor = { id: 'u-instructor-1', fullName: 'Instructor name', role: 'INSTRUCTOR' as const }
const accents: CatalogCourse['accent'][] = ['amber', 'sky', 'emerald', 'violet', 'rose', 'teal']

const courses: CatalogCourse[] = accents.map((accent, i) => ({
  id: `c-${i + 1}`,
  title: 'Course title',
  category: `Category ${(i % 5) + 1}`,
  instructor,
  accent,
}))

export const CATEGORIES = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']

export function getPublishedCourses(): Promise<CatalogCourse[]> {
  return mockResponse(courses)
}
