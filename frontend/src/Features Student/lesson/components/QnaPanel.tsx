import { useState } from 'react'
import { Flag } from 'lucide-react'
import { Avatar, Button, Card, CardTitle, Input, ReportDialog } from '@shared/components'
import type { QnaPost, QnaThread } from '../types'

function timeAgo(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min} min ago`
  return `${Math.round(min / 60)} h ago`
}

export function QnaPanel({ threads, onAsk }: { threads: QnaThread[]; onAsk: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [reporting, setReporting] = useState<QnaPost | null>(null)

  return (
    <Card className="flex w-[360px] shrink-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-[18px] pb-3.5 pt-4">
        <div>
          <CardTitle>Lesson Q&amp;A</CardTitle>
          <p className="text-xs text-slate-500">Ask the instructor about this lesson</p>
        </div>
        <span className="text-xs text-slate-500">{threads.length} questions</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-[18px] py-4">
        {threads.length === 0 && <p className="text-sm text-slate-500">No questions yet.</p>}
        {threads.map((t) => (
          <div key={t.id} className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Avatar name={t.author.fullName} size={28} />
              <div className="flex-1">
                <p className="text-sm font-medium">{t.author.fullName}</p>
                <p className="text-xs text-slate-500">{timeAgo(t.createdAt)}</p>
              </div>
              <button type="button" aria-label="Report question" className="text-slate-400 hover:text-red-600" onClick={() => setReporting(t)}>
                <Flag className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-slate-700">{t.content}</p>
            {t.replies.map((r) => (
              <div key={r.id} className="space-y-1 rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-xs font-medium text-slate-900">
                  {r.author.fullName} {r.author.role === 'INSTRUCTOR' && '· Instructor'}
                </p>
                <p className="text-xs text-slate-600">{r.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-slate-100 px-4 py-3"
        onSubmit={async (e) => {
          e.preventDefault()
          await onAsk(text)
          setText('')
        }}
      >
        <Input placeholder="Ask the instructor..." value={text} onChange={(e) => setText(e.target.value)} />
        <Button type="submit" disabled={!text.trim()}>
          Send
        </Button>
      </form>

      <ReportDialog
        title="Report question"
        target={reporting && { type: 'QNA', id: reporting.id, preview: reporting.content }}
        onClose={() => setReporting(null)}
      />
    </Card>
  )
}
