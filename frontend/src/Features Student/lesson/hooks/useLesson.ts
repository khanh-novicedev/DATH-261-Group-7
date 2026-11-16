import { useEffect, useState } from 'react'
import { errorMessage } from '@shared/api'
import { useAsync } from '@shared/hooks'
import { useAuth } from '@shared/context'
import { getLesson, getQna, postQuestion, saveLessonProgress } from '../api/lessonApi'
import type { QnaThread } from '../types'

export function useLesson(courseId: string, lessonId: string) {
  const { user } = useAuth()
  const lesson = useAsync(() => getLesson(courseId, lessonId), [courseId, lessonId])
  const qna = useAsync(() => getQna(lessonId), [lessonId])
  const [threads, setThreads] = useState<QnaThread[]>([])
  const [completed, setCompleted] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)
  const [courseCompleted, setCourseCompleted] = useState(false)

  useEffect(() => setThreads(qna.data ?? []), [qna.data])
  useEffect(() => {
    setCompleted(lesson.data?.isCompleted ?? false)
    setCompleteError(null)
    setCourseCompleted(false)
  }, [lesson.data])

  useEffect(() => {
    const data = lesson.data
    if (!data?.isEnrolled || data.isCompleted) return
    saveLessonProgress(data.courseId, data.id, false).catch(() => undefined)
  }, [lesson.data])

  async function ask(content: string) {
    if (!content.trim() || !user) return
    const created = await postQuestion(lessonId, user, content.trim())
    setThreads((t) => [...t, created])
  }

  async function complete() {
    if (!lesson.data) return
    setCompleting(true)
    setCompleteError(null)
    try {
      const progress = await saveLessonProgress(lesson.data.courseId, lesson.data.id, true)
      setCompleted(true)
      setCourseCompleted(progress.completionStatus === 'COMPLETED')
    } catch (error) {
      setCompleteError(errorMessage(error))
    } finally {
      setCompleting(false)
    }
  }

  return {
    lesson: lesson.data,
    loading: lesson.loading,
    loadError: lesson.error ? errorMessage(lesson.error) : null,
    threads,
    ask,
    completed,
    completing,
    completeError,
    complete,
    courseCompleted,
    dismissCourseCompleted: () => setCourseCompleted(false),
  }
}
