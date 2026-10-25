import { Clock, MessageSquare, StickyNote, Users } from 'lucide-react'
import { Button, Card, CardTitle, IconStat } from '@shared/components'
import { useCountdown } from '@shared/hooks'
import type { LiveSession } from '../types'

export function WaitingRoom({ session, onBack }: { session: LiveSession; onBack: () => void }) {
  const timer = useCountdown(session.scheduledTime)
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card className="flex w-full max-w-[480px] flex-col items-center gap-5 p-8 text-center">
        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          <Clock className="h-3.5 w-3.5" /> Waiting room
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{session.title}</h1>
          <p className="text-sm text-slate-500">
            {session.courseTitle} · Lesson {session.lessonSequence} · Live practice
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Starts in</p>
          <p className="text-5xl font-bold tabular-nums text-slate-900" aria-live="polite">
            {timer.label}
          </p>
        </div>
        <div className="w-full space-y-2.5 rounded-lg bg-slate-50 p-4 text-left">
          <CardTitle className="text-sm">In the session</CardTitle>
          <IconStat icon={Users}>The instructor splits the class into small rooms</IconStat>
          <IconStat icon={MessageSquare}>Text chat with your room</IconStat>
          <IconStat icon={StickyNote}>Shared sticky-note whiteboard</IconStat>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to course
        </Button>
      </Card>
    </div>
  )
}
