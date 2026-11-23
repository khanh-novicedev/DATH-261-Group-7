import React from 'react';
import { Log } from '../types';
import { RoleBadge } from './RoleBadge';

interface LogTableRowProps {
  log: Log;
}

export const LogTableRow: React.FC<LogTableRowProps> = ({
  log
}) => {
  const formattedDate = !isNaN(log.date.getTime())
    ? log.date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Unknown Date';

  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
      {/* Date & Time */}
      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{formattedDate}</td>
      
      {/* Avatar & Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {log.actorAvatarUrl ? (
            <img
              src={log.actorAvatarUrl}
              alt={log.actorName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-medium flex items-center justify-center text-xs shrink-0">
              {log.actorInitials}
            </div>
          )}
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-medium text-slate-900">
              {log.actorName}
            </span>
            {log.actorRole && <RoleBadge role={log.actorRole} />}
          </div>
        </div> 
      </td>

      {/* Action Performed */}
      <td className="px-6 py-4 text-sm">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800">
          {log.action}
        </span>
      </td>

      {/* Target Entity */}
      <td className="px-6 py-4 text-sm text-slate-600 font-mono text-xs">
        {log.targetEntity}
      </td>
      
      {/* Entity Type */}
      <td className="px-6 py-4 text-sm text-slate-600">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
          {log.entityType}
        </span>
      </td>
    </tr>
  );
};
