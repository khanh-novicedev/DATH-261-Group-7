import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Metrics } from '../shared/components/Metrics';
import { ReportFilters } from './components/ReportFilters';
import { useReportManagement } from './hooks/useReportManagement';
import { ReportCard } from './components/ReportCard';
import { TablePagination } from '../shared/components/TablePagination';

export const ReportManagementPage: React.FC = () => {
  const {
    filteredReports,
    metrics,
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
    handleDismissReport,
    handleWarnUser,
    handleDeleteContent,
    handleResolveReport, 
  } = useReportManagement();

  return (
    <div className="space-y-6">
      {/* Page Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Report Management
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Review flagged content, manage reports, and maintain community safety.
          </p>
        </div>
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

      {/* Metrics Section */}
      <Metrics metrics={metrics} />

      {/* Filters / Toolbar */}
      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Loading state or Reports List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-slate-500">Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          No reports found matching your criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDismiss={handleDismissReport}
              onWarnUser={handleWarnUser}
              onDeleteContent={handleDeleteContent}
              onResolve={handleResolveReport}
            />
          ))}

          {/* Pagination: only render when totalElements exceeds page size or totalPages > 1 */}
          {totalPages > 1 && (
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              size={size}
              onPageChange={setPage}
              onSizeChange={setSize}
              pageSizeOptions={[10, 20, 50]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReportManagementPage;
