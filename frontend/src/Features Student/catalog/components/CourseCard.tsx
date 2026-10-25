import { Link } from 'react-router-dom'
import { cn } from '@shared/utils'
import type { CatalogCourse } from '../types'

const accentBg: Record<CatalogCourse['accent'], string> = {
  amber: 'bg-amber-200',
  sky: 'bg-sky-200',
  emerald: 'bg-emerald-200',
  violet: 'bg-violet-200',
  rose: 'bg-rose-200',
  teal: 'bg-teal-200',
}

export function CourseCard({ course }: { course: CatalogCourse }) {
  return (
    <Link
      to={`/student/catalog/${course.id}`}
      className="block w-[250px] overflow-hidden rounded-[10px] border border-slate-100 bg-slate-50 transition-shadow hover:shadow-md"
    >
      <div className={cn('h-[170px] w-full', accentBg[course.accent])} />
      <div className="space-y-1.5 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">{course.title}</p>
        <p className="text-sm text-slate-500">With {course.instructor.fullName}</p>
      </div>
    </Link>
  )
}
