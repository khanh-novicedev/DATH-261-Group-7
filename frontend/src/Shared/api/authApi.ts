import { apiClient } from './client'
import type { UserRole } from '@shared/types'


export interface LoginRequest {
  email: string
  password: string
}

export interface LoginUser {
  id: string
  fullName: string
  email: string
  role: UserRole | string
}

export interface LoginResponse {
  data: {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: LoginUser
  }
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload)
  return response.data
}
