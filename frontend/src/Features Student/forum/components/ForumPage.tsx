import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Flag, HelpCircle, MessageSquare, Users } from 'lucide-react'
import { Breadcrumb, Button, Card, CardTitle, Chip, IconStat, Input, PageHeading, ReportDialog, type ReportTarget } from '@shared/components'
import { cn } from '@shared/utils'
import { useForum } from '../hooks/useForum'
import type { ForumTab } from '../types'
import { NewThreadDialog } from './NewThreadDialog'
import { ThreadRow } from './ThreadRow'

const TABS: { value: ForumTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unanswered', label: 'Unanswered' },
  { value: 'mine', label: 'My threads' },
]

export function ForumPage() {
  const { courseId = '' } = useParams()
  const f = useForum(courseId)
  const [creating, setCreating] = useState(false)
  const [reporting, setReporting] = useState<ReportTarget | null>(null)
  const o = f.overview

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: o?.courseTitle ?? 'Course title', to: `/student/courses/${courseId}` }, { label: 'Forum' }]} />
      <PageHeading title="Course forum" subtitle="Description" actions={<Button onClick={() => setCreating(true)}>+ New thread</Button>} />

      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <Chip key={t.value} selected={f.tab === t.value} onClick={() => f.setTab(t.value)}>
              {t.label}
            </Chip>
          ))}
        </div>
        <Input className="ml-auto w-[280px]" placeholder="Search threads..." value={f.query} onChange={(e) => f.setQuery(e.target.value)} />
      </div>

      <div className="flex gap-6">
        <Card className="flex-1 overflow-hidden">
          {f.loading ? (
            <p className="p-4 text-sm text-slate-500">Loading…</p>
          ) : f.visible.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">No threads here yet.</p>
          ) : (
            f.visible.map((t) => (
              <ThreadRow key={t.id} thread={t} onReport={() => setReporting({ type: 'FORUM_THREAD', id: t.id, preview: t.title })} />
            ))
          )}
          <nav aria-label="Pagination" className="flex justify-center py-3">
            <div className="flex rounded-md border border-slate-200 p-1">
              {Array.from({ length: f.pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => f.setPage(p)}
                  className={cn('rounded px-3 py-1.5 text-sm font-medium', p === f.page ? 'bg-slate-100' : 'hover:bg-slate-50')}
                >
                  Page {p}
                </button>
              ))}
              <button
                type="button"
                disabled={f.page === f.pageCount}
                onClick={() => f.setPage(f.page + 1)}
                className="rounded px-3 py-1.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </nav>
        </Card>

        <aside className="w-[272px] shrink-0 space-y-4">
          <Card className="space-y-3 p-5">
            <CardTitle>Forum overview</CardTitle>
            <IconStat icon={MessageSquare}>{o?.threadCount ?? 0} threads</IconStat>
            <IconStat icon={HelpCircle}>{o?.unansweredCount ?? 0} unanswered</IconStat>
            <IconStat icon={Users}>{o?.memberCount ?? 0} members</IconStat>
          </Card>
          <Card className="space-y-2.5 p-5">
            <CardTitle>Community rules</CardTitle>
            <ul className="space-y-2">
              {o?.rules.map((r) => (
                <li key={r} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> {r}
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <Flag className="h-3.5 w-3.5" /> Use the flag icon to report a post
            </p>
          </Card>
        </aside>
      </div>

      <NewThreadDialog open={creating} onClose={() => setCreating(false)} onCreate={f.create} />
      <ReportDialog title="Report thread" target={reporting} onClose={() => setReporting(null)} />
    </div>
  )
}
