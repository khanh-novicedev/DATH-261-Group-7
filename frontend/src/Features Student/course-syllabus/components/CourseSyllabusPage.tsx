import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, User, Users } from 'lucide-react'
import { errorMessage } from '@shared/api'
import { Banner, Breadcrumb, Button, Card, CardTitle, IconStat, PageHeading, ProgressBar } from '@shared/components'
import { useSyllabus } from '../hooks/useSyllabus'
import { itemRoute } from './itemRoute'
import { LessonRow } from './LessonRow'

export function CourseSyllabusPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useSyllabus(courseId)

  if (error) return <Banner tone="danger">{errorMessage(error)}</Banner>
  if (loading || !data) return <p className="text-sm text-slate-500">Loading…</p>

  const { course, items } = data
  const done = items.filter((i) => i.status === 'done').length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0
  const current = items.find((i) => i.status === 'current') ?? items.find((i) => i.status === 'todo')
  const liveCount = items.filter((i) => i.type === 'LIVE_PRACTICE').length

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'My courses', to: '/student/courses' }, { label: course.title }]} />

      <PageHeading
        title={course.title}
        subtitle={`${course.category ? `${course.category} · ` : ''}${items.length} lessons · ${liveCount} live practice`}
        actions={
          <>
            <div className="w-[180px] space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">Progress</span>
                <span>
                  {done}/{items.length} lessons · {pct}%
                </span>
              </div>
              <ProgressBar value={pct} />
            </div>
            {current && data.isEnrolled && (
              <Button onClick={() => navigate(itemRoute(course.id, current))}>Continue lesson {current.sequenceNumber}</Button>
            )}
          </>
        }
      />

      {!data.isEnrolled && (
        <Banner
          tone="warning"
          action={
            <Button size="sm" onClick={() => navigate(`/student/catalog/${course.id}`)}>
              Enrol
            </Button>
          }
        >
          You are not enrolled in this course yet.
        </Banner>
      )}

      <div className="flex gap-6">
        <Card className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 pb-1 pt-3">
            <CardTitle>Course content</CardTitle>
            <span className="text-sm text-slate-500">{items.length} lessons</span>
          </div>
          {items.length === 0 && <p className="px-4 pb-4 pt-2 text-sm text-slate-500">No lessons have been added yet.</p>}
          {items.map((item) => (
            <LessonRow key={item.lessonId} item={item} to={itemRoute(course.id, item)} />
          ))}
        </Card>

        <aside className="w-[272px] shrink-0 space-y-4">
          <Card className="space-y-3 p-5">
            <CardTitle>About this course</CardTitle>
            <p className="text-sm text-slate-600">{course.description}</p>
            <IconStat icon={BookOpen}>{items.length} lessons</IconStat>
            <IconStat icon={Users}>{liveCount} live practice</IconStat>
            <IconStat icon={User}>{data.learnerCount} students</IconStat>
          </Card>
          <Card className="space-y-2 p-5">
            <CardTitle>Course forum</CardTitle>
            <p className="text-sm text-slate-500">
              {data.forum.threadCount} threads · {data.forum.unansweredCount} unanswered
            </p>
            <Button variant="outline" fullWidth onClick={() => navigate(`/student/courses/${course.id}/forum`)}>
              Open forum
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  )
}
