export type ReportStatus = 'PENDING' | 'DELETE_CONTENT' | 'WARN_USER' | 'DISMISS';

export const REPORT_STATUSES: ReportStatus[] = [
  'PENDING',
  'DELETE_CONTENT',
  'WARN_USER',
  'DISMISS',
];

export interface ReportReporter {
  id: string;
  fullName: string;
}

export interface ReportItemDto {
  id: string;
  reporter: ReportReporter;
  entityType: string;
  entityId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
}

export interface ReportItem {
  id: string;
  name: string;
  date: Date;
  status: ReportStatus;
  entityType: string;
  entityId: string;
  reason: string;
  reportedContent?: string;
  reportedPage?: string;
  resolvedBy?: string | null;
  resolvedAt?: string | null;
}

export interface ReportFilterState {
  status: 'ALL' | ReportStatus;
  search: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ReportListInfo {
  items: ReportItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
