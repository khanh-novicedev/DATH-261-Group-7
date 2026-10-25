import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { FilterState, UserRole, ActionType } from '../types';

interface LogFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export const LogFilters: React.FC<LogFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleOpen(false);
      }
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actorRoles: ('All' | UserRole)[] = ['All', 'Student', 'Teacher', 'Admin'];
  const actions: ('All' | ActionType)[] = 
    ['All', 'Created Account' , 'Suspended Account' , 'Activated Acount' , 'Created Coure' , 'Deleted Course' , 'Submitted Report' , 'Resolved Report'];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search logs..."
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
              setActionOpen(false);
            }}
            className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-35 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Role: {filters.actorRole}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                roleOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {roleOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              {actorRoles.map((actorRole) => (
                <button
                  key={actorRole}
                  type="button"
                  onClick={() => {
                    onFilterChange({ actorRole });
                    setRoleOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span>{actorRole === 'All' ? 'All Roles' : actorRole}</span>
                  {filters.actorRole === actorRole && (
                    <Check className="w-4 h-4 text-slate-900" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Filter */}
        <div className="relative" ref={actionRef}>
          <button
            type="button"
            onClick={() => {
              setActionOpen((prev) => !prev);
              setRoleOpen(false);
            }}
            className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-35 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Action: {filters.action}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                actionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {actionOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              {actions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => {
                    onFilterChange({ action });
                    setActionOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors"
                >
                  <span>{action === 'All' ? 'All Actions' : action}</span>
                  {filters.action === action && (
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
