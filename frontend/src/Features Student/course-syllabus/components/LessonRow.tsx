import { Link } from 'react-router-dom'
import { Check, FileText, HelpCircle, Play, Upload, Users, Video, type LucideIcon } from 'lucide-react'
import { cn } from '@shared/utils'
import type { LessonStatus, SyllabusItem } from '../types'

function typeIcon(item: SyllabusItem): LucideIcon {
  if (item.assignment?.type === 'QUIZ') return HelpCircle
  if (item.assignment?.type === 'FILE_SUBMISSION') return Upload
  if (item.type === 'LIVE_PRACTICE') return Users
  return item.type === 'VIDEO' ? Video : FileText
}

const statusLabel: Record<LessonStatus, string> = { done: 'Completed', current: 'In progress', todo: 'Not started' }
const statusColor: Record<LessonStatus, string> = { done: 'text-green-600', current: 'text-slate-900', todo: 'text-slate-400' }

export function LessonRow({ item, to }: { item: SyllabusItem; to: string }) {
  const Icon = typeIcon(item)
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3.5 border-b border-slate-100 px-4 py-2.5 last:border-b-0 hover:bg-slate-50',
        item.status === 'current' && 'bg-slate-50',
      )}
    >
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          item.status === 'done' && 'bg-green-500',
          item.status === 'current' && 'bg-slate-900',
          item.status === 'todo' && 'border-[1.5px] border-slate-300',
        )}
      >
        {item.status === 'done' && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        {item.status === 'current' && <Play className="h-2.5 w-2.5 fill-white text-white" />}
      </span>
      <Icon className="h-5 w-5 shrink-0 text-slate-700" />
      <span className="min-w-0 flex-1">
        <span className={cn('block text-sm text-slate-900', item.status === 'current' ? 'font-semibold' : 'font-medium')}>
          Lesson {item.sequenceNumber} · {item.title}
        </span>
        <span className="block text-xs font-medium text-slate-500">{item.meta}</span>
      </span>
      <span className={cn('text-xs font-medium', statusColor[item.status])}>{statusLabel[item.status]}</span>
    </Link>
  )
}
