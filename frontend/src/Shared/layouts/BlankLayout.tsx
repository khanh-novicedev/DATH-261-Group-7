import { Outlet } from 'react-router-dom'

export function BlankLayout() {
  return (
    <div className="h-full">
      <Outlet />
    </div>
  )
}
