import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { Avatar } from '@shared/components'
import { useAuth } from '@shared/context'
import { cn } from '@shared/utils'

export interface NavItem {
  label: string
  to: string
  activePrefixes?: string[]
}

const isActive = (pathname: string, item: NavItem) =>
  [item.to, ...(item.activePrefixes ?? [])].some((p) => pathname === p || pathname.startsWith(`${p}/`))

export function Header({ navItems }: { navItems: NavItem[] }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="sticky top-0 z-40 h-[70px] bg-header">
      <div className="mx-auto grid h-full max-w-[1152px] grid-cols-[1fr_auto_1fr] items-center px-4">
        <Link to={navItems[0]?.to ?? "/"} className="flex h-[50px] w-[180px] items-center rounded bg-white px-3 text-sm font-semibold text-slate-900">
          Logo
        </Link>

        <nav className="flex items-center rounded-md border border-slate-300 bg-white p-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(pathname, item) ? 'page' : undefined}
              className={cn(
                'rounded px-3 py-1.5 text-sm font-medium text-slate-900',
                isActive(pathname, item) ? 'bg-slate-100' : 'hover:bg-slate-50',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-900 hover:bg-white"
            >
              <Avatar name={user?.fullName ?? 'User name'} size={28} />
              {user?.fullName}
              <ChevronDown className="h-4 w-4" />
            </button>
            {open && (
              <div className="absolute right-0 mt-1 w-44 rounded-md border border-slate-200 bg-white p-1 shadow-md">
                <Link to="/profile" className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-100">
                  <User className="h-4 w-4" /> Profile
                </Link>
                <button type="button" className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-red-600 hover:bg-slate-100">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
