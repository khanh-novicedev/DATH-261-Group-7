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

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    let target = '/student/dashboard'
    if (user.role === 'ADMIN') {
      target = '/admin/users'
    } else if (user.role === 'TEACHER') {
      target = '/teacher/dashboard'
    }
    return <Navigate to={target} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
