import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  totalElements?: number;
  size: number;
  onPageChange: (newPage: number) => void;
  onSizeChange: (newSize: number) => void;
  pageSizeOptions?: number[];
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const [destPage, setDestPage] = useState<string>(
    totalPages === 0 ? '' : String(page + 1)
  );

  useEffect(() => {
    setDestPage(totalPages === 0 ? '' : String(page + 1));
  }, [page, totalPages]);

  const handleDestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(destPage, 10);
    if (!isNaN(parsed) && totalPages > 0) {
      const validPage = Math.max(1, Math.min(parsed, totalPages));
      onPageChange(validPage - 1);
      setDestPage(String(validPage));
    }
  };

  const currentPageDisplay = totalPages === 0 ? 0 : page + 1;
  const options = Array.from(new Set([...pageSizeOptions, size])).sort(
    (a, b) => a - b
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xs">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <label htmlFor="page-size-select" className="font-medium text-slate-700">
          Rows per page:
        </label>
        <select
          id="page-size-select"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer shadow-2xs"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {totalElements !== undefined && (
          <span className="text-slate-400 text-xs ml-2">
            ({totalElements} total)
          </span>
        )}
      </div>

      {/* Navigation Controls & Destination Page Input */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Previous & Next Buttons with Current Page display */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 0}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="px-2 text-sm text-slate-700 font-medium">
            Page {currentPageDisplay} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1 || totalPages === 0}
            aria-label="Next page"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Page Input Form */}
        <form onSubmit={handleDestSubmit} className="flex items-center gap-1.5">
          <label htmlFor="dest-page-input" className="text-sm text-slate-600">
            Go to:
          </label>
          <input
            id="dest-page-input"
            type="number"
            min={1}
            max={Math.max(totalPages, 1)}
            value={destPage}
            onChange={(e) => setDestPage(e.target.value)}
            disabled={totalPages === 0}
            className="w-14 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs disabled:opacity-40"
            placeholder="1"
          />
          <button
            type="submit"
            disabled={totalPages === 0}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
};
