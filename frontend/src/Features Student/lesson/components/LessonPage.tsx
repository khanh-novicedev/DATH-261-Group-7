import { useNavigate, useParams } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { Breadcrumb, Button } from '@shared/components'
import { useLesson } from '../hooks/useLesson'
import { CourseCompletedDialog } from './CourseCompletedDialog'
import { QnaPanel } from './QnaPanel'

export function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const l = useLesson(courseId, lessonId)
  const lesson = l.lesson

  if (l.loading || !lesson) return <p className="text-sm text-slate-500">Loading…</p>

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: lesson.courseTitle, to: `/student/courses/${lesson.courseId}` },
          { label: `Lesson ${lesson.sequenceNumber} · ${lesson.title}` },
        ]}
      />

      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-3.5">
          <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-xl bg-slate-900">
            {lesson.contentUrl && lesson.type === 'VIDEO' ? (
              <video src={lesson.contentUrl} controls className="h-full w-full" />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                <Play className="h-5 w-5 fill-slate-900 text-slate-900" />
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold">
            Lesson {lesson.sequenceNumber} · {lesson.title}
          </h1>
          <p className="text-sm text-slate-600">{lesson.description}</p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={!lesson.previousLessonId}
              onClick={() => navigate(`/student/courses/${lesson.courseId}/lessons/${lesson.previousLessonId}`)}
            >
              ← Previous
            </Button>
            <Button className="ml-auto" variant={l.completed ? 'outline' : 'default'} disabled={l.completed} onClick={l.complete}>
              {l.completed ? (
                <>
                  <Check className="h-4 w-4" /> Completed
                </>
              ) : (
                'Mark as complete'
              )}
            </Button>
            {lesson.nextRoute && (
              <Button variant={l.completed ? 'default' : 'outline'} onClick={() => navigate(lesson.nextRoute!)}>
                Next lesson →
              </Button>
            )}
          </div>
        </div>

        <QnaPanel threads={l.threads} onAsk={l.ask} />
      </div>

      <CourseCompletedDialog open={l.courseCompleted} courseId={lesson.courseId} onClose={l.dismissCourseCompleted} />
    </div>
  )
}
