import { useState } from 'react'
import { Button, Dialog, Input, Textarea } from '@shared/components'

export function NewThreadDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (title: string, content: string) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const close = () => {
    setTitle('')
    setContent('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title="New thread"
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            disabled={!title.trim() || !content.trim()}
            onClick={async () => {
              await onCreate(title.trim(), content.trim())
              close()
            }}
          >
            Post
          </Button>
        </>
      }
    >
      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
    </Dialog>
  )
}
