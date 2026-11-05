import { useState, useCallback, type ReactNode } from 'react'
import { AuthContext } from './authContextValue'
import type { UserSummary } from '@shared/types'


function loadStoredUser(): UserSummary | null {
  try {
    const raw = localStorage.getItem('user')
    if (raw) return JSON.parse(raw) as UserSummary
  } catch {
    /* corrupted – ignore */
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSummary | null>(loadStoredUser)

  const login = useCallback(
    (accessToken: string, refreshToken: string, userData: UserSummary) => {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
