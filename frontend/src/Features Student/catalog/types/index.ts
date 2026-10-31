import type { Accent } from '@shared/utils'

export interface CatalogCourse {
  id: string
  title: string
  description: string
  category: string | null
  lessonCount: number
  accent: Accent
}

export type CatalogSort = 'newest' | 'title'

export interface CatalogFilter {
  query: string
  category: string | null
  sort: CatalogSort
}
