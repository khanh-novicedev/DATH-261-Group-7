import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@shared/context'
import { ProfilePage } from '@shared/components'
import { LandingPage, AuthenPage } from '@common'
import { StudentRoutes } from './StudentRoutes'
import { TeacherRoutes } from './TeacherRoutes'
import { AdminRoutes } from './AdminRoutes'
import { ProtectedRoute } from './ProtectedRoute'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }

  const role = user.role?.toUpperCase()
  switch (role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />
    case 'INSTRUCTOR':
    case 'TEACHER':
      return <Navigate to="/teacher" replace />
    case 'LEARNER':
    case 'STUDENT':
      return <Navigate to="/student" replace />
    default:
      return <Navigate to="/landing" replace />
  }
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect based on authenticated user role */}
      <Route path="/" element={<RootRedirect />} />

      {/* Common pages: Landing & Authentication */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/auth" element={<AuthenPage />} />
      <Route path="/login" element={<AuthenPage initialMode="login" />} />
      <Route path="/signup" element={<AuthenPage initialMode="signup" />} />

      {/* Shared profile page for every user role */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Student pages */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentRoutes />
          </ProtectedRoute>
        }
      />

      {/* Teacher pages */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <TeacherRoutes />
          </ProtectedRoute>
        }
      />

      {/* Admin pages */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* Unknown URLs fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default AppRoutes
