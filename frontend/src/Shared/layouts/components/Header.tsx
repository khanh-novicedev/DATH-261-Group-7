import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react'
import { Avatar } from '@shared/components'
import { useAuth } from '@shared/context'
import { logoutApi } from '@shared/api'
import { cn } from '@shared/utils'
import {
  type NavItem,
  STUDENT_NAV,
  TEACHER_NAV,
  ADMIN_NAV,
} from '../navConfig'

export type { NavItem }

export interface HeaderProps {
  navItems?: NavItem[]
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const isRouteActive = (pathname: string, item: NavItem) =>
  [item.to, ...(item.activePrefixes ?? [])].some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

export function Header({ navItems: propNavItems, activeTab, onTabChange }: HeaderProps) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Determine active context & navigation items
  const isAdmin = pathname.startsWith('/admin') || user?.role === 'ADMIN'
  const isTeacher =
    pathname.startsWith('/teacher') ||
    user?.role === 'INSTRUCTOR' ||
    user?.role === 'TEACHER'

  const effectiveNavItems: NavItem[] =
    propNavItems ?? (isAdmin ? ADMIN_NAV : isTeacher ? TEACHER_NAV : STUDENT_NAV)

  const homeLink = isAdmin
    ? '/admin/users'
    : isTeacher
    ? '/teacher/dashboard'
    : '/student/dashboard'


  const roleLabel = isAdmin
    ? 'Administrator'
    : isTeacher
    ? 'Instructor'
    : 'Learner'

  const isItemActive = (item: NavItem) => {
    if (activeTab) {
      return (
        item.label.toLowerCase() === activeTab.toLowerCase() ||
        item.to.toLowerCase().includes(activeTab.toLowerCase())
      )
    }
    return isRouteActive(pathname, item)
  }

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    setOpen(false)
    logout()
    navigate('/landing', { replace: true })

    if (refreshToken) {
      try {
        await logoutApi(refreshToken)
      } catch (err) {
        console.error('[Header] API-04 logout revocation failed on server:', err)
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 h-17.5 bg-[#F0F4F8] border-b border-slate-200">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            to={homeLink}
            className="flex items-center h-10 px-3.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-bold tracking-tight text-slate-800">
              LMS
            </span>
          </Link>
        </div>

        {/* Center: Menubar Navigation */}
        <nav className="hidden md:inline-flex items-center bg-white border border-slate-200/90 rounded-lg p-1 shadow-2xs">
          {effectiveNavItems.map((item) => {
            const active = isItemActive(item)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => onTabChange?.(item.label)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'px-3.5 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap',
                  active
                    ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions & User Menu */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-lg hover:bg-white/70 transition-colors cursor-pointer"
            >
              <Avatar name={user?.fullName ?? 'User'} size={28} />
              <span className="hidden sm:inline text-sm font-medium text-slate-800">
                {user?.fullName ?? 'User name'}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.fullName ?? 'User name'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-slate-500" />
                    <span>My Profile</span>
                  </Link>
                </div>

                {/* Log Out Option */}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
