import { useRef } from 'react'
import { cn } from '@shared/utils'
import type { WhiteboardNote } from '../types'
import { noteBg } from './noteColors'

export function StickyNote({
  note,
  onChange,
}: {
  note: WhiteboardNote
  onChange: (patch: Partial<WhiteboardNote>) => void
}) {
  const start = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null)

  return (
    <div
      className={cn('absolute flex h-32 w-[168px] flex-col gap-2 rounded px-3.5 pb-3 pt-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.08)]', noteBg[note.color])}
      style={{ left: note.posX, top: note.posY }}
    >
      <textarea
        aria-label="Note content"
        className="flex-1 resize-none bg-transparent text-sm font-medium text-slate-900 focus:outline-none"
        value={note.content}
        onChange={(e) => onChange({ content: e.target.value })}
      />
      <span
        className="cursor-grab select-none text-xs font-medium text-slate-600 active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          start.current = { x: e.clientX, y: e.clientY, posX: note.posX, posY: note.posY }
        }}
        onPointerMove={(e) => {
          if (!start.current) return
          onChange({
            posX: Math.max(0, start.current.posX + e.clientX - start.current.x),
            posY: Math.max(0, start.current.posY + e.clientY - start.current.y),
          })
        }}
        onPointerUp={() => (start.current = null)}
      >
        {note.createdBy.fullName}
      </span>
    </div>
  )
}
