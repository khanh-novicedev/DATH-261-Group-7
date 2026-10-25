import { useState } from 'react'
import { Send } from 'lucide-react'
import { Input } from '@shared/components'
import { cn } from '@shared/utils'
import type { RoomMessage } from '../types'

export function RoomChat({
  messages,
  currentUserId,
  onlineCount,
  onSend,
}: {
  messages: RoomMessage[]
  currentUserId: string
  onlineCount: number
  onSend: (text: string) => void
}) {
  const [text, setText] = useState('')

  return (
    <aside className="flex w-[320px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
        <h2 className="text-lg font-semibold">Group chat</h2>
        <span className="text-xs font-medium text-green-600">{onlineCount} online</span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = m.sender.id === currentUserId
          return (
            <div key={m.id} className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
              <span className="text-xs text-slate-500">{mine ? 'You' : m.sender.fullName}</span>
              <span
                className={cn(
                  'max-w-[230px] rounded-[10px] px-3 py-2 text-sm',
                  mine ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900',
                )}
              >
                {m.content}
              </span>
            </div>
          )
        })}
      </div>
      <form
        className="flex items-center gap-2 border-t border-slate-100 px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSend(text)
          setText('')
        }}
      >
        <Input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" aria-label="Send" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900">
          <Send className="h-4 w-4 text-white" />
        </button>
      </form>
    </aside>
  )
}
