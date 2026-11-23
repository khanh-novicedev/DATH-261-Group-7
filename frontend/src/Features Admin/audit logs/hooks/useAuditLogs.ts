import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { AuditLogFilterParams, AuditLogItem, Log } from '../types';
import { fetchAuditLogs } from '../api/auditLogApi';

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function mapAuditLogItemToLog(item: AuditLogItem): Log {
  return {
    id: item.id,
    date: new Date(item.createdAt),
    actorName: item.actor?.fullName || 'System / Anonymous',
    actorRole: item.actor?.role,
    actorAvatarUrl: item.actor?.avatarUrl,
    actorInitials: getInitials(item.actor?.fullName),
    action: item.action,
    entityType: item.entityType || 'N/A',
    entityId: item.entityId || '',
    targetEntity: `${item.entityType || 'Entity'}: #${item.entityId ? item.entityId.slice(0, 8) : 'N/A'}`,
  };
}

export const useAuditLogs = () => {
  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<AuditLogFilterParams>({
    search: '',
    action: undefined,
    actorRole: 'All',
    actorId: undefined,
    from: undefined,
    to: undefined,
  });

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchAuditLogs({
        page,
        size,
        action: filters.action,
        actorId: filters.actorId,
        from: filters.from,
        to: filters.to,
      });

      setItems(result.items || []);
      setTotalElements(result.totalElements || 0);
      setTotalPages(result.totalPages || 0);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        switch (status) {
          case 403:
            console.error('[AuditLogs] 403 FORBIDDEN - Not authorized to view audit logs.', err.response.data);
            setError('You do not have permission to view system audit logs.');
            break;
          default:
            console.error(`[AuditLogs] Unexpected HTTP ${status}`, err.response.data);
            setError(`Failed to load audit logs (HTTP ${status}).`);
        }
      } else {
        console.error('[AuditLogs] Network / unknown error', err);
        setError('Unable to connect to the server. Please check your network connection.');
      }
      setItems([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, filters.action, filters.actorId, filters.from, filters.to]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleFilterChange = (newFilters: Partial<AuditLogFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  // Convert raw API items into Log objects for UI
  const rawLogs = useMemo(() => items.map(mapAuditLogItemToLog), [items]);

  // Client-side filtering for keyword and actorRole (if actorRole is filtered)
  const filteredLogs = useMemo(() => {
    const q = (filters.search || '').trim().toLowerCase();
    const roleFilter = filters.actorRole || 'All';

    return rawLogs.filter((log) => {
      // Role filter check
      const matchesRole =
        roleFilter === 'All' ||
        (log.actorRole && log.actorRole.toLowerCase() === roleFilter.toLowerCase());

      // Search keyword filter check
      const matchesSearch =
        !q ||
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetEntity.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [rawLogs, filters.search, filters.actorRole]);

  return {
    logs: rawLogs,
    filteredLogs,
    filters,
    isLoading,
    error,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    setSize: handleSizeChange,
    handleFilterChange,
    reload: loadLogs,
  };
};

export const useAduditLogs = useAuditLogs;
