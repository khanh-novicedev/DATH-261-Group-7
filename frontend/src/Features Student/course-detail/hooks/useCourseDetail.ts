import { useEffect, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { enrol, getCourseDetail } from '../api/courseDetailApi'

export function useCourseDetail(courseId: string) {
  const { data, loading } = useAsync(() => getCourseDetail(courseId), [courseId])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [justEnrolled, setJustEnrolled] = useState(false)

  useEffect(() => setIsEnrolled(data?.isEnrolled ?? false), [data])

  async function doEnrol() {
    setEnrolling(true)
    try {
      await enrol(courseId)
      setIsEnrolled(true)
      setJustEnrolled(true)
    } finally {
      setEnrolling(false)
    }
  }

  return { course: data, loading, isEnrolled, enrolling, justEnrolled, dismissSuccess: () => setJustEnrolled(false), enrol: doEnrol }
}
