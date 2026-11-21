import { useEffect, useState } from 'react'
import { askQuestion, errorMessage, getLessonQna, type QnaThreadDto } from '@shared/api'
import { useAsync } from '@shared/hooks'
import { getLesson, saveLessonProgress } from '../api/lessonApi'

export function useLesson(courseId: string, lessonId: string) {
  const lesson = useAsync(() => getLesson(courseId, lessonId), [courseId, lessonId])
  const qna = useAsync(() => getLessonQna(lessonId), [lessonId])
  const [threads, setThreads] = useState<QnaThreadDto[]>([])
  const [askError, setAskError] = useState<string | null>(null)
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
    setAskError(null)
    try {
      const created = await askQuestion(lessonId, content.trim())
      setThreads((t) => [...t, created])
      return true
    } catch (error) {
      setAskError(errorMessage(error))
      return false
    }
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
    qnaError: askError ?? (qna.error ? errorMessage(qna.error) : null),
    ask,
    completed,
    completing,
    completeError,
    complete,
    courseCompleted,
    dismissCourseCompleted: () => setCourseCompleted(false),
  }
}
