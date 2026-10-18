import React from 'react';
import { User } from '../types';
import { UserTableRow } from './UserTableRow';
import { SharedTable } from '../../shared/components/SharedTable';

interface UserTableProps {
  users: User[];
  onViewDetail: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

/**
 * UserTable now uses the generic SharedTable component.
 */
export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewDetail,
  onToggleStatus,
}) => {
  return (
    <SharedTable
      items={users}
      renderRow={(user) => (
        <UserTableRow
          key={user.id}
          user={user}
          onViewDetail={onViewDetail}
          onToggleStatus={onToggleStatus}
        />
      )}
      header={(
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avatar &amp; Name
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
      )}
      emptyMessage="No users found matching your filters."
      colSpan={6}
    />
  );
};
