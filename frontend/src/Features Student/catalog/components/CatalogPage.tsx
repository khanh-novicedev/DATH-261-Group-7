import { Button, Chip, Input, PageHeading } from '@shared/components'
import { CATEGORIES } from '../api/catalogApi'
import { useCatalog } from '../hooks/useCatalog'
import { CourseCard } from './CourseCard'

export function CatalogPage() {
  const { courses, loading, filter, setFilter } = useCatalog()

  return (
    <div className="space-y-5">
      <PageHeading title="Course Catalog" subtitle="Description" />

      <div className="flex gap-3">
        <Input
          placeholder="Search by course or instructor..."
          value={filter.query}
          onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))}
        />
        <Button variant="outline">Filter</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip selected={filter.category === null} onClick={() => setFilter((f) => ({ ...f, category: null }))}>
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c} selected={filter.category === c} onClick={() => setFilter((f) => ({ ...f, category: c }))}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">{courses.length} courses</span>
        <label className="font-medium text-slate-700">
          Sort:{' '}
          <select
            className="bg-transparent font-medium focus:outline-none"
            value={filter.sort}
            onChange={(e) => setFilter((f) => ({ ...f, sort: e.target.value as typeof f.sort }))}
          >
            <option value="newest">Newest</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-slate-500">No courses match your search.</p>
          <Button variant="outline" onClick={() => setFilter((f) => ({ ...f, query: '', category: null }))}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  )
}
