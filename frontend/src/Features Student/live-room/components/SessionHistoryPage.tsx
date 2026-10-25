import { useNavigate, useParams } from 'react-router-dom'
import { CalendarClock, MessageSquare, StickyNote as StickyIcon } from 'lucide-react'
import { Banner, Breadcrumb, Button, Card, CardTitle, IconStat, PageHeading } from '@shared/components'
import { useAsync } from '@shared/hooks'
import { cn } from '@shared/utils'
import { getSessionHistory } from '../api/liveSessionApi'
import { noteBg } from './noteColors'

export function SessionHistoryPage() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const { data, loading } = useAsync(() => getSessionHistory(sessionId), [sessionId])

  if (loading || !data) return <p className="text-sm text-slate-500">Loading…</p>
  const { session } = data
  const chat = data.messages.filter((m) => !m.isBroadcast)
  const boardHeight = Math.max(...data.finalNotes.map((n) => n.posY + 128), 200) + 24

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[{ label: session.courseTitle, to: `/student/courses/${session.courseId}` }, { label: `Lesson ${session.lessonSequence} · Session history` }]}
      />
      <PageHeading
        title={session.title}
        subtitle={`${data.roomName} · Ended`}
        actions={!data.feedbackSent && <Button onClick={() => navigate(`/student/live/${sessionId}/feedback`)}>Give feedback</Button>}
      />
      {!data.feedbackSent && <Banner tone="warning">You have not sent feedback for this session yet.</Banner>}

      <div className="flex gap-6">
        <Card className="flex-1 overflow-hidden">
          <div className="px-4 pb-2 pt-3">
            <CardTitle>Final whiteboard</CardTitle>
          </div>
          <div className="relative overflow-x-auto border-t border-slate-100" style={{ height: boardHeight }}>
            {data.columns.map((col, i) => (
              <span key={col} className="absolute top-5 text-xs font-medium uppercase text-slate-500" style={{ left: 24 + i * 200 }}>
                {col}
              </span>
            ))}
            {data.finalNotes.map((n) => (
              <div
                key={n.id}
                className={cn('absolute flex h-32 w-[168px] flex-col justify-between rounded px-3.5 pb-3 pt-3.5 text-sm font-medium', noteBg[n.color])}
                style={{ left: n.posX, top: n.posY }}
              >
                <span>{n.content}</span>
                <span className="text-xs text-slate-600">{n.createdBy.fullName}</span>
              </div>
            ))}
          </div>
        </Card>

        <aside className="w-[300px] shrink-0 space-y-4">
          <Card className="space-y-3 p-5">
            <CardTitle>Session</CardTitle>
            <IconStat icon={CalendarClock}>{new Date(session.scheduledTime).toLocaleString()}</IconStat>
            <IconStat icon={StickyIcon}>{data.finalNotes.length} sticky notes</IconStat>
            <IconStat icon={MessageSquare}>{chat.length} messages</IconStat>
          </Card>
          <Card className="space-y-2.5 p-5">
            <CardTitle>Chat log</CardTitle>
            {chat.map((m) => (
              <div key={m.id} className="text-sm">
                <span className="font-medium">{m.sender.fullName}: </span>
                <span className="text-slate-600">{m.content}</span>
              </div>
            ))}
          </Card>
        </aside>
      </div>
    </div>
  )
}
