import { useState } from 'react'
import { useAsync } from '@shared/hooks'
import { getSessionSummary, sendFeedback } from '../api/feedbackApi'
import type { Participation } from '../types'

export function useSessionFeedback(sessionId: string) {
  const summary = useAsync(() => getSessionSummary(sessionId), [sessionId])
  const [rating, setRating] = useState(0)
  const [participation, setParticipation] = useState<Participation | null>(null)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function submit() {
    setStatus('sending')
    await sendFeedback({ sessionId, rating, participation, comment })
    setStatus('sent')
  }

  return { summary: summary.data, loading: summary.loading, rating, setRating, participation, setParticipation, comment, setComment, status, submit }
}
