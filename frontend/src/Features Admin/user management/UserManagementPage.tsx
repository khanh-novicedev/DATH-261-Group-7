import React from 'react';
import { TablePagination } from '../shared/components/TablePagination';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { UserDetail } from './components/UserDetail';
import { ConfirmModal } from './components/ConfirmModal';
import { useUserManagement } from './hooks/useUserManagement';

export const UserManagementPage: React.FC = () => {
  const {
    filteredUsers,
    filters,
    selectedUser,
    userToToggle,
    isModalOpen,
    page,
    totalPages,
    totalElements,
    size,
    setSize,
    setPage,
    handleFilterChange,
    setSelectedUser,
    promptToggleStatus,
    confirmToggleStatus,
    setIsModalOpen,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      {selectedUser ? (
        /* User Detail View */
        <UserDetail
          user={selectedUser}
          onBack={() => setSelectedUser(null)}
          onToggleStatus={promptToggleStatus}
        />
      ) : (
        /* User Management Table View */
        <>
          {/* Page Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              Manage your students, teachers.
            </p>
          </div>

          {/* Toolbar / Filters */}
          <UserFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Users Table */}
          <UserTable
            users={filteredUsers}
            onViewDetail={(user) => setSelectedUser(user)}
            onToggleStatus={promptToggleStatus}
          />

          {/* Pagination Controls */}
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            onPageChange={setPage}
            onSizeChange={setSize}
          />
        </>
      )}

      {/* Confirmation Modal for Suspend/Activate */}
      <ConfirmModal
        user={userToToggle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
};

export default UserManagementPage;
