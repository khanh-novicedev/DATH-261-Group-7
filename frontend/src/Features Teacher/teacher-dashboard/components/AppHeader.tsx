import { Header } from '@shared/layouts'

export interface AppHeaderProps {
  active?: 'dashboard' | 'courses' | 'qa-reports'
  userName?: string
  onDashboard?: () => void
  onMyCourses?: () => void
  onQAReports?: () => void
}

export function AppHeader({
  active = 'dashboard',
  onDashboard,
  onMyCourses,
  onQAReports,
}: AppHeaderProps) {
  const handleTabChange = (label: string) => {
    const lower = label.toLowerCase()
    if (lower.includes('dash')) {
      onDashboard?.()
    } else if (lower.includes('course')) {
      onMyCourses?.()
    } else if (lower.includes('report') || lower.includes('q&a')) {
      onQAReports?.()
    }
  }

  const activeLabel =
    active === 'dashboard'
      ? 'Dashboard'
      : active === 'qa-reports'
      ? 'Q&A / Reports'
      : 'My Courses'

  return <Header activeTab={activeLabel} onTabChange={handleTabChange} />
}

export default AppHeader
