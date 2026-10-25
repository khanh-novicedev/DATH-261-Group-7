import { createContext, useContext } from 'react'
import type { UserSummary } from '@shared/types'

export interface AuthContextValue {
  user: UserSummary | null
}

export const MOCK_USER: UserSummary = { id: 'u-learner-1', fullName: 'User name', role: 'LEARNER' }

export const AuthContext = createContext<AuthContextValue>({ user: MOCK_USER })

export function useAuth() {
  return useContext(AuthContext)
}
