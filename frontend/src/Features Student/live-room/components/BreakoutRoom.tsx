import { useEffect } from 'react'
import { Clock, Megaphone, Plus, WifiOff } from 'lucide-react'
import { Avatar, Button } from '@shared/components'
import { cn } from '@shared/utils'
import { useCountdown } from '@shared/hooks'
import { useLiveRoom } from '../hooks/useLiveRoom'
import { NOTE_COLORS, noteBg } from './noteColors'
import { RoomChat } from './RoomChat'
import { StickyNote } from './StickyNote'

const syncLabel = { synced: 'Synced', syncing: 'Syncing…', offline: 'Offline' } as const

export function BreakoutRoom({ sessionId, onLeave }: { sessionId: string; onLeave: () => void }) {
  const live = useLiveRoom(sessionId)
  const timer = useCountdown(live.room?.endsAt)

  useEffect(() => {
    if (timer.ended) onLeave()
  }, [timer.ended, onLeave])

  if (live.loading || !live.room) return <p className="p-6 text-sm text-slate-500">Joining room…</p>
  const { room } = live

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-header px-6 py-3">
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" /> LIVE
          </span>
          <div>
            <p className="text-sm font-medium">{room.sessionTitle}</p>
            <p className="text-xs text-slate-500">
              {room.name} · {room.participants.length} members · {room.courseTitle}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium">
          <Clock className="h-4 w-4" /> {timer.label} left
        </span>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            {room.participants.map((p) => (
              <Avatar key={p.id} name={p.fullName} size={32} className="ring-2 ring-white" />
            ))}
          </div>
          <Button variant="outline" onClick={onLeave}>
            Leave room
          </Button>
        </div>
      </header>

      {!live.sync.online && (
        <div role="alert" className="flex items-center gap-2.5 border-b border-red-200 bg-red-50 px-6 py-2.5 text-sm text-red-700">
          <WifiOff className="h-[18px] w-[18px]" />
          <span className="font-medium">Connection lost. Reconnecting…</span>
          Your changes are kept on this device and will sync when you are back online
          {live.sync.pending > 0 && ` (${live.sync.pending} pending)`}.
        </div>
      )}

      {live.broadcast && (
        <div className="flex items-center gap-2.5 border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-900">
          <Megaphone className="h-[18px] w-[18px]" />
          <span className="font-medium">{live.broadcast.sender.fullName}:</span> {live.broadcast.content}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col gap-3 py-4 pl-6 pr-4">
          <div className="flex w-fit items-center gap-3 rounded-[10px] border border-slate-200 bg-white py-1.5 pl-2 pr-3.5">
            <Button size="sm" onClick={live.addNote}>
              <Plus className="h-4 w-4" /> Add sticky note
            </Button>
            {NOTE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`${c} note`}
                onClick={() => live.setColor(c)}
                className={cn('h-5 w-5 rounded-full', noteBg[c], live.color === c && 'ring-2 ring-slate-900')}
              />
            ))}
            <span className="h-5 w-px bg-slate-200" />
            <span className={cn('text-xs', live.sync.state === 'offline' ? 'font-medium text-red-600' : 'text-slate-500')}>
              {syncLabel[live.sync.state]}
            </span>
          </div>

          <div className="relative flex-1 overflow-auto rounded-xl border border-slate-200 bg-white">
            {room.columns.map((col, i) => (
              <span key={col} className="absolute top-5 text-xs font-medium uppercase text-slate-500" style={{ left: 24 + i * 200 }}>
                {col}
              </span>
            ))}
            {live.notes.map((n) => (
              <StickyNote key={n.id} note={n} onChange={(patch) => live.updateNote(n.id, patch)} />
            ))}
          </div>
        </section>

        <RoomChat
          messages={live.messages}
          currentUserId={live.currentUserId}
          onlineCount={room.participants.length}
          onSend={live.sendMessage}
        />
      </div>
    </div>
  )
}
