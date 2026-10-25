import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@shared/utils'

export type ButtonVariant = 'default' | 'outline' | 'destructive' | 'ghost'
export type ButtonSize = 'md' | 'sm' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
  default: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-slate-700 hover:bg-slate-100',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm',
  sm: 'h-9 px-3 text-sm',
  icon: 'h-10 w-10',
}

export function Button({ variant = 'default', size = 'md', fullWidth, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}
