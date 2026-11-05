import { getCatalog } from '@shared/api'
import { accentFor } from '@shared/utils'
import type { CatalogCourse } from '../types'

export async function getPublishedCourses(keyword: string, category: string | null): Promise<CatalogCourse[]> {
  const page = await getCatalog({ keyword, category, size: 50 })
  return page.items.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description ?? '',
    category: c.category,
    lessonCount: c.lessonCount,
    accent: accentFor(c.id),
  }))
}
