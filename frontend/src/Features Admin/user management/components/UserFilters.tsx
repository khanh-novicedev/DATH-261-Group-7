import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { FilterState, UserRole, UserStatus } from '../types';

interface UserFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: ('All' | UserRole)[] = ['All', 'Student', 'Teacher', 'Admin'];
  const statuses: ('All' | UserStatus)[] = ['All', 'Active', 'Suspended'];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
        />
      </div>

      {/* Filters Group */}
      <div className="flex items-center gap-3">
        {/* Role Filter */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => {
              setRoleOpen((prev) => !prev);
              setStatusOpen(false);
            }}
            className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-[140px] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Role: {filters.role}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                roleOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {roleOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onFilterChange({ role });
                    setRoleOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span>{role === 'All' ? 'All Roles' : role}</span>
                  {filters.role === role && (
                    <Check className="w-4 h-4 text-slate-900" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setStatusOpen((prev) => !prev);
              setRoleOpen(false);
            }}
            className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-[140px] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Status: {filters.status}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                statusOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {statusOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onFilterChange({ status });
                    setStatusOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span>{status === 'All' ? 'All Statuses' : status}</span>
                  {filters.status === status && (
                    <Check className="w-4 h-4 text-slate-900" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
