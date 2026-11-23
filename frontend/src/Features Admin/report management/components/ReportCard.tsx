import React from 'react';
import { Clock, ShieldAlert, AlertTriangle, Trash2, XCircle } from 'lucide-react';
import { ReportItem, ReportStatus } from '../types';

export interface ReportCardProps {
  report: ReportItem;
  onDismiss?: (id: string) => void;
  onWarnUser?: (id: string) => void;
  onDeleteContent?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onDismiss,
  onWarnUser,
  onDeleteContent,
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

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending
          </span>
        );
      case 'DELETE_CONTENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            Delete Content
          </span>
        );
      case 'WARN_USER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            Warn User
          </span>
        );
      case 'DISMISS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Dismissed
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col gap-5 transition-shadow hover:shadow-sm">
      {/* Header: User Info & Status / Entity Badge */}
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
              <span className="text-xs leading-none">
                {formatTimeAgo(report.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status & Entity */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            {report.entityType}
          </span>
          {getStatusBadge(report.status)}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-3">
        {/* Target Entity Box */}
        <div className="bg-slate-50 rounded-md p-3.5 flex flex-col gap-1 border border-slate-100/80">
          <span className="text-xs font-medium text-slate-500">Target Entity:</span>
          <p className="text-slate-900 font-mono text-xs">
            {report.entityType} ID: #{report.entityId}
          </p>
          {report.reportedContent && (
            <p className="text-sm text-slate-800 mt-1 italic">
              "{report.reportedContent}"
            </p>
          )}
        </div>

        {/* Reporter's Reason */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">
            Reporter's Reason:
          </span>
          <p className="text-sm text-slate-700 leading-relaxed">
            {report.reason || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Footer: Action Buttons (Only when report is PENDING) */}
      {report.status === 'PENDING' && (
        <div className="flex items-center justify-end gap-3 flex-wrap pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onDismiss?.(report.id)}
            className="px-4 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 text-sm font-medium border border-slate-200 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            Dismiss Report
          </button>

          <button
            type="button"
            onClick={() => onWarnUser ? onWarnUser(report.id) : onResolve?.(report.id)}
            className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-sm font-medium border border-amber-300 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            Warn User
          </button>

          <button
            type="button"
            onClick={() => onDeleteContent ? onDeleteContent(report.id) : onResolve?.(report.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            Delete Content
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
