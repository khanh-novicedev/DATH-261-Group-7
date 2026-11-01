import { createContext, useContext } from 'react'
import type { UserSummary } from '@shared/types'

export interface AuthContextValue {
  user: UserSummary | null
  login: (accessToken: string, refreshToken: string, user: UserSummary) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}
