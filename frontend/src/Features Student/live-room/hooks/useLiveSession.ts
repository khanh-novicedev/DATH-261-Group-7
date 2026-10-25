import { useEffect, useState } from 'react'
import { getLiveSession, resetDemoTimeline } from '../api/liveSessionApi'
import type { LiveSession } from '../types'

export function useLiveSession(sessionId: string, skipToRoom: boolean) {
  const [session, setSession] = useState<LiveSession | null>(null)

  useEffect(() => {
    resetDemoTimeline(sessionId, skipToRoom)
    let active = true
    const load = () => getLiveSession(sessionId).then((s) => active && setSession(s))
    void load()
    const t = setInterval(load, 2000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [sessionId, skipToRoom])

  return session
}
