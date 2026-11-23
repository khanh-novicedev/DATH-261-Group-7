import { apiClient } from '@shared/api';
import type { ReportItemDto, ReportListInfo, ReportStatus } from '../types';

export interface ReportResponse {
  success?: boolean;
  message?: string;
  data?: ReportItemDto[] | ReportListInfo;
  items?: ReportItemDto[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface GetReportsParams {
  status?: ReportStatus | 'ALL';
  page?: number;
  size?: number;
}

export async function fetchReports(params: GetReportsParams = {}): Promise<ReportListInfo> {
  const query: Record<string, string | number> = {};

  if (params.page !== undefined) query.page = params.page;
  if (params.size !== undefined) query.size = params.size;
  if (params.status && params.status !== 'ALL') {
    query.status = params.status;
  }

  const response = await apiClient.get<ReportResponse>('/reports', {
    params: query,
  });

  const res = response.data;
  const list = res.data as ReportItemDto[];
  const pageSize = params.size ?? (list.length > 0 ? list.length : 20);
  const currentPage = params.page ?? 0;
  return {
    items: list,
    page: currentPage,
    size: pageSize,
    totalElements: list.length,
    totalPages: list.length > 0 ? Math.ceil(list.length / pageSize) : 1,
  };
}