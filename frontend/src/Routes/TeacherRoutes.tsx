import { Route, Routes } from 'react-router-dom'
import { TeacherDashboardPage } from '@teacher/teacher-dashboard'

export function TeacherRoutes() {
  return (
    <Routes>
      <Route path="*" element={<TeacherDashboardPage />} />
    </Routes>
  )
}

export default TeacherRoutes
