import React from 'react';
import { ReportFilterState, ReportStatus, ReportFlag } from '../types';
import { Searchbar } from './Searchbar';
import { DropdownFilter } from './DropdownFilter';
import { DateFilter } from './DateFilter';

export interface ReportFiltersProps {
  filters: ReportFilterState;
  onFilterChange: (filters: Partial<ReportFilterState>) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const statuses: ('All' | ReportStatus)[] = ['All', 'Pending', 'Resolved', 'Dismissed'];
  const flags: ('All' | ReportFlag)[] = ['All', 'Spam', 'Repeated disruption', 'Harassment'];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <Searchbar
        value={filters.search}
        onChange={(search) => onFilterChange({ search })}
        placeholder="Search by User, Content, Reason or Page..."
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
          options={statuses}
          allLabel="All Statuses"
          onChange={(status) => onFilterChange({ status })}
        />

        {/* Flag Filter */}
        <DropdownFilter
          label="Flag"
          value={filters.flag}
          options={flags}
          allLabel="All Flags"
          onChange={(flag) => onFilterChange({ flag })}
        />
      </div>
    </div>
  );
};

export default ReportFilters;
