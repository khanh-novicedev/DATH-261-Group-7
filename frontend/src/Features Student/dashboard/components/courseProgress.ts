import type { EnrolledCourse } from '../types'

export const progressPercent = (c: EnrolledCourse) =>
  c.totalLessons > 0 ? Math.round((c.completedLessons / c.totalLessons) * 100) : 0

export const accentBg: Record<EnrolledCourse['accent'], string> = {
  amber: 'bg-amber-100',
  sky: 'bg-sky-100',
  emerald: 'bg-emerald-100',
  violet: 'bg-violet-100',
  rose: 'bg-rose-100',
  teal: 'bg-teal-100',
}
