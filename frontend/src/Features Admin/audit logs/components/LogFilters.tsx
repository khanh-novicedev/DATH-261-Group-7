import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Calendar } from 'lucide-react';
import { UserRole } from '../../../Shared/types/index'
import {
  type AuditLogFilterParams,
  type AuditLogAction,
  AUDIT_LOG_ACTIONS,
  USER_ROLES,
} from '../types';

interface LogFiltersProps {
  filters: AuditLogFilterParams;
  onFilterChange: (filters: Partial<AuditLogFilterParams>) => void;
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

  const currentRole = filters.actorRole || 'All';
  const currentAction = filters.action || 'All';

  const roleOptions: ('All' | UserRole)[] = ['All', ...USER_ROLES];
  const actionOptions: ('All' | AuditLogAction)[] = ['All', ...AUDIT_LOG_ACTIONS];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Search Bar (client side keyword or search actor / target) */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search ?? ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Filter by actor name, action, or target..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
        />
      </div>

      {/* Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 1. Date From */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-500">From:</span>
          <input
            type="date"
            value={filters.from ? filters.from.split('T')[0] : ''}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                from: val ? new Date(val).toISOString() : undefined,
              });
            }}
            className="text-xs text-slate-800 focus:outline-none bg-transparent"
          />
        </div>

        {/* 2. Date To */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-500">To:</span>
          <input
            type="date"
            value={filters.to ? filters.to.split('T')[0] : ''}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange({
                to: val ? new Date(`${val}T23:59:59.999Z`).toISOString() : undefined,
              });
            }}
            className="text-xs text-slate-800 focus:outline-none bg-transparent"
          />
        </div>

        {/* 3. Role Filter (Between Date Filter and Action Filter) */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => {
              setRoleOpen((prev) => !prev);
              setActionOpen(false);
            }}
            className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-35 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Role: {currentRole}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                roleOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {roleOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onFilterChange({ actorRole: role === 'All' ? 'All' : role });
                    setRoleOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{role === 'All' ? 'All Roles' : role}</span>
                  {currentRole === role && (
                    <Check className="w-4 h-4 text-slate-900" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Action Filter */}
        <div className="relative" ref={actionRef}>
          <button
            type="button"
            onClick={() => {
              setActionOpen((prev) => !prev);
              setRoleOpen(false);
            }}
            className="h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 min-w-44 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Action: {currentAction}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                actionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {actionOpen && (
            <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              {actionOptions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => {
                    onFilterChange({ action: action === 'All' ? undefined : action });
                    setActionOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{action === 'All' ? 'All Actions' : action}</span>
                  {currentAction === action && (
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
