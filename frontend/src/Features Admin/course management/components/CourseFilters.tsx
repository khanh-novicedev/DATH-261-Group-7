import React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { CourseFilterState, CourseStatus } from '../types';
import { SearchBar } from '../../shared/components/SearchBar';
import { Dropdown } from '../../shared/components/Dropdown';

interface CourseFiltersProps {
  filters: CourseFilterState;
  onFilterChange: (filters: Partial<CourseFilterState>) => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const statuses: ('All' | CourseStatus)[] = ['All', 'Published', 'Hidden', 'Draft'];
  const visibilities: ('All' | CourseStatus)[] = ['All', 'Published', 'Hidden', 'Draft'];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <SearchBar
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        placeholder="Search courses..."
        className="relative flex-1"
      />

      {/* Filters Group */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
        {/* Status Filter */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-[140px] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>Status: {filters.status}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          }
        >
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onFilterChange({ status })}
              className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{status === 'All' ? 'All Statuses' : status}</span>
              {filters.status === status && <Check className="w-4 h-4 text-slate-900" />}
            </button>
          ))}
        </Dropdown>

        {/* Visibility Filter */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-[210px] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>
                {filters.visibility === 'All'
                  ? 'Published · Hidden · Draft'
                  : `Visibility: ${filters.visibility}`}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          }
        >
          <button
            type="button"
            onClick={() => onFilterChange({ visibility: 'All' })}
            className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>Published · Hidden · Draft</span>
            {filters.visibility === 'All' && <Check className="w-4 h-4 text-slate-900" />}
          </button>
          {(['Published', 'Hidden', 'Draft'] as CourseStatus[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onFilterChange({ visibility: v })}
              className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{v}</span>
              {filters.visibility === v && <Check className="w-4 h-4 text-slate-900" />}
            </button>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};
