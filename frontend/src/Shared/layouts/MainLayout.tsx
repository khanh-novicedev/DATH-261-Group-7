import { Outlet } from 'react-router-dom'
import { Header, type NavItem } from './components/Header'
import { cn } from '@shared/utils'

export interface MainLayoutProps {
  navItems?: NavItem[]
  contentClassName?: string
  containerClassName?: string
}

export function MainLayout({ navItems, contentClassName, containerClassName }: MainLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-slate-50/50 flex flex-col font-sans", containerClassName)}>
      <Header navItems={navItems} />
      <main className={cn("flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6", contentClassName)}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
