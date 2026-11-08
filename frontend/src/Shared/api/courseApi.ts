import { apiClient, unwrap } from './client'
import type { CourseCatalogItem, CourseDto, EnrolResult, EnrolmentDto, PageResponse } from './types'
import type { CourseStatus } from '@shared/types'

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

type RawEnrolment = Partial<EnrolmentDto> & {
  enrolmentId?: string
  course?: { id?: string; title?: string }
  courseName?: string
  lastPositionLesson?: { id?: string } | null
}

function normalizeEnrolment(raw: RawEnrolment): EnrolmentDto {
  return {
    id: raw.id ?? raw.enrolmentId ?? '',
    courseId: raw.courseId ?? raw.course?.id ?? '',
    courseTitle: raw.courseTitle ?? raw.course?.title ?? raw.courseName ?? '',
    completionStatus: raw.completionStatus ?? 'IN_PROGRESS',
    lastPositionLessonId: raw.lastPositionLessonId ?? raw.lastPositionLesson?.id ?? null,
    enrolledAt: raw.enrolledAt ?? '',
    completedLessons: raw.completedLessons,
    totalLessons: raw.totalLessons,
  }
}

export async function getMyEnrolments(): Promise<EnrolmentDto[]> {
  const list = await unwrap<RawEnrolment[] | null>(apiClient.get('/enrolments'))
  return (list ?? []).map(normalizeEnrolment).filter((e) => e.courseId)
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