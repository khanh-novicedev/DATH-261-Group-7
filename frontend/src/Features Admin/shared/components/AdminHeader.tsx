import React from 'react'
import { Header } from '@shared/layouts'

export interface AdminHeaderProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

/**
 * AdminHeader renders the unified platform Header with Admin navigation context.
 */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, onTabChange }) => {
  return <Header activeTab={activeTab} onTabChange={onTabChange} />
}

export default AdminHeader
