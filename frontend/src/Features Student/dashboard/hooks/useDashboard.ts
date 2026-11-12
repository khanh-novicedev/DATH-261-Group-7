import { useAsync } from '@shared/hooks'
import type { CompletionStatus } from '@shared/types'
import { getDashboard, getMyCourses } from '../api/dashboardApi'

export const useDashboard = () => useAsync(getDashboard, [])
export const useMyCourses = (status?: CompletionStatus) => useAsync(() => getMyCourses(status), [status])
