import { useCallback, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useLiveSession } from '../hooks/useLiveSession'
import { AssigningRooms } from './AssigningRooms'
import { BreakoutRoom } from './BreakoutRoom'
import { WaitingRoom } from './WaitingRoom'

export function LiveRoomPage() {
  const { sessionId = '' } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const session = useLiveSession(sessionId, params.get('demo') === 'room')

  const back = () => navigate(session ? `/student/courses/${session.courseId}` : '/student/courses')
  const leave = useCallback(() => navigate(`/student/live/${sessionId}/feedback`), [navigate, sessionId])

  useEffect(() => {
    if (session?.status === 'COMPLETED') navigate(`/student/live/${sessionId}/history`, { replace: true })
  }, [session?.status, navigate, sessionId])

  if (!session) return <p className="p-6 text-sm text-slate-500">Loading session…</p>
  if (session.status === 'SCHEDULED') return <WaitingRoom session={session} onBack={back} />
  if (session.status === 'ONGOING' && !session.myRoomId) return <AssigningRooms session={session} onBack={back} />
  if (session.status === 'ONGOING') return <BreakoutRoom sessionId={sessionId} onLeave={leave} />
  return null
}
