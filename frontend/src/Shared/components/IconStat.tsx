import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function IconStat({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-700">
      <Icon className="h-4 w-4 text-slate-600" />
      <span>{children}</span>
    </div>
  )
}
