import { useState, useMemo } from 'react';
import { FilterState, User } from '../types';
import { initialUsers } from '../api/mockData';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: 'All',
    status: 'All',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter (name or email)
      const matchesSearch =
        filters.search.trim() === '' ||
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());

      // Role filter
      const matchesRole =
        filters.role === 'All' || user.role === filters.role;

      // Status filter
      const matchesStatus =
        filters.status === 'All' || user.status === filters.status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  const promptToggleStatus = (user: User) => {
    setUserToToggle(user);
    setIsModalOpen(true);
  };

  const confirmToggleStatus = () => {
    if (!userToToggle) return;

    const newStatus = userToToggle.status === 'Active' ? 'Suspended' : 'Active';

    setUsers((prev) =>
      prev.map((u) => (u.id === userToToggle.id ? { ...u, status: newStatus } : u))
    );

    // If currently viewing details of this user, update it as well
    if (selectedUser?.id === userToToggle.id) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    setUserToToggle(null);
  };

  return {
    users,
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
  };
};
