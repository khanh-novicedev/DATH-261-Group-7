import { useState, type ReactNode } from 'react'
import type { UserSummary } from '@shared/types'
import { AuthContext } from './authContextValue'

function getStoredUser(): UserSummary | null {
  const token = localStorage.getItem('accessToken')
  const storedUser = localStorage.getItem('authUser')
  if (!token || !storedUser) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
    return null
  }

  try {
    const user: UserSummary = JSON.parse(storedUser)
    if (
      typeof user.id === 'string' &&
      typeof user.fullName === 'string' &&
      ['ADMIN', 'TEACHER', 'STUDENT'].includes(user.role)
    ) {
      return user
    }
  } catch {
    // Clear invalid persisted auth data below.
  }

  localStorage.removeItem('accessToken')
  localStorage.removeItem('authUser')
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(getStoredUser)

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
