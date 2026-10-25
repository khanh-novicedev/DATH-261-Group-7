import { PageHeading } from '@shared/components'
import { useMyCourses } from '../hooks/useDashboard'
import { CourseRow } from './CourseRow'

export function MyCoursesPage() {
  const { data, loading } = useMyCourses()
  return (
    <div className="space-y-5">
      <PageHeading title="My courses" subtitle="Description" />
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : data?.map((e) => <CourseRow key={e.enrolmentId} enrolment={e} />)}
    </div>
  )
}
