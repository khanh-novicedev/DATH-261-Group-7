import React from 'react';
import { ReportFilterState, ReportStatus, REPORT_STATUSES } from '../types';
import { Searchbar } from './Searchbar';
import { DropdownFilter } from './DropdownFilter';
import { DateFilter } from './DateFilter';

export interface ReportFiltersProps {
  filters: ReportFilterState;
  onFilterChange: (filters: Partial<ReportFilterState>) => void;
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Pending',
  DELETE_CONTENT: 'Delete Content',
  WARN_USER: 'Warn User',
  DISMISS: 'Dismiss',
};

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const statusOptions: { label: string; value: 'ALL' | ReportStatus }[] = [
    { label: 'All Statuses', value: 'ALL' },
    ...REPORT_STATUSES.map((status) => ({
      label: STATUS_LABELS[status],
      value: status,
    })),
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <Searchbar
        value={filters.search}
        onChange={(search) => onFilterChange({ search })}
        placeholder="Filter by reporter name, reason or entity ID..."
      />

      {/* Filters Group */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
        {/* Date Filter */}
        <DateFilter
          startDate={filters.startDate}
          endDate={filters.endDate}
          onChange={({ startDate, endDate }) => onFilterChange({ startDate, endDate })}
        />

        {/* Status Filter */}
        <DropdownFilter
          label="Status"
          value={filters.status}
          options={statusOptions}
          allLabel="All Statuses"
          onChange={(status) => onFilterChange({ status: status as 'ALL' | ReportStatus })}
        />
      </div>
    </div>
  );
};

export default ReportFilters;
