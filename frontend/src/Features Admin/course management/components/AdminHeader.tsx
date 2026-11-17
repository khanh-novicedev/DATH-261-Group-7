import React from 'react'
import { AdminHeader as SharedAdminHeader, type AdminHeaderProps } from '../../shared/components/AdminHeader'

export type { AdminHeaderProps }

export const AdminHeader: React.FC<AdminHeaderProps> = (props) => {
  return <SharedAdminHeader {...props} />
}

export default AdminHeader
