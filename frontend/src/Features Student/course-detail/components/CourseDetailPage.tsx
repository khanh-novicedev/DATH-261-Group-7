import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, CheckCircle2, FileText, HelpCircle, Lock, Upload, User, Users, Video, type LucideIcon } from 'lucide-react'
import { Badge, Breadcrumb, Button, Card, CardTitle, Dialog, IconStat } from '@shared/components'
import { cn } from '@shared/utils'
import { useCourseDetail } from '../hooks/useCourseDetail'
import type { CourseDetail, CourseOutlineItem } from '../types'

const accentBg: Record<CourseDetail['accent'], string> = {
  amber: 'bg-amber-200',
  sky: 'bg-sky-200',
  emerald: 'bg-emerald-200',
  violet: 'bg-violet-200',
  rose: 'bg-rose-200',
  teal: 'bg-teal-200',
}

function outlineIcon(item: CourseOutlineItem): LucideIcon {
  if (item.assignmentType === 'QUIZ') return HelpCircle
  if (item.assignmentType === 'FILE_SUBMISSION') return Upload
  if (item.type === 'LIVE_PRACTICE') return Users
  return item.type === 'VIDEO' ? Video : FileText
}

function outlineLabel(item: CourseOutlineItem) {
  if (item.assignmentType === 'QUIZ') return 'Quiz'
  if (item.assignmentType === 'FILE_SUBMISSION') return 'Assignment'
  if (item.type === 'LIVE_PRACTICE') return 'Live practice'
  return item.type === 'VIDEO' ? 'Video' : 'Document'
}

export function CourseDetailPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const d = useCourseDetail(courseId)
  const c = d.course

  if (d.loading || !c) return <p className="text-sm text-slate-500">Loading…</p>

  const liveCount = c.outline.filter((i) => i.type === 'LIVE_PRACTICE').length
  const goToCourse = () => navigate(`/student/courses/${c.id}`)

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'Course Catalog', to: '/student/catalog' }, { label: c.title }]} />

      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex gap-5">
            <div className={cn('h-[132px] w-[200px] shrink-0 rounded-xl', accentBg[c.accent])} />
            <div className="space-y-2">
              {c.category && <Badge>{c.category}</Badge>}
              <h1 className="text-2xl font-semibold text-slate-900">{c.title}</h1>
              <p className="text-sm text-slate-500">With {c.instructor.fullName}</p>
              <p className="text-sm text-slate-600">{c.description}</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 pb-1 pt-3">
              <CardTitle>Course content</CardTitle>
              <span className="text-sm text-slate-500">{c.outline.length} lessons</span>
            </div>
            {c.outline.map((item) => {
              const Icon = outlineIcon(item)
              return (
                <div key={item.sequenceNumber} className="flex items-center gap-3.5 border-b border-slate-100 px-4 py-2.5 last:border-b-0">
                  <Icon className="h-5 w-5 text-slate-700" />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-900">
                      Lesson {item.sequenceNumber} · {item.title}
                    </span>
                    <span className="block text-xs font-medium text-slate-500">{outlineLabel(item)}</span>
                  </span>
                  {!d.isEnrolled && <Lock className="h-4 w-4 text-slate-400" aria-label="Enrol to unlock" />}
                </div>
              )
            })}
          </Card>
        </div>

        <aside className="w-[272px] shrink-0">
          <Card className="space-y-3 p-5">
            <CardTitle>Free course</CardTitle>
            <IconStat icon={BookOpen}>{c.outline.length} lessons</IconStat>
            <IconStat icon={Users}>{liveCount} live practice</IconStat>
            <IconStat icon={User}>{c.learnerCount} students</IconStat>
            {d.isEnrolled ? (
              <>
                <p className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle2 className="h-4 w-4" /> You are enrolled
                </p>
                <Button fullWidth onClick={goToCourse}>
                  Go to course
                </Button>
              </>
            ) : (
              <Button fullWidth disabled={d.enrolling} onClick={d.enrol}>
                {d.enrolling ? 'Enrolling…' : 'Enrol in course'}
              </Button>
            )}
          </Card>
        </aside>
      </div>

      <Dialog
        open={d.justEnrolled}
        onClose={d.dismissSuccess}
        title="You're enrolled!"
        description="The course has been added to My Courses."
        footer={
          <>
            <Button variant="outline" onClick={d.dismissSuccess}>
              Stay here
            </Button>
            <Button onClick={goToCourse}>Start learning</Button>
          </>
        }
      />
    </div>
  )
}
