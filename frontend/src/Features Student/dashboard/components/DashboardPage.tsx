import { Link, useNavigate } from 'react-router-dom'
import { errorMessage } from '@shared/api'
import { Banner, Button, Card, Input, PageHeading } from '@shared/components'
import { useAuth } from '@shared/context'
import { useDashboard } from '../hooks/useDashboard'
import { ContinueLearningCard } from './ContinueLearningCard'
import { CourseRow } from './CourseRow'
import { UpcomingSessionCard } from './UpcomingSessionCard'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error } = useDashboard()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeading
        title={`Welcome back, ${user?.fullName ?? ''}`}
        subtitle="Subtitle"
        actions={<Input placeholder="Search courses..." className="w-[260px]" />}
      />

      {error ? (
        <Banner tone="danger">{errorMessage(error)}</Banner>
      ) : loading || !data ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : data.inProgress.length === 0 && !data.upcomingSession ? (
        <Card className="flex flex-col items-center gap-3 p-10 text-center">
          <p className="text-lg font-semibold">You have not enrolled in any course yet</p>
          <p className="text-sm text-slate-500">Browse the catalog and enrol in a course to start learning.</p>
          <Button onClick={() => navigate('/student/catalog')}>Browse courses</Button>
        </Card>
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
