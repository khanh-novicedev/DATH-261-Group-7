import { useEffect, useState } from 'react'
import { useAsync } from '@shared/hooks'
import { getAssignment, getMySubmission, submitFile } from '../api/assignmentApi'
import type { Submission } from '../types'

export const MAX_FILE_BYTES = 50 * 1024 * 1024
export const ACCEPTED_TYPES = ['.mp4', '.pdf', '.docx']

export function useSubmission(assignmentId: string) {
  const assignment = useAsync(() => getAssignment(assignmentId), [assignmentId])
  const initial = useAsync(() => getMySubmission(assignmentId), [assignmentId])
  const [submission, setSubmission] = useState<Submission>({ status: 'NOT_SUBMITTED' })
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (initial.data) setSubmission(initial.data)
  }, [initial.data])

  const isLate = assignment.data ? new Date(assignment.data.deadline).getTime() < Date.now() : false

  function pickFile(f: File | null) {
    setError(null)
    if (!f) return setFile(null)
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase()
    if (!ACCEPTED_TYPES.includes(ext)) return setError('Only MP4, PDF or DOCX files are accepted.')
    if (f.size > MAX_FILE_BYTES) return setError('File is larger than 50 MB.')
    setFile(f)
  }

  async function submit() {
    if (!file) return
    setSubmitting(true)
    try {
      setSubmission(await submitFile(assignmentId, file))
      setFile(null)
    } finally {
      setSubmitting(false)
    }
  }

  return { assignment: assignment.data, loading: assignment.loading, submission, file, error, isLate, submitting, pickFile, submit }
}
