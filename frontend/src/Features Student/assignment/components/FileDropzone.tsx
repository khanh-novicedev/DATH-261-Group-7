import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@shared/utils'
import { ACCEPTED_TYPES } from '../hooks/useSubmission'

export function FileDropzone({ onFile, disabled }: { onFile: (f: File | null) => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (!disabled) onFile(e.dataTransfer.files[0] ?? null)
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-slate-300 bg-slate-50 py-5 text-center',
        over && 'border-slate-900 bg-slate-100',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <Upload className="h-5 w-5 text-slate-700" />
      <p className="text-sm font-medium text-slate-900">Drag and drop a file, or click to browse</p>
      <p className="text-xs text-slate-500">MP4, PDF or DOCX · max 50 MB</p>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
