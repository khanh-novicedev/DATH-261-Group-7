import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiEnvelope } from './types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => Promise.reject(toApiError(error)),
)

export class ApiError extends Error {
  status: number
  code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

const FRIENDLY_MESSAGES: Record<string, string> = {
  ACCOUNT_SUSPENDED: 'This account has been suspended.',
  ALREADY_ENROLLED: 'You are already enrolled in this course.',
  COURSE_NOT_PUBLISHED: 'This course is not published yet.',
  FORBIDDEN: 'You do not have permission to do this.',
  UNAUTHORIZED: 'Please log in to continue.',
  VALIDATION_ERROR: 'Some fields are invalid.',
  COURSE_NOT_FOUND: 'Course not found.',
}

function toApiError(error: AxiosError<ApiEnvelope<unknown>>): ApiError {
  if (!error.response) {
    return new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Is the backend running?')
  }
  const { status, data } = error.response
  const code = data?.errorCode ?? (status === 403 ? 'FORBIDDEN' : status === 401 ? 'UNAUTHORIZED' : 'INTERNAL_ERROR')
  const message = FRIENDLY_MESSAGES[code] ?? data?.message ?? 'Something went wrong. Please try again.'
  return new ApiError(status, code, message)
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}

export async function unwrap<T>(request: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await request
  return data.data as T
}
