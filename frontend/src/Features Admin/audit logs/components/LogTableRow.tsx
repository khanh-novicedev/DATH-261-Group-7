import React from 'react';
import { Log } from '../types';
import { RoleBadge } from './RoleBadge';


interface LogTableRowProps {
  log: Log;
}

export const LogTableRow: React.FC<LogTableRowProps> = ({
  log
}) => {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
      {/* Date & Time */}
      <td className="px-6 py-4">{log.date.toDateString()}</td>
      
      {/* Avatar & Name */}
      <td>
        <div className="flex items-center gap-3 cursor-pointer group">
          {log.actorAvatarUrl ? (
            <img
              src={log.actorAvatarUrl}
              alt={log.actorName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 font-medium flex items-center justify-center text-sm shrink-0">
              {log.actorInitials}
            </div>
          )}
          <div className='flex flex-col'>
            <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
              {log.actorName}
            </span>
            <RoleBadge role={log.actorRole}/>
          </div>
          
        </div> 
      </td>

      {/* Action Performed */}
      <td className="px-6 py-4 text-sm text-slate-600">{log.action}</td>

      {/* TargetEntity */}
      <td className="px-6 py-4 text-sm text-slate-600">{log.targetEntity}</td>
      
      {/* IP Address */}
      <td className="px-6 py-4 text-sm text-slate-600">{log.ipAddress}</td>
    </tr>
  );
};
