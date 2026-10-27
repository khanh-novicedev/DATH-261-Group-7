import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import UserManagementPage from '@admin/user management'
import CourseManagementPage from '@admin/course management'
import AuditLogsPage from '@admin/audit logs/AuditLogsPage'
import ReportManagementPage from '@admin/report management/ReportManagementPage'

export function AdminRoutes() {
  const navigate = useNavigate()

  const handleTabChange = (tab: string) => {
    if (tab.startsWith('User')) {
      navigate('/admin/users')
    } else if (tab.startsWith('Course')) {
      navigate('/admin/courses')
    } else if (tab.startsWith('Report')) {
      navigate('/admin/reports')
    } else if (tab.startsWith('Audit')) {
      navigate('/admin/audit-logs')
    }
  }

  return (
    <Routes>
      <Route index element={<Navigate to="users" replace />} />
      <Route path="users" element={<UserManagementPage onTabChange={handleTabChange} />} />
      <Route path="courses" element={<CourseManagementPage onTabChange={handleTabChange} />} />
      <Route path="reports" element={<ReportManagementPage onTabChange={handleTabChange} />} />
      <Route path="audit-logs" element={<AuditLogsPage onTabChange={handleTabChange} />} />
      <Route path="*" element={<Navigate to="users" replace />} />
    </Routes>
  )
}

export default AdminRoutes
