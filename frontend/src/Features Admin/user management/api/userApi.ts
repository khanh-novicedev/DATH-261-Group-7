import { apiClient } from '@shared/api'
import type { User, UserRole, UserStatus } from '../types'


export interface UserListParams {
  page?: number
  size?: number
  keyword?: string
  role?: string
  status?: string
}

export interface ApiUserItem {
  id: string
  fullName: string
  email: string
  role: string
  status: string
  createdAt: string
}

export interface UserListResponse {
  data: {
    items: ApiUserItem[]
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

const API_ROLE_TO_UI: Record<string, UserRole> = {
  LEARNER: 'Student',
  STUDENT: 'Student',
  INSTRUCTOR: 'Teacher',
  TEACHER: 'Teacher',
  ADMIN: 'Admin',
}

const UI_ROLE_TO_API: Record<string, string> = {
  Student: 'LEARNER',
  Teacher: 'INSTRUCTOR',
  Admin: 'ADMIN',
}

const API_STATUS_TO_UI: Record<string, UserStatus> = {
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
}

const UI_STATUS_TO_API: Record<string, string> = {
  Active: 'ACTIVE',
  Suspended: 'SUSPENDED',
}

function mapApiUserToUser(item: ApiUserItem): User {
  const names = item.fullName.trim().split(/\s+/)
  const initials = names.length >= 2
    ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
    : (names[0]?.[0] ?? '').toUpperCase()

  return {
    id: item.id,
    name: item.fullName,
    email: item.email,
    role: API_ROLE_TO_UI[item.role?.toUpperCase()] ?? 'Student',
    status: API_STATUS_TO_UI[item.status?.toUpperCase()] ?? 'Active',
    joinedDate: formatDate(item.createdAt),
    initials,
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export async function fetchUsers(params: UserListParams = {}): Promise<{
  users: User[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}> {
  const query: Record<string, string | number> = {}

  if (params.page !== undefined) query.page = params.page
  if (params.size !== undefined) query.size = params.size
  if (params.keyword) query.keyword = params.keyword

  if (params.role && params.role !== 'All') {
    query.role = UI_ROLE_TO_API[params.role] ?? params.role
  }
  if (params.status && params.status !== 'All') {
    query.status = UI_STATUS_TO_API[params.status] ?? params.status
  }

  const response = await apiClient.get<UserListResponse>('/users', { params: query })

  const { items, page, size, totalElements, totalPages } = response.data.data

  return {
    users: items.map(mapApiUserToUser),
    page,
    size,
    totalElements,
    totalPages,
  }
}
