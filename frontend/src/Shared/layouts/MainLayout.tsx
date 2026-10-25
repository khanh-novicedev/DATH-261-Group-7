import { Outlet } from 'react-router-dom'
import { Header, type NavItem } from './components/Header'

export function MainLayout({ navItems }: { navItems: NavItem[] }) {
  return (
    <div className="min-h-full bg-white">
      <Header navItems={navItems} />
      <main className="mx-auto max-w-[1152px] px-12 py-5">
        <Outlet />
      </main>
    </div>
  )
}
