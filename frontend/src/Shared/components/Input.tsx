import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@shared/utils'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-slate-400',
        className,
      )}
      {...props}
    />
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[104px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-slate-400',
        className,
      )}
      {...props}
    />
  )
})
