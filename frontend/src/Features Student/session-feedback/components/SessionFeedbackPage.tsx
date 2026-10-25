import { useNavigate, useParams } from 'react-router-dom'
import { Check, Clock, MessageSquare, StickyNote, Users } from 'lucide-react'
import { Breadcrumb, Button, Card, CardTitle, Chip, IconStat, Textarea } from '@shared/components'
import { useSessionFeedback } from '../hooks/useSessionFeedback'
import type { Participation } from '../types'
import { StarRating } from './StarRating'

const PARTICIPATION: { value: Participation; label: string }[] = [
  { value: 'LOW', label: 'Option 1' },
  { value: 'MEDIUM', label: 'Option 2' },
  { value: 'HIGH', label: 'Option 3' },
]

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export function SessionFeedbackPage() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const f = useSessionFeedback(sessionId)
  const s = f.summary

  if (f.loading || !s) return <p className="text-sm text-slate-500">Loading…</p>

  const minutes = Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 60_000)
  const back = () => navigate(`/student/courses/${s.courseId}`)

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: s.courseTitle, to: `/student/courses/${s.courseId}` }, { label: `Lesson ${s.lessonSequence} · Live practice` }]} />

      <div className="flex items-center gap-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
          <Check className="h-[22px] w-[22px] text-green-600" strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold">Live practice has ended</h1>
          <p className="text-sm text-slate-500">Take a minute to share feedback for the instructor.</p>
        </div>
      </div>

      <div className="flex gap-6">
        <Card className="flex flex-1 flex-col gap-5 p-6">
          {f.status === 'sent' ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
              <p className="text-lg font-semibold">Thanks for your feedback!</p>
              <Button onClick={back}>Back to course</Button>
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                <p className="text-sm font-medium">How would you rate this session?</p>
                <StarRating value={f.rating} onChange={f.setRating} />
              </div>
              <div className="space-y-2.5">
                <p className="text-sm font-medium">How actively did you participate?</p>
                <div className="flex gap-2">
                  {PARTICIPATION.map((p) => (
                    <Chip key={p.value} selected={f.participation === p.value} onClick={() => f.setParticipation(p.value)}>
                      {p.label}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="feedback-comment" className="text-sm font-medium">
                  What did you learn, or what could be better?
                </label>
                <Textarea id="feedback-comment" placeholder="Content" value={f.comment} onChange={(e) => f.setComment(e.target.value)} />
                <p className="text-xs text-slate-500">Only the instructor can see your feedback.</p>
              </div>
              <div className="mt-auto flex justify-end gap-3">
                <Button variant="outline" onClick={back}>
                  Skip
                </Button>
                <Button disabled={f.rating === 0 || f.status === 'sending'} onClick={f.submit}>
                  Send feedback
                </Button>
              </div>
            </>
          )}
        </Card>

        <Card className="flex w-[300px] shrink-0 flex-col gap-3.5 p-5">
          <CardTitle>Session summary</CardTitle>
          <IconStat icon={Clock}>
            {minutes} min · {time(s.startedAt)} – {time(s.endedAt)}
          </IconStat>
          <IconStat icon={Users}>
            {s.roomName} · {s.memberCount} members
          </IconStat>
          <IconStat icon={StickyNote}>{s.noteCount} sticky notes</IconStat>
          <IconStat icon={MessageSquare}>{s.messageCount} messages</IconStat>
          <hr className="border-slate-200" />
          <p className="text-sm font-medium">Final whiteboard</p>
          {s.finalWhiteboardUrl ? (
            <img src={s.finalWhiteboardUrl} alt="Final whiteboard" className="h-[130px] w-full rounded-lg border border-slate-200 object-cover" />
          ) : (
            <div className="grid h-[130px] grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              {['bg-yellow-200', 'bg-sky-200', 'bg-green-200', 'bg-yellow-200', 'bg-sky-200', 'bg-green-200'].map((c, i) => (
                <span key={i} className={`rounded-[3px] ${c}`} />
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500">Saved to the course's session history.</p>
          <Button variant="outline" fullWidth onClick={() => navigate(`/student/live/${sessionId}/history`)}>
            View session history
          </Button>
        </Card>
      </div>
    </div>
  )
}
