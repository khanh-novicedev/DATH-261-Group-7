import React from 'react';
import { Metrics } from '../shared/components/Metrics';
import { ReportFilters } from './components/ReportFilters';
import { useReportManagement } from './hooks/useReportManagement';
import { ReportCard } from './components/ReportCard';

export const ReportManagementPage: React.FC = () => {
  const {
    filteredReports,
    metrics,
    filters,
    handleFilterChange,
    handleDismissReport,
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

      {/* Metrics Section */}
      <Metrics metrics={metrics} />

      {/* Filters / Toolbar */}
      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {/* Reports List */}
      {filteredReports.map((report) => (
        <React.Fragment key={report.id}>
          <ReportCard report={report} onDismiss={handleDismissReport} onResolve={handleResolveReport} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ReportManagementPage;
