import React from 'react';
import { User } from '../types';
import { UserTableRow } from './UserTableRow';
import { SharedTable } from '../../shared/components/SharedTable';

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
      header={["Avatar & Name", "Email", "Role", "Joined Date", "Account Status", "Actions"]}
      emptyMessage="No users found matching your filters."
      colSpan={6}
    />
  );
};
