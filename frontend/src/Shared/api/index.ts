export { apiClient, ApiError, errorMessage } from './client'
export { reportContent, type ReportInput, type ReportedEntityType } from './reportApi'
export {
  loginApi,
  logoutApi,
  registerApi,
  type LoginRequest,
  type LoginResponse,
  type LoginUser,
  type RegisterRequest,
  type RegisterResponse,
  type RegisterUser,
  type RegisterRole,
} from './authApi'
export {
  createCourseApi,
  type CreateCoursePayload,
  type CreateCourseResponse,
  type CreateLessonPayload,
  type CourseDetailResponse,
  type CreatedLessonResponse,
} from '@teacher/teacher-dashboard/api/courseApi'
export { getCatalog, getCourse, enrol, getMyEnrolments, findMyEnrolment, type CatalogQuery, type CourseStatusInfo, updateCourseStatus } from './courseApi'
export type * from './types'
