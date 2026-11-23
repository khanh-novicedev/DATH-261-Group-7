import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { LogFilters } from './components/LogFilters';
import { LogTable } from './components/LogTable';
import { TablePagination } from '../shared/components/TablePagination';
import { useAuditLogs } from './hooks/useAuditLogs';

export const AuditLogsPage: React.FC = () => {
  const {
    filteredLogs,
    filters,
    isLoading,
    error,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize,
    handleFilterChange,
  } = useAuditLogs();

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

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center justify-between text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Toolbar / Filters */}
      <LogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-slate-500">Loading audit logs...</p>
        </div>
      ) : (
        <>
          {/* Logs Table */}
          <LogTable logs={filteredLogs} />

          {/* Pagination */}
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            onPageChange={setPage}
            onSizeChange={setSize}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </>
      )}
    </div>
  );
};

export default AuditLogsPage;
