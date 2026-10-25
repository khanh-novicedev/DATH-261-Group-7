import { Loader2 } from 'lucide-react'
import { Button, Card } from '@shared/components'
import type { LiveSession } from '../types'

export function AssigningRooms({ session, onBack }: { session: LiveSession; onBack: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card className="flex w-full max-w-[480px] flex-col items-center gap-4 p-8 text-center">
        <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500" /> LIVE
        </span>
        <h1 className="text-2xl font-semibold">{session.title}</h1>
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <div className="space-y-1">
          <p className="font-medium">Waiting for the instructor to assign rooms</p>
          <p className="text-sm text-slate-500">You will join your breakout room automatically.</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to course
        </Button>
      </Card>
    </div>
  )
}
