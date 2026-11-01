import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api'
import { Banner, PageHeading } from '@shared/components'
import { useMyCourses } from '../hooks/useDashboard'
import { CourseRow } from './CourseRow'

export function MyCoursesPage() {
  const { data, loading, error } = useMyCourses()
  return (
    <div className="space-y-5">
      <PageHeading title="My courses" subtitle="Description" />
      {error ? (
        <Banner tone="danger">{errorMessage(error)}</Banner>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : data && data.length > 0 ? (
        data.map((e) => <CourseRow key={e.enrolmentId} enrolment={e} />)
      ) : (
        <p className="text-sm text-slate-500">
          No courses yet.{' '}
          <Link to="/student/catalog" className="font-medium text-slate-900 underline">
            Browse the catalog
          </Link>
        </p>
      )}
    </div>
  )
}
