import { useNavigate } from 'react-router-dom'
import { Button, Card, ProgressBar } from '@shared/components'
import type { EnrolledCourse } from '../types'
import { progressPercent } from './courseProgress'

export function ContinueLearningCard({ enrolment }: { enrolment: EnrolledCourse }) {
  const navigate = useNavigate()
  const pct = progressPercent(enrolment)
  const { course, lastPositionLesson: lesson } = enrolment

  return (
    <Card className="flex flex-1 flex-col gap-3 p-6">
      <p className="text-xs font-medium uppercase text-slate-500">Continue learning</p>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">{course.title}</h2>
        <p className="text-sm text-slate-500">
          {lesson ? `Lesson ${lesson.sequenceNumber} · ${lesson.title}` : 'No lessons yet'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ProgressBar value={pct} height={8} />
        <span className="text-sm font-medium">{pct}%</span>
      </div>
      <div className="flex gap-3 pt-1">
        <Button
          disabled={!lesson}
          onClick={() => lesson && navigate(`/student/courses/${course.id}/lessons/${lesson.id}`)}
        >
          Continue lesson
        </Button>
        <Button variant="outline" onClick={() => navigate(`/student/courses/${course.id}`)}>
          View syllabus
        </Button>
      </div>
    </Card>
  )
}
