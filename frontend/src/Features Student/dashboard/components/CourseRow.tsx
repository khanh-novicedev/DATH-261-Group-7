import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button, ProgressBar } from '@shared/components'
import { cn } from '@shared/utils'
import type { EnrolledCourse } from '../types'
import { accentBg, progressPercent } from './courseProgress'

export function CourseRow({ enrolment }: { enrolment: EnrolledCourse }) {
  const navigate = useNavigate()
  const pct = progressPercent(enrolment)
  const { course } = enrolment

  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-slate-200 bg-white px-4 py-3.5">
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg', accentBg[enrolment.accent])}>
        <BookOpen className="h-5 w-5 text-slate-700" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium text-slate-900">{course.title}</p>
        <p className="text-xs font-medium text-slate-500">{course.instructor.fullName}</p>
      </div>
      <div className="w-[200px] space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">
            Lesson {enrolment.lastPositionLesson.sequenceNumber}/{enrolment.totalLessons}
          </span>
          <span className="text-slate-900">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>
      <Button variant="outline" onClick={() => navigate(`/student/courses/${course.id}`)}>
        Continue
      </Button>
    </div>
  )
}
