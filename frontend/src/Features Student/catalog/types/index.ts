import type { CourseSummary } from '@shared/types'

export interface CatalogCourse extends CourseSummary {
  accent: 'amber' | 'sky' | 'emerald' | 'violet' | 'rose' | 'teal'
}

export type CatalogSort = 'newest' | 'title'

export interface CatalogFilter {
  query: string
  category: string | null
  sort: CatalogSort
}
