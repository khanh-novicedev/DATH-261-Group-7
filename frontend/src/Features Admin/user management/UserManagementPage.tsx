import React, { useState } from 'react';
import { AdminHeader } from '../shared/components/AdminHeader';
import { UserFilters } from './components/UserFilters';
import { UserTable } from './components/UserTable';
import { UserDetail } from './components/UserDetail';
import { ConfirmModal } from './components/ConfirmModal';
import { useUserManagement } from './hooks/useUserManagement';

interface UserManagementPageProps {
  onTabChange?: (tab: string) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState('User Management');

  const {
    filteredUsers,
    filters,
    selectedUser,
    userToToggle,
    isModalOpen,
    handleFilterChange,
    setSelectedUser,
    promptToggleStatus,
    confirmToggleStatus,
    setIsModalOpen,
  } = useUserManagement();

  const handleHeaderTabChange = (tab: string) => {
    setCurrentTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <AdminHeader activeTab={currentTab} onTabChange={handleHeaderTabChange} />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
          </>
        )}
      </main>

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
