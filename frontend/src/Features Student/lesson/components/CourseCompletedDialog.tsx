import { useNavigate } from 'react-router-dom'
import { Button, Dialog } from '@shared/components'

export function CourseCompletedDialog({ open, courseId, onClose }: { open: boolean; courseId: string; onClose: () => void }) {
  const navigate = useNavigate()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Course completed! 🎉"
      description="You finished every lesson in this course. Your progress on the dashboard has been updated."
      footer={
        <>
          <Button variant="outline" onClick={() => navigate(`/student/courses/${courseId}`)}>
            View course
          </Button>
          <Button onClick={() => navigate('/student/dashboard')}>Back to dashboard</Button>
        </>
      }
    />
  )
}
