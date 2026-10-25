import { useAsync } from '@shared/hooks'
import { getCourseSyllabus } from '../api/syllabusApi'

export const useSyllabus = (courseId: string) => useAsync(() => getCourseSyllabus(courseId), [courseId])
