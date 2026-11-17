export interface NavItem {
  label: string
  to: string
  activePrefixes?: string[]
}

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Course Catalog', to: '/student/catalog' },
  {
    label: 'My Courses',
    to: '/student/courses',
    activePrefixes: ['/student/quiz', '/student/assignments', '/student/live'],
  },
]

export const TEACHER_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/teacher/dashboard' },
  { label: 'My Courses', to: '/teacher/courses' },
  { label: 'Q&A / Reports', to: '/teacher/qa-reports' },
]

export const ADMIN_NAV: NavItem[] = [
  { label: 'User Management', to: '/admin/users' },
  { label: 'Course Management', to: '/admin/courses' },
  { label: 'Report Management', to: '/admin/reports' },
  { label: 'Audit Logs', to: '/admin/audit-logs' },
]
