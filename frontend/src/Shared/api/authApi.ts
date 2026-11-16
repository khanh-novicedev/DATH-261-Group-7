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

export async function logoutApi(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken })
}

export type RegisterRole = 'LEARNER' | 'INSTRUCTOR'

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  role: RegisterRole
}

export interface RegisterUser {
  id: string
  fullName: string
  email: string
  role: UserRole | string
  status: string
}

export interface RegisterResponse {
  data: RegisterUser
}

export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/auth/register', payload)
  return response.data
}
