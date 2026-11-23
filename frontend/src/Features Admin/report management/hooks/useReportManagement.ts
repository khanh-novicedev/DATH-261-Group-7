import { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ReportFilterState, ReportItem, ReportItemDto, ReportStatus } from '../types';
import { Metric } from '../../shared/types/Metric';
import { fetchReports } from '../api/reportApi';

function mapReportDtoToItem(dto: ReportItemDto): ReportItem {
  return {
    id: dto.id,
    name: dto.reporter?.fullName || 'Anonymous Reporter',
    date: new Date(dto.createdAt),
    status: dto.status,
    entityType: dto.entityType || 'QNA',
    entityId: dto.entityId || '',
    reason: dto.reason || '',
    reportedPage: `${dto.entityType || 'Content'} #${dto.entityId?.slice(0, 8) || ''}`,
    resolvedBy: dto.resolvedBy,
    resolvedAt: dto.resolvedAt,
  };
}

export const useReportManagement = () => {
  const [items, setItems] = useState<ReportItemDto[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ReportFilterState>({
    search: '',
    status: 'PENDING',
    startDate: undefined,
    endDate: undefined,
  });

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchReports({
        page,
        size,
        status: filters.status,
      });

      setItems(result.items || []);
      setTotalElements(result.totalElements || 0);
      setTotalPages(result.totalPages || 0);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        switch (status) {
          case 403:
            console.error('[ReportManagement] 403 FORBIDDEN - Not authorized to view reports.', err.response.data);
            setError('You do not have permission to access reported content.');
            break;
          default:
            console.error(`[ReportManagement] Unexpected HTTP ${status}`, err.response.data);
            setError(`Failed to load reports (HTTP ${status}).`);
        }
      } else {
        console.error('[ReportManagement] Network error', err);
        setError('Unable to connect to the server. Please check your network connection.');
      }
      setItems([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, size, filters.status]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleFilterChange = (newFilters: Partial<ReportFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const handleUpdateStatus = (id: string, newStatus: ReportStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleDismissReport = (id: string) => {
    handleUpdateStatus(id, 'DISMISS');
  };

  const handleWarnUser = (id: string) => {
    handleUpdateStatus(id, 'WARN_USER');
  };

  const handleDeleteContent = (id: string) => {
    handleUpdateStatus(id, 'DELETE_CONTENT');
  };

  const handleResolveReport = (id: string) => {
    handleDeleteContent(id);
  };

  const reports = useMemo(() => items.map(mapReportDtoToItem), [items]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Search
      const q = filters.search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        report.name.toLowerCase().includes(q) ||
        report.reason.toLowerCase().includes(q) ||
        report.entityId.toLowerCase().includes(q) ||
        report.entityType.toLowerCase().includes(q);

      // Date filter
      const matchesDate =
        (!filters.startDate || report.date >= filters.startDate) &&
        (!filters.endDate || report.date <= filters.endDate);

      return matchesSearch && matchesDate;
    });
  }, [reports, filters.search, filters.startDate, filters.endDate]);

  const metrics: Metric[] = useMemo(() => {
    const pendingCount = items.filter((i) => i.status === 'PENDING').length;
    const resolvedCount = items.filter((i) => i.status === 'DELETE_CONTENT' || i.status === 'WARN_USER').length;

    return [
      {
        title: 'Total Reports',
        value: totalElements || items.length,
      },
      {
        title: 'Pending Reports',
        value: filters.status === 'PENDING' ? totalElements || pendingCount : pendingCount,
      },
      {
        title: 'Resolved / Actioned',
        value: resolvedCount,
      },
    ];
  }, [items, totalElements, filters.status]);

  return {
    reports,
    filteredReports,
    metrics,
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
    handleDismissReport,
    handleWarnUser,
    handleDeleteContent,
    handleResolveReport,
    reload: loadReports,
  };
};

export default useReportManagement;
