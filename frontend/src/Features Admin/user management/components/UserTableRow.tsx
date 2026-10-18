import React from 'react';
import { MoreVertical, Eye, UserCheck, UserX } from 'lucide-react';
import { User } from '../types';
import { StatusBadge } from './StatusBadge';
import { Dropdown } from '../../shared/components/Dropdown';

interface UserTableRowProps {
  user: User;
  onViewDetail: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onViewDetail,
  onToggleStatus,
}) => {
  const isSuspended = user.status === 'Suspended';

  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
      {/* Avatar & Name */}
      <td className="px-6 py-4">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onViewDetail(user)}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 font-medium flex items-center justify-center text-sm shrink-0">
              {user.initials}
            </div>
          )}
          <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
            {user.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>

      {/* Role */}
      <td className="px-6 py-4 text-sm text-slate-600">{user.role}</td>

      {/* Joined Date */}
      <td className="px-6 py-4 text-sm text-slate-600">{user.joinedDate}</td>

      {/* Account Status */}
      <td className="px-6 py-4"><StatusBadge status={user.status} /></td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <Dropdown trigger={<MoreVertical className="w-4 h-4" />}>
          <button
            type="button"
            onClick={() => onViewDetail(user)}
            className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-500" />
            <span>View Detail</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 transition-colors cursor-pointer ${
              isSuspended ? 'text-green-700 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            {isSuspended ? (
              <>
                <UserCheck className="w-4 h-4 text-green-600" />
                <span>Activate Account</span>
              </>
            ) : (
              <>
                <UserX className="w-4 h-4 text-red-500" />
                <span>Suspend Account</span>
              </>
            )}
          </button>
        </Dropdown>
      </td>
    </tr>
  );
};
