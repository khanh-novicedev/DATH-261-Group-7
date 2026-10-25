import { useNavigate } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import { Button } from '@shared/components'
import type { UpcomingLiveSession } from '../types'

function formatStart(iso: string) {
  const start = new Date(iso)
  const hours = Math.max(0, Math.round((start.getTime() - Date.now()) / 3_600_000))
  const time = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${time} today · in ${hours} h`
}

export function UpcomingSessionCard({ session }: { session: UpcomingLiveSession }) {
  const navigate = useNavigate()
  return (
    <div className="flex w-[300px] shrink-0 flex-col gap-3 rounded-xl bg-slate-900 p-6">
      <p className="flex items-center gap-2 text-xs font-medium uppercase text-slate-300">
        <span className="h-2 w-2 rounded-full bg-red-500" /> Upcoming live practice
      </p>
      <h2 className="text-lg font-semibold text-white">{session.title}</h2>
      <p className="flex items-center gap-2 text-sm text-slate-300">
        <Clock className="h-4 w-4 opacity-60" /> {formatStart(session.scheduledTime)}
      </p>
      <p className="flex items-center gap-2 text-sm text-slate-300">
        <Users className="h-4 w-4 opacity-60" /> {session.learnerCount} students · {session.roomCount} rooms
      </p>
      <Button variant="outline" fullWidth className="mt-auto" onClick={() => navigate(`/student/live/${session.id}`)}>
        Join waiting room
      </Button>
    </div>
  )
}
