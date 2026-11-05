import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@shared/context'

export interface PublicRouteProps {
  redirectTo?: string
  children?: ReactNode
}

export function PublicRoute({ redirectTo, children }: PublicRouteProps) {
  const { user } = useAuth()

  if (user && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default PublicRoute
