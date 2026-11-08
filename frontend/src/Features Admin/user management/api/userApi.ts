import { apiClient } from '@shared/api'
import type { User, FilterState, UserStatus } from '../types'

export interface UserListResponse {
  data: UserListInfo
}
export interface UserListInfo {
  items: User[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export async function fetchUsers(params: FilterState = {}): Promise<UserListInfo> {
  const query: Record<string, string | number> = {}

  if (params.page !== undefined) query.page = params.page
  if (params.size !== undefined) query.size = params.size
  if (params.keyword) query.keyword = params.keyword

  if (params.role && params.role !== 'All') {
    query.role = params.role
  }
  if (params.status && params.status !== 'All') {
    query.status = params.status
  }

  const response = await apiClient.get<UserListResponse>('/users', 
    { 
      params: query, 
    }
  )

  const { items, page, size, totalElements, totalPages } = response.data.data

  return {
    items,
    page,
    size,
    totalElements,
    totalPages,
  }
}

export interface UserStatusInfo {
  id: string
  status: UserStatus
}
export async function setUserStatus(userId: string, changeToStatus: UserStatus): Promise<UserStatusInfo> {
  const response = await apiClient.patch(`/users/${userId}/status`, { status: changeToStatus })
  const {id, status} = response.data.data;
  console.log(`Change status success: ${id}, ${status}`)
  return {
    id,
    status
  }
}