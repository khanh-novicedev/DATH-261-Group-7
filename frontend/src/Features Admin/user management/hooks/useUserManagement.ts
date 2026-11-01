import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FilterState, User } from '../types';
import { fetchUsers } from '../api/userApi';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    role: 'All',
    status: 'All',
  });

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchUsers({
        page,
        size,
        keyword: filters.search || undefined,
        role: filters.role,
        status: filters.status,
      });

      setUsers(result.users);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;

        switch (status) {
          case 403:
            console.error(
              '[UserManagement] 403 FORBIDDEN – You do not have permission to view the user list.',
              err.response.data,
            );
            setError('You do not have permission to access the user list.');
            break;
          default:
            console.error(
              `[UserManagement] Unexpected HTTP ${status}`,
              err.response.data,
            );
            setError(`An unexpected error occurred (HTTP ${status}).`);
        }
      } else {
        console.error('[UserManagement] Network / unknown error', err);
        setError('Unable to connect to the server. Please check your network.');
      }

      setUsers([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

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

    if (selectedUser?.id === userToToggle.id) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    setUserToToggle(null);
  };

  return {
    users,
    filteredUsers: users,
    filters,
    selectedUser,
    userToToggle,
    isModalOpen,
    isLoading,
    error,
    page,
    totalPages,
    totalElements,
    handleFilterChange,
    setSelectedUser,
    promptToggleStatus,
    confirmToggleStatus,
    setIsModalOpen,
    setPage,
    loadUsers,
  };
};
