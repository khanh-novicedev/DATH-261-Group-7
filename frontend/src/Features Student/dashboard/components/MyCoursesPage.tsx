import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '@shared/api'
import { Banner, Chip, PageHeading } from '@shared/components'
import type { CompletionStatus } from '@shared/types'
import { useMyCourses } from '../hooks/useDashboard'
import { CourseRow } from './CourseRow'

const FILTERS: { label: string; status?: CompletionStatus }[] = [
  { label: 'All' },
  { label: 'In progress', status: 'IN_PROGRESS' },
  { label: 'Completed', status: 'COMPLETED' },
]

export function MyCoursesPage() {
  const [status, setStatus] = useState<CompletionStatus | undefined>()
  const { data, loading, error } = useMyCourses(status)

  return (
    <div className="space-y-5">
      <PageHeading title="My courses" subtitle="Description" />
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.label} selected={status === f.status} onClick={() => setStatus(f.status)}>
            {f.label}
          </Chip>
        ))}
      </div>
      {error ? (
        <Banner tone="danger">{errorMessage(error)}</Banner>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : data && data.length > 0 ? (
        data.map((e) => <CourseRow key={e.enrolmentId} enrolment={e} />)
      ) : status ? (
        <p className="text-sm text-slate-500">No courses here yet.</p>
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
