import { useEffect, useMemo, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { useAuth } from '@shared/context'
import { createThread, getForumOverview, getThreads } from '../api/forumApi'
import type { ForumTab, ForumThread } from '../types'

export const PAGE_SIZE = 4

export function useForum(courseId: string) {
  const { user } = useAuth()
  const loaded = useAsync(() => getThreads(courseId), [courseId])
  const overview = useAsync(() => getForumOverview(courseId), [courseId])
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [tab, setTab] = useState<ForumTab>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => setThreads(loaded.data ?? []), [loaded.data])
  useEffect(() => setPage(1), [tab, query])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return threads.filter(
      (t) =>
        (tab === 'all' || (tab === 'unanswered' && t.replyCount === 0) || (tab === 'mine' && t.author.id === user?.id)) &&
        (!q || t.title.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q)),
    )
  }, [threads, tab, query, user?.id])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  async function create(title: string, content: string) {
    if (!user) return
    const t = await createThread(courseId, user, title, content)
    setThreads((ts) => [t, ...ts])
    setTab('all')
  }

  return {
    loading: loaded.loading,
    overview: overview.data,
    visible: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    tab,
    setTab,
    query,
    setQuery,
    page,
    pageCount,
    setPage,
    create,
  }
}
