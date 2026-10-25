import { useEffect, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { useAuth } from '@shared/context'
import { getLesson, getQna, markComplete, postQuestion } from '../api/lessonApi'
import type { QnaThread } from '../types'

export function useLesson(courseId: string, lessonId: string) {
  const { user } = useAuth()
  const lesson = useAsync(() => getLesson(courseId, lessonId), [courseId, lessonId])
  const qna = useAsync(() => getQna(lessonId), [lessonId])
  const [threads, setThreads] = useState<QnaThread[]>([])
  const [completed, setCompleted] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)

  useEffect(() => setThreads(qna.data ?? []), [qna.data])
  useEffect(() => {
    setCompleted(lesson.data?.isCompleted ?? false)
    setCourseCompleted(false)
  }, [lesson.data])

  async function ask(content: string) {
    if (!content.trim() || !user) return
    const created = await postQuestion(lessonId, user, content.trim())
    setThreads((t) => [...t, created])
  }

  async function complete() {
    if (!lesson.data) return
    const res = await markComplete(lessonId, lesson.data.completedCount, lesson.data.courseLessonCount)
    setCompleted(true)
    setCourseCompleted(res.courseCompleted)
  }

  return {
    lesson: lesson.data,
    loading: lesson.loading,
    threads,
    ask,
    completed,
    complete,
    courseCompleted,
    dismissCourseCompleted: () => setCourseCompleted(false),
  }
}
