import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CourseStatus } from '@shared/types';
import { SearchBar } from '../../shared/components/SearchBar';
import { Dropdown } from '../../shared/components/Dropdown';
import { CatalogQuery } from '@shared/api/courseApi'

interface CourseFiltersProps {
  filters: CatalogQuery;
  onFilterChange: (filters: Partial<CatalogQuery>) => void;
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const getStatusLabel = (val: string | undefined) => {
    return statusOptions.find((opt) => opt.value === val)?.label ?? val;
  };

  const statusOptions: { label: string; value: undefined | CourseStatus }[] = [
    { label: 'All Statuses', value: undefined },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Hidden', value: 'HIDDEN' },
    { label: 'Draft', value: 'DRAFT' },
  ];
  
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <SearchBar
        value={filters.keyword || ""}
        onChange={(e) => onFilterChange({ keyword: e.target.value })}
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
              className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-35 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>Status: {getStatusLabel(filters.status)}</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          }
        >
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange({ status: opt.value })}
              className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{opt.label}</span>
              {filters.status === opt.value && <Check className="w-4 h-4 text-slate-900" />}
            </button>
          ))}
        </Dropdown>

        {/* catagory Filter */}
        {/* <Dropdown
          trigger={
            <button
              type="button"
              className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-[210px] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>
                {filters.category === 'All'
                  ? 'Published · Hidden · Draft'
                  : `Catagory: ${getStatusLabel(filters.category)}`}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          }
        >
          {catagoryOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange({ category: opt.value })}
              className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{opt.label}</span>
              {filters.category === opt.value && <Check className="w-4 h-4 text-slate-900" />}
            </button>
          ))}
        </Dropdown> */}
      </div>
    </div>
  );
};
