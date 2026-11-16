import { ApiError, apiClient, unwrap } from './client'
import type { CourseCatalogItem, CourseDto, CourseProgressDto, EnrolResult, EnrolmentDto, PageResponse } from './types'
import type { CompletionStatus, CourseStatus } from '@shared/types'

export interface CatalogQuery {
  keyword?: string
  category?: string | null
  status?: CourseStatus
  mine?: boolean
  page?: number
  size?: number
}

export function getCatalog(query: CatalogQuery = {}): Promise<PageResponse<CourseCatalogItem>> {
  return unwrap(
    apiClient.get('/courses', {
      params: {
        keyword: query.keyword || undefined,
        category: query.category || undefined,
        status: query.status,
        mine: query.mine || undefined,
        page: query.page ?? 0,
        size: query.size ?? 50,
      },
    }),
  )
}

export function getCourse(courseId: string): Promise<CourseDto> {
  return unwrap(apiClient.get(`/courses/${courseId}`))
}

export function enrol(courseId: string): Promise<EnrolResult> {
  return unwrap(apiClient.post(`/courses/${courseId}/enrolment`))
}

const MAX_PAGE_SIZE = 100

export async function getMyEnrolments(status?: CompletionStatus): Promise<EnrolmentDto[]> {
  const data = await unwrap<PageResponse<EnrolmentDto> | EnrolmentDto[]>(
    apiClient.get('/enrolments', { params: { status, size: MAX_PAGE_SIZE } }),
  )
  if (!Array.isArray(data)) return data.items
  return status ? data.filter((e) => e.completionStatus === status) : data
}

export async function findMyEnrolment(courseId: string): Promise<EnrolmentDto | undefined> {
  const enrolments = await getMyEnrolments()
  return enrolments.find((e) => e.course.id === courseId)
}

const NOT_ENROLLED_CODES = ['NOT_ENROLLED', 'ENROLMENT_NOT_FOUND']

export function getCourseProgress(courseId: string): Promise<CourseProgressDto> {
  return unwrap(apiClient.get(`/courses/${courseId}/progress`))
}

export async function findMyCourseProgress(courseId: string): Promise<CourseProgressDto | undefined> {
  try {
    return await getCourseProgress(courseId)
  } catch (error) {
    if (error instanceof ApiError && NOT_ENROLLED_CODES.includes(error.code)) return undefined
    throw error
  }
}

export interface CourseStatusInfo {
  id: string
  status: CourseStatus
}

export async function updateCourseStatus(
  courseId: string,
  status: CourseStatus,
): Promise<CourseStatusInfo> {
  const response = await apiClient.patch(
    `/courses/${courseId}/status`,
    { status },
  )
  return response.data.data as CourseStatusInfo
}