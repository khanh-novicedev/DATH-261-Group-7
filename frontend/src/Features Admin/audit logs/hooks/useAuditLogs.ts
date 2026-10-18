import { useState, useMemo } from 'react';
import { FilterState, Log } from '../types';
import { initialLogs } from '../api/mockData';

export const useAduditLogs = () => {
  // const [users, setUsers] = useState<User[]>(initialUsers);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // const [userToToggle, setUserToToggle] = useState<User | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [logs] = useState<Log[]>(initialLogs);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: new Date(0),
    endDate: new Date(),
    actorRole: 'All',
    action: 'All',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter (actor name, target entity)
      const matchesSearch =
        filters.search.trim() === '' ||
        log.actorName.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.targetEntity.toLowerCase().includes(filters.search.toLowerCase());

      // Date filter
      const matchesDate = 
        filters.startDate < log.date && log.date < filters.endDate;

      // Role filter
      const matchesRole =
        filters.actorRole === 'All' || log.actorRole === filters.actorRole;

      // ActionType filter
      const matchesAction =
        filters.action === 'All' || log.action === filters.action;

      return matchesSearch && matchesDate && matchesRole && matchesAction;
    });
  }, [logs, filters]);

  return {
    logs,
    filteredLogs,
    filters,
    // selectedUser,
    // userToToggle,
    // isModalOpen,
    handleFilterChange,
    // setSelectedUser,
    // promptToggleStatus,
    // confirmToggleStatus,
    // setIsModalOpen,
  };
};
