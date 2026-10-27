import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@shared/context'
import { ProfilePage } from '@shared/components'
import { LandingPage, AuthenPage } from '@common'
import { StudentRoutes } from './StudentRoutes'
import { TeacherRoutes } from './TeacherRoutes'
import { AdminRoutes } from './AdminRoutes'

function RootRedirect() {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/landing" replace />
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />
    case 'TEACHER':
      return <Navigate to="/teacher" replace />
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
      <Route path="/student/*" element={<StudentRoutes />} />

      {/* Teacher pages */}
      <Route path="/teacher/*" element={<TeacherRoutes />} />

      {/* Admin pages */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Unknown URLs fallback */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default AppRoutes
