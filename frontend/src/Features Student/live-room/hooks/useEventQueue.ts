import { useCallback, useEffect, useRef, useState } from 'react'
import { emitRoomEvent } from '../api/roomSocket'
import type { RoomEvent } from '../types'
import { useConnection } from './useConnection'

export type SyncState = 'synced' | 'syncing' | 'offline'

export function useEventQueue(roomId: string | undefined) {
  const online = useConnection()
  const queue = useRef<RoomEvent[]>([])
  const [pending, setPending] = useState(0)
  const [flushing, setFlushing] = useState(false)

  const flush = useCallback(async () => {
    if (!roomId || flushing || queue.current.length === 0) return
    setFlushing(true)
    try {
      while (queue.current.length > 0 && navigator.onLine) {
        await emitRoomEvent(roomId, queue.current[0])
        queue.current.shift()
        setPending(queue.current.length)
      }
    } finally {
      setFlushing(false)
    }
  }, [roomId, flushing])

  useEffect(() => {
    if (online) void flush()
  }, [online, flush])

  const send = useCallback(
    (event: RoomEvent) => {
      queue.current.push(event)
      setPending(queue.current.length)
      if (online) void flush()
    },
    [online, flush],
  )

  const state: SyncState = !online ? 'offline' : pending > 0 || flushing ? 'syncing' : 'synced'
  return { send, state, pending, online }
}
