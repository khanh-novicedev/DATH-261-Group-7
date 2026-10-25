import { useMemo, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { getPublishedCourses } from '../api/catalogApi'
import type { CatalogFilter } from '../types'

export function useCatalog() {
  const { data, loading } = useAsync(getPublishedCourses, [])
  const [filter, setFilter] = useState<CatalogFilter>({ query: '', category: null, sort: 'newest' })

  const courses = useMemo(() => {
    const q = filter.query.trim().toLowerCase()
    const list = (data ?? []).filter(
      (c) =>
        (!filter.category || c.category === filter.category) &&
        (!q || c.title.toLowerCase().includes(q) || c.instructor.fullName.toLowerCase().includes(q)),
    )
    return filter.sort === 'title' ? [...list].sort((a, b) => a.title.localeCompare(b.title)) : list
  }, [data, filter])

  return { courses, loading, filter, setFilter }
}
