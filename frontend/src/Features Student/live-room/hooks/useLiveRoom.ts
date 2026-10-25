import { useEffect, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { CURRENT_USER, getMyRoom } from '../api/liveRoomApi'
import type { NoteColor, RoomMessage, WhiteboardNote } from '../types'
import { useEventQueue } from './useEventQueue'

export function useLiveRoom(sessionId: string) {
  const { data: room, loading } = useAsync(() => getMyRoom(sessionId), [sessionId])
  const [notes, setNotes] = useState<WhiteboardNote[]>([])
  const [messages, setMessages] = useState<RoomMessage[]>([])
  const [color, setColor] = useState<NoteColor>('yellow')
  const sync = useEventQueue(room?.id)

  useEffect(() => {
    if (!room) return
    setNotes(room.notes)
    setMessages(room.messages)
  }, [room])

  const addNote = () => {
    const note: WhiteboardNote = {
      id: crypto.randomUUID(),
      content: 'Content',
      posX: 24 + (notes.length % 3) * 200,
      posY: 48 + Math.floor(notes.length / 3) * 144,
      color,
      createdBy: CURRENT_USER,
    }
    setNotes((ns) => [...ns, note])
    sync.send({ kind: 'note:add', note })
  }

  const updateNote = (id: string, patch: Partial<WhiteboardNote>) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, ...patch } : n)))
    sync.send({ kind: 'note:update', id, patch })
  }

  const sendMessage = (content: string) => {
    if (!content.trim()) return
    const message: RoomMessage = { id: crypto.randomUUID(), sender: CURRENT_USER, content, isBroadcast: false, sentAt: new Date().toISOString() }
    setMessages((ms) => [...ms, message])
    sync.send({ kind: 'message:send', message })
  }

  return {
    room,
    loading,
    notes,
    messages: messages.filter((m) => !m.isBroadcast),
    broadcast: [...messages].reverse().find((m) => m.isBroadcast),
    color,
    setColor,
    addNote,
    updateNote,
    sendMessage,
    currentUserId: CURRENT_USER.id,
    sync,
  }
}
