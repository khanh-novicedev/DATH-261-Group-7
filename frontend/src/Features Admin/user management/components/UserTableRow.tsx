import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, UserX, UserCheck } from 'lucide-react';
import { User } from '../types';
import { StatusBadge } from './StatusBadge';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <td className="px-6 py-4 text-sm text-slate-600">
        {user.email}
      </td>

      {/* Role */}
      <td className="px-6 py-4 text-sm text-slate-600">
        {user.role}
      </td>

      {/* Joined Date */}
      <td className="px-6 py-4 text-sm text-slate-600">
        {user.joinedDate}
      </td>

      {/* Account Status */}
      <td className="px-6 py-4">
        <StatusBadge status={user.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="relative inline-block" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="User actions"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Action Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onViewDetail(user);
                }}
                className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                View Detail
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleStatus(user);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2.5 transition-colors cursor-pointer ${
                  isSuspended
                    ? 'text-green-700 hover:bg-green-50'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                {isSuspended ? (
                  <>
                    <UserCheck className="w-4 h-4 text-green-600" />
                    Activate Account
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 text-red-500" />
                    Suspend Account
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
