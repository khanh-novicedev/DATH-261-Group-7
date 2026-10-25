import type { ReactNode } from 'react'
import { AuthContext, MOCK_USER } from './authContextValue'

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={{ user: MOCK_USER }}>{children}</AuthContext.Provider>
}
