import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export interface DateFilterProps {
  startDate?: Date;
  endDate?: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  className?: string;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onChange,
  className = 'w-full sm:w-61',
}) => {
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // Close Date Filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const formatDateForInput = (d?: Date): string => {
    if (!d || isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  useEffect(() => {
    if (dateOpen) {
      const isStartValid = startDate && startDate.getTime() > 0;
      setTempStartDate(isStartValid ? formatDateForInput(startDate) : '');
      setTempEndDate(endDate ? formatDateForInput(endDate) : '');
    }
  }, [dateOpen, startDate, endDate]);

  const isDateFiltered = Boolean(startDate && startDate.getTime() > 0);

  const dateLabel = useMemo(() => {
    if (!isDateFiltered || !startDate || !endDate) {
      return 'Filter by Date';
    }

    const formatOpts: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    const sStr = startDate.toLocaleDateString('en-US', formatOpts);
    const eStr = endDate.toLocaleDateString('en-US', formatOpts);

    return `${sStr} – ${eStr}`;
  }, [startDate, endDate, isDateFiltered]);

  const handleSelectPreset = (type: 'all' | 'today' | 'last7' | 'last30') => {
    const now = new Date();
    if (type === 'all') {
      onChange({
        startDate: new Date(0),
        endDate: new Date(),
      });
      setDateOpen(false);
      return;
    }

    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    if (type === 'last7') {
      start.setDate(start.getDate() - 6);
    } else if (type === 'last30') {
      start.setDate(start.getDate() - 29);
    }

    const safeStart = new Date(start.getTime() - 1);
    onChange({
      startDate: safeStart,
      endDate: end,
    });
    setDateOpen(false);
  };

  const handleApplyCustomDate = () => {
    if (!tempStartDate && !tempEndDate) {
      onChange({
        startDate: new Date(0),
        endDate: new Date(),
      });
      setDateOpen(false);
      return;
    }

    let start = new Date(0);
    if (tempStartDate) {
      const [sy, sm, sd] = tempStartDate.split('-').map(Number);
      const d = new Date(sy, sm - 1, sd, 0, 0, 0, 0);
      start = new Date(d.getTime() - 1);
    }

    let end = new Date();
    if (tempEndDate) {
      const [ey, em, ed] = tempEndDate.split('-').map(Number);
      end = new Date(ey, em - 1, ed, 23, 59, 59, 999);
    }

    onChange({
      startDate: start,
      endDate: end,
    });
    setDateOpen(false);
  };

  const handleResetDate = () => {
    onChange({
      startDate: new Date(0),
      endDate: new Date(),
    });
    setDateOpen(false);
  };

  return (
    <div className="relative" ref={dateRef}>
      <button
        type="button"
        onClick={() => setDateOpen((prev) => !prev)}
        className={`h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex items-center justify-between gap-2.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer ${className} ${
          isDateFiltered ? 'text-slate-900 font-semibold' : 'text-slate-700'
        }`}
      >
        <span className="truncate">{dateLabel}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {isDateFiltered && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleResetDate();
              }}
              className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear date filter"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <CalendarIcon className="w-4 h-4 text-slate-500" />
        </div>
      </button>

      {dateOpen && (
        <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Quick Presets */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <button
              type="button"
              onClick={() => handleSelectPreset('today')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200/60 transition-colors text-center cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('last7')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200/60 transition-colors text-center cursor-pointer"
            >
              Last 7 days
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('last30')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200/60 transition-colors text-center cursor-pointer"
            >
              Last 30 days
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset('all')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200/60 transition-colors text-center cursor-pointer"
            >
              All Time
            </button>
          </div>

          <div className="border-t border-slate-100 pt-2.5 space-y-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                End Date
              </label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDate}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApplyCustomDate}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
