import { useEffect, useState } from 'react'
import { ApiError, errorMessage } from '@shared/api'
import { useAsync } from '@shared/hooks'
import { enrol, getCourseDetail, leaveCourse } from '../api/courseDetailApi'

export function useCourseDetail(courseId: string) {
  const { data, loading, error: loadError } = useAsync(() => getCourseDetail(courseId), [courseId])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [justEnrolled, setJustEnrolled] = useState(false)
  const [confirmingLeave, setConfirmingLeave] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => setIsEnrolled(data?.isEnrolled ?? false), [data])

  async function doEnrol() {
    setEnrolling(true)
    setError(null)
    try {
      await enrol(courseId)
      setIsEnrolled(true)
      setJustEnrolled(true)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ALREADY_ENROLLED') setIsEnrolled(true)
      setError(errorMessage(err))
    } finally {
      setEnrolling(false)
    }
  }

  async function doLeave() {
    setLeaving(true)
    setError(null)
    try {
      await leaveCourse(courseId)
      setIsEnrolled(false)
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ENROLMENT_NOT_FOUND') setIsEnrolled(false)
      setError(errorMessage(err))
    } finally {
      setLeaving(false)
      setConfirmingLeave(false)
    }
  }

  return {
    course: data,
    loading,
    loadError: loadError ? errorMessage(loadError) : null,
    error,
    isEnrolled,
    enrolling,
    justEnrolled,
    dismissSuccess: () => setJustEnrolled(false),
    enrol: doEnrol,
    confirmingLeave,
    leaving,
    askLeave: () => setConfirmingLeave(true),
    cancelLeave: () => setConfirmingLeave(false),
    leave: doLeave,
  }
}
