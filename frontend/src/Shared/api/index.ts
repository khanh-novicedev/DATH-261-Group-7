export { apiClient, ApiError, errorMessage } from './client'
export { reportContent, type ReportInput, type ReportedEntityType } from './reportApi'
export { loginApi, type LoginRequest, type LoginResponse, type LoginUser } from './authApi'
export {
  createCourseApi,
  type CreateCoursePayload,
  type CreateCourseResponse,
  type CreateLessonPayload,
  type CourseDetailResponse,
  type CreatedLessonResponse,
} from '@teacher/teacher-dashboard/api/courseApi'
export { getCatalog, getCourse, enrol, getMyEnrolments, type CatalogQuery } from './courseApi'
export type * from './types'
