import React from 'react';
import { User } from '../types';
import { UserTableRow } from './UserTableRow';

interface UserTableProps {
  users: User[];
  onViewDetail: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewDetail,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
      <table className="w-full text-left border-collapse min-w-190">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avatar & Name
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Joined Date
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Account Status
            </th>
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.length > 0 ? (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onViewDetail={onViewDetail}
                onToggleStatus={onToggleStatus}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                No users found matching your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
