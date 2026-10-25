import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.to && !last ? (
              <Link to={item.to} className="text-slate-500 hover:text-slate-900">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'font-medium text-slate-900' : 'text-slate-500'}>{item.label}</span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
          </Fragment>
        )
      })}
    </nav>
  )
}
