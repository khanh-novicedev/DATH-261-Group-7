import React from 'react';
import { LogFilters } from './components/LogFilters';
import { LogTable } from './components/LogTable';
import { useAduditLogs } from './hooks/useAuditLogs';

export const AuditLogsPage: React.FC = () => {
  const {
    filteredLogs,
    filters,
    handleFilterChange,
  } = useAduditLogs();

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AuditLogsPage;
