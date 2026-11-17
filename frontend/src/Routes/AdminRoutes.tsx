import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@shared/layouts'
import UserManagementPage from '@admin/user management'
import CourseManagementPage from '@admin/course management'
import AuditLogsPage from '@admin/audit logs/AuditLogsPage'
import ReportManagementPage from '@admin/report management/ReportManagementPage'

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="courses" element={<CourseManagementPage />} />
        <Route path="reports" element={<ReportManagementPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="users" replace />} />
    </Routes>
  )
}

export default AdminRoutes
