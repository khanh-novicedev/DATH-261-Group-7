import { Link } from 'react-router-dom'
import { Input, PageHeading } from '@shared/components'
import { useAuth } from '@shared/context'
import { useDashboard } from '../hooks/useDashboard'
import { ContinueLearningCard } from './ContinueLearningCard'
import { CourseRow } from './CourseRow'
import { UpcomingSessionCard } from './UpcomingSessionCard'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, loading } = useDashboard()

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Welcome back, ${user?.fullName ?? ''}`}
        subtitle="Subtitle"
        actions={<Input placeholder="Search courses..." className="w-[260px]" />}
      />

      {loading || !data ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <>
          <section className="flex gap-5">
            {data.continueLearning && <ContinueLearningCard enrolment={data.continueLearning} />}
            {data.upcomingSession && <UpcomingSessionCard session={data.upcomingSession} />}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">In progress</h2>
              <Link to="/student/courses" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                View all →
              </Link>
            </div>
            {data.inProgress.map((e) => (
              <CourseRow key={e.enrolmentId} enrolment={e} />
            ))}
          </section>
        </>
      )}
    </div>
  )
}
