import { Flag } from 'lucide-react'
import { Avatar } from '@shared/components'
import type { ForumThread } from '../types'

function timeAgo(iso: string) {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000)
  return h < 1 ? 'Just now' : `${h} h ago`
}

export function ThreadRow({ thread, onReport }: { thread: ForumThread; onReport: () => void }) {
  return (
    <div className="flex items-center gap-3.5 border-b border-slate-100 bg-white py-4 pl-4 pr-5 last:border-b-0 hover:bg-slate-50">
      <Avatar name={thread.author.fullName} />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium text-slate-900">{thread.title}</p>
        <p className="truncate text-sm text-slate-500">{thread.preview}</p>
        <p className="text-xs text-slate-400">
          {thread.author.fullName} · {timeAgo(thread.createdAt)}
        </p>
      </div>
      <div className="w-16 text-center">
        <p className="text-lg font-semibold text-slate-900">{thread.replyCount}</p>
        <p className="text-xs text-slate-500">replies</p>
      </div>
      <button type="button" aria-label="Report thread" className="text-slate-400 hover:text-red-600" onClick={onReport}>
        <Flag className="h-4 w-4" />
      </button>
    </div>
  )
}
