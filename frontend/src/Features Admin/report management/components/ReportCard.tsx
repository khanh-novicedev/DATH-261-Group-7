import React from 'react';
import { Clock, Flag } from 'lucide-react';
import { ReportItem, ReportFlag } from '../types';

export interface ReportCardProps {
  report: ReportItem;
  onDismiss?: (id: number) => void;
  onResolve?: (id: number) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onDismiss,
  onResolve,
}) => {
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatTimeAgo = (date: Date): string => {
    if (!date || isNaN(new Date(date).getTime())) return '';
    const now = new Date();
    const target = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return target.toLocaleDateString();
  };

  const getFlagBadgeStyles = (flag: ReportFlag) => {
    switch (flag) {
      case 'Spam':
        return {
          container: 'bg-amber-100 text-slate-700',
          icon: 'text-slate-700',
        };
      case 'Harassment':
      case 'Repeated disruption':
      default:
        return {
          container: 'bg-red-50 text-red-600',
          icon: 'text-red-600',
        };
    }
  };

  const flagStyles = getFlagBadgeStyles(report.flag);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col gap-5 transition-shadow hover:shadow-sm">
      {/* Header: User Info & Flag Badge */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 font-medium text-sm select-none shrink-0">
            {getInitials(report.name)}
          </div>
          {/* Name & Time */}
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-slate-900 leading-tight">
              {report.name}
            </span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="text-sm leading-none">
                {formatTimeAgo(report.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Flag Badge */}
        <div
          className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${flagStyles.container}`}
        >
          <Flag className={`w-3.5 h-3.5 fill-current ${flagStyles.icon}`} />
          <span>{report.flag}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-3">
        {/* Flagged Content Box */}
        <div className="bg-slate-50 rounded-md p-4 flex flex-col gap-2 border border-slate-100/80">
          <span className="text-xs font-medium text-slate-500">
            {report.reportedPage
              ? `Flagged ${report.reportedPage}`
              : 'Flagged Content'}
          </span>
          <p className="text-sm text-slate-900 leading-normal">
            {report.reportedContent}
          </p>
        </div>

        {/* Reporter's Reason */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">
            Reporter's Reason:
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">
            {report.reason}
          </p>
        </div>
      </div>

      {/* Footer: Action Buttons */}
      <div className="flex items-center justify-end gap-3 flex-wrap pt-1">
        <button
          type="button"
          onClick={() => onDismiss?.(report.id)}
          className="px-4 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 text-sm font-medium border border-slate-200 rounded-md transition-colors cursor-pointer shadow-2xs"
        >
          Dismiss Report
        </button>

        <button
          type="button"
          onClick={() => onResolve?.(report.id)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-sm font-medium rounded-md transition-colors cursor-pointer shadow-2xs"
        >
          Resolve (Warn/Delete Content)
        </button>
      </div>
    </div>
  );
};

export default ReportCard;
