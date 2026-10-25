import React, { useState } from 'react';
import { AdminHeader } from '../shared/components/AdminHeader';
import { Metrics } from '../shared/components/Metrics';
import { ReportFilters } from './components/ReportFilters';
import { useReportManagement } from './hooks/useReportManagement';
import { ReportCard } from './components/ReportCard';

interface ReportManagementPageProps {
  onTabChange?: (tab: string) => void;
}

export const ReportManagementPage: React.FC<ReportManagementPageProps> = ({
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState('Report Management');

  const {
    filteredReports,
    metrics,
    filters,
    handleFilterChange,
    handleDismissReport,
    handleResolveReport, 
  } = useReportManagement();

  const handleHeaderTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <AdminHeader
        activeTab={currentTab}
        onTabChange={handleHeaderTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Report Management Overview */}
        <>
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
            <>
              <ReportCard report={report} onDismiss={handleDismissReport} onResolve={handleResolveReport} />
            </>
          ))}
        </>
      </main>
    </div>
  );
};

export default ReportManagementPage;
