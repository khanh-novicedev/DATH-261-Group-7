import { useAsync } from '@shared/hooks'
import { getDashboard, getMyCourses } from '../api/dashboardApi'

export const useDashboard = () => useAsync(getDashboard, [])
export const useMyCourses = () => useAsync(getMyCourses, [])
