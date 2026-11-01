import { apiClient } from '@shared/api'


export interface CreateLessonPayload {
  sequenceNumber: number
  title: string
  type: 'VIDEO' | 'TEXT' | 'LIVE_PRACTICE'
  contentUrl?: string
}

export interface CreateCoursePayload {
  title: string
  description?: string
  category?: string
  prerequisites?: string
  status?: 'DRAFT' | 'PUBLISHED'
  lessons?: CreateLessonPayload[]
}

export interface CreatedLessonResponse {
  id: string
  sequenceNumber: number
  title: string
  type: 'VIDEO' | 'TEXT' | 'LIVE_PRACTICE'
  contentUrl?: string
}

export interface CourseDetailResponse {
  id: string
  instructorId?: string
  title: string
  description?: string
  category?: string
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN'
  lessons?: CreatedLessonResponse[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateCourseResponse {
  success: boolean
  message: string
  data: CourseDetailResponse
}

export async function createCourseApi(payload: CreateCoursePayload): Promise<CreateCourseResponse> {
  const response = await apiClient.post<CreateCourseResponse>('/courses', payload)
  return response.data
}
