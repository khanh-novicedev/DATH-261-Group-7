export { apiClient, ApiError, errorMessage, unwrap } from './client'
export { getLessonQna, askQuestion } from './qnaApi'
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
export { getCatalog, getCourse, enrol, getMyEnrolments, findMyEnrolment, getCourseProgress, findMyCourseProgress, type CatalogQuery, type CourseStatusInfo, updateCourseStatus } from './courseApi'
export type * from './types'
