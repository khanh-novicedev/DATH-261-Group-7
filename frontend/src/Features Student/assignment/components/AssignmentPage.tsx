import { useParams } from 'react-router-dom'
import { AlertTriangle, Clock, FileText } from 'lucide-react'
import { Badge, Banner, Breadcrumb, Button, Card, CardTitle, PageHeading } from '@shared/components'
import { useSubmission } from '../hooks/useSubmission'
import type { SubmissionStatus } from '../types'
import { FileDropzone } from './FileDropzone'
import { SubmissionSteps } from './SubmissionSteps'

const statusBadge: Record<SubmissionStatus, { label: string; tone: 'warning' | 'neutral' | 'success' | 'danger' }> = {
  NOT_SUBMITTED: { label: 'Not submitted', tone: 'warning' },
  SUBMITTED: { label: 'Awaiting grading', tone: 'neutral' },
  GRADED: { label: 'Graded', tone: 'success' },
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function daysLeft(iso: string) {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000))
}

export function AssignmentPage() {
  const { assignmentId = '' } = useParams()
  const s = useSubmission(assignmentId)
  const a = s.assignment

  if (s.loading || !a) return <p className="text-sm text-slate-500">Loading…</p>

  const locked = s.isLate || s.submission.status !== 'NOT_SUBMITTED'
  const overdue = s.isLate && s.submission.status === 'NOT_SUBMITTED'
  const badge = overdue ? { label: 'Overdue', tone: 'danger' as const } : statusBadge[s.submission.status]

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[{ label: a.courseTitle, to: `/student/courses/${a.courseId}` }, { label: `Lesson ${a.lessonSequence} · Assignment` }]}
      />
      <PageHeading
        title={a.title}
        subtitle={
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Due {new Date(a.deadline).toLocaleDateString()}
            {overdue ? ' · Past due' : ` · ${daysLeft(a.deadline)} days left`}
          </span>
        }
        actions={<Badge tone={badge.tone}>{badge.label}</Badge>}
      />

      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-4">
          <Card className="space-y-2.5 p-5">
            <CardTitle>Instructions</CardTitle>
            <p className="text-sm text-slate-600">{a.instructions}</p>
            <p className="text-sm font-medium text-slate-700">{a.gradingCriteria}</p>
          </Card>

          <Card className="space-y-3.5 p-5">
            <CardTitle>Submission</CardTitle>
            {overdue && (
              <Banner tone="danger" icon={AlertTriangle}>
                The due date has passed. Submissions are closed for this assignment.
              </Banner>
            )}
            {s.submission.status === 'NOT_SUBMITTED' ? (
              <>
                <FileDropzone onFile={s.pickFile} disabled={locked} />
                {s.error && <p className="text-sm text-red-600">{s.error}</p>}
                {s.file && (
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                    <FileText className="h-5 w-5 text-slate-700" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(s.file.size)} · Ready to submit</p>
                    </div>
                    <button type="button" className="text-sm font-medium text-red-600" onClick={() => s.pickFile(null)}>
                      Remove
                    </button>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button disabled={!s.file || locked || s.submitting} onClick={s.submit}>
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                <FileText className="h-5 w-5 text-slate-700" />
                <p className="flex-1 text-sm font-medium">{s.submission.fileName}</p>
                <span className="text-xs text-slate-500">Submitted</span>
              </div>
            )}
          </Card>
        </div>

        <Card className="flex w-[272px] shrink-0 flex-col gap-3.5 p-5">
          <CardTitle>Submission status</CardTitle>
          <SubmissionSteps status={s.submission.status} />
          <hr className="border-slate-200" />
          <p className="text-sm font-medium">Score and feedback</p>
          {s.submission.status === 'GRADED' ? (
            <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
              <p className="text-2xl font-bold text-slate-900">{s.submission.score}/10</p>
              <p className="text-sm text-slate-700">{s.submission.feedback}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Shown here once the instructor has graded. You will also get a notification.</p>
          )}
          <p className="mt-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-600">Submit is locked after the due date.</p>
        </Card>
      </div>
    </div>
  )
}
