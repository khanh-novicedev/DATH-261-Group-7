import { cn } from '@shared/utils'

export interface AvatarProps {
  name: string
  src?: string
  size?: number
  className?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 font-medium text-slate-900', className)}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      title={name}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name) || 'CN'}
    </span>
  )
}
