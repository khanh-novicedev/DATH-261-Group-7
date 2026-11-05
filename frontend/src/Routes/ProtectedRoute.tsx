import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@shared/context'
import type { UserRole } from '@shared/types'

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  redirectTo?: string
  children?: ReactNode
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo = '/student/dashboard',
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase()
    const isAllowed = allowedRoles.some((r) => {
      const allowed = r.toUpperCase()
      if (allowed === userRole) return true
      if ((allowed === 'TEACHER' || allowed === 'INSTRUCTOR') && (userRole === 'TEACHER' || userRole === 'INSTRUCTOR')) return true
      if ((allowed === 'STUDENT' || allowed === 'LEARNER') && (userRole === 'STUDENT' || userRole === 'LEARNER')) return true
      return false
    })

    if (!isAllowed) {
      let target = '/student/dashboard'
      if (userRole === 'ADMIN') {
        target = '/admin/users'
      } else if (userRole === 'INSTRUCTOR' || userRole === 'TEACHER') {
        target = '/teacher'
      }
      return <Navigate to={target} replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
