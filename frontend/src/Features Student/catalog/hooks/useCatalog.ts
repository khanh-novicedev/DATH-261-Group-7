import { useEffect, useMemo, useState } from 'react'
import { errorMessage } from '@shared/api'
import { getPublishedCourses } from '../api/catalogApi'
import type { CatalogCourse, CatalogFilter } from '../types'

export function useCatalog() {
  const [filter, setFilter] = useState<CatalogFilter>({ query: '', category: null, sort: 'newest' })
  const [data, setData] = useState<CatalogCourse[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setKeyword(filter.query.trim()), 300)
    return () => clearTimeout(t)
  }, [filter.query])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    getPublishedCourses(keyword, filter.category)
      .then((list) => {
        if (!active) return
        setData(list)
        if (!keyword && !filter.category) {
          setCategories(Array.from(new Set(list.map((c) => c.category).filter((c): c is string => Boolean(c)))))
        }
      })
      .catch((err) => active && setError(errorMessage(err)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [keyword, filter.category])

  const courses = useMemo(
    () => (filter.sort === 'title' ? [...data].sort((a, b) => a.title.localeCompare(b.title)) : data),
    [data, filter.sort],
  )

  return { courses, categories, loading, error, filter, setFilter }
}
