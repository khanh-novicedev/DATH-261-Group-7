import { useState } from 'react'
import { reportContent, type ReportedEntityType } from '@shared/api'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { Textarea } from './Input'
import { RadioOption } from './RadioOption'

const REPORT_REASONS = ['Spam or advertising', 'Academic dishonesty', 'Offensive language', 'Other'] as const
type ReportReason = (typeof REPORT_REASONS)[number]

export interface ReportTarget {
  type: ReportedEntityType
  id: string
  preview: string
}

export function ReportDialog({ target, title = 'Report content', onClose }: { target: ReportTarget | null; title?: string; onClose: () => void }) {
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [other, setOther] = useState('')
  const [sending, setSending] = useState(false)

  const close = () => {
    setReason(null)
    setOther('')
    onClose()
  }

  async function send() {
    if (!target || !reason) return
    setSending(true)
    await reportContent({
      reportedEntityType: target.type,
      reportedEntityId: target.id,
      reason: reason === 'Other' ? other.trim() : reason,
    })
    setSending(false)
    close()
  }

  return (
    <Dialog
      open={Boolean(target)}
      onClose={close}
      title={title}
      description="The report goes to the instructor and admins. The author won't know who reported it."
      footer={
        <>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!reason || (reason === 'Other' && !other.trim()) || sending} onClick={send}>
            Send report
          </Button>
        </>
      }
    >
      <blockquote className="rounded-lg border-l-[3px] border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
        “{target?.preview}”
      </blockquote>
      <p className="text-sm font-medium">Reason</p>
      <div className="space-y-2">
        {REPORT_REASONS.map((r) => (
          <RadioOption key={r} name="report-reason" value={r} label={r} checked={reason === r} onChange={() => setReason(r)} compact />
        ))}
      </div>
      {reason === 'Other' && <Textarea placeholder="Describe the problem" value={other} onChange={(e) => setOther(e.target.value)} />}
    </Dialog>
  )
}
