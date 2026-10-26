import React, { useState } from 'react';
import { AdminHeader } from '../shared/components/AdminHeader';
import { LogFilters } from './components/LogFilters'
import { LogTable } from './components/LogTable';
import { useAduditLogs } from './hooks/useAuditLogs';

interface AuditLogsPageProps {
  onTabChange?: (tab: string) => void;
}

export const AuditLogsPage: React.FC<AuditLogsPageProps> = ({
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState('Audit Logs');

  const {
    filteredLogs,
    filters,
    handleFilterChange,
  } = useAduditLogs();
  const handleHeaderTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <AdminHeader activeTab={currentTab} onTabChange={handleHeaderTabChange} />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            System Audit Logs
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Monitor and track all system events, security actions, and user activity across the platform.
          </p>
        </div>

        {/* Toolbar / Filters */}
        <LogFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Logs Table */}
        <LogTable
          logs={filteredLogs}
        />
      </main>
    </div>
  );
};

export default AuditLogsPage;
