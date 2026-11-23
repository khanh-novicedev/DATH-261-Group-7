// import { apiClient } from '@shared/api';
import type { AuditLogFilterParams, AuditLogListInfo, AuditLogItem, AuditActor } from '../types';

export interface AuditLogResponse {
  data?: AuditLogListInfo;
  items?: AuditLogListInfo['items'];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}


// export async function fetchAuditLogs(params: AuditLogFilterParams = {}): Promise<AuditLogListInfo> {
//   const query: Record<string, string | number> = {};

//   if (params.page !== undefined) query.page = params.page;
//   if (params.size !== undefined) query.size = params.size;
//   if (params.action && params.action !== 'All') query.action = params.action;
//   if (params.actorId) query.actorId = params.actorId;
//   if (params.from) query.from = params.from;
//   if (params.to) query.to = params.to;

//   const response = await apiClient.get<AuditLogResponse | { data: AuditLogListInfo }>('/audit-logs', {
//     params: query,
//   });

//   const resData = response.data as unknown as Record<string, unknown>;
//   if (resData && typeof resData === 'object' && 'data' in resData && resData.data) {
//     const wrapped = resData.data as AuditLogListInfo;
//     return {
//       items: wrapped.items ?? [],
//       page: wrapped.page ?? 0,
//       size: wrapped.size ?? 20,
//       totalElements: wrapped.totalElements ?? 0,
//       totalPages: wrapped.totalPages ?? 0,
//     };
//   }

//   const direct = resData as unknown as AuditLogListInfo;
//   return {
//     items: direct?.items ?? [],
//     page: direct?.page ?? 0,
//     size: direct?.size ?? 20,
//     totalElements: direct?.totalElements ?? 0,
//     totalPages: direct?.totalPages ?? 0,
//   };
// }

const MOCK_ACTORS: Record<string, AuditActor> = {
  user_1: {
    id: 'user_1',
    fullName: 'Nguyễn Văn An',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=user_1',
  },
  user_2: {
    id: 'user_2',
    fullName: 'Trần Thị Bình',
    role: 'Editor',
    avatarUrl: 'https://i.pravatar.cc/150?u=user_2',
  },
  user_3: {
    id: 'user_3',
    fullName: 'Lê Hoàng Cường',
    role: 'Viewer',
  },
};

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_001',
    actor: MOCK_ACTORS.user_1,
    action: 'CREATE',
    entityType: 'PROJECT',
    entityId: 'proj_101',
    createdAt: '2026-11-23T08:15:00.000Z',
  },
  {
    id: 'log_002',
    actor: MOCK_ACTORS.user_2,
    action: 'ACTIVE_USER',
    entityType: 'DOCUMENT',
    entityId: 'doc_205',
    createdAt: '2026-11-23T09:30:00.000Z',
  },
  {
    id: 'log_003',
    actor: MOCK_ACTORS.user_1,
    action: 'DELETE',
    entityType: 'USER',
    entityId: 'usr_99',
    createdAt: '2026-11-22T14:20:00.000Z',
  },
  {
    id: 'log_004',
    actor: MOCK_ACTORS.user_3,
    action: 'LOGIN',
    entityType: 'SESSION',
    entityId: 'sess_881',
    createdAt: '2026-11-22T10:05:00.000Z',
  },
  {
    id: 'log_005',
    actor: MOCK_ACTORS.user_2,
    action: 'SUSPEND_USER',
    entityType: 'REPORT',
    entityId: 'rep_402',
    createdAt: '2026-11-21T16:45:00.000Z',
  },
  {
    id: 'log_006',
    actor: MOCK_ACTORS.user_1,
    action: 'UPDATE',
    entityType: 'SETTINGS',
    entityId: 'cfg_global',
    createdAt: '2026-11-20T11:10:00.000Z',
  },
];

export async function fetchAuditLogs(
  params: AuditLogFilterParams = {}
): Promise<AuditLogListInfo> {
  // Giả lập độ trễ mạng 300ms
  await new Promise((resolve) => setTimeout(resolve, 300));

  const page = params.page ?? 0;
  const size = params.size ?? 20;

  let filtered = [...MOCK_AUDIT_LOGS];

  // Lọc theo action
  if (params.action && params.action !== 'All') {
    filtered = filtered.filter(
      (item) => item.action.toLowerCase() === params.action!.toLowerCase()
    );
  }

  // Lọc theo actorId
  if (params.actorId) {
    filtered = filtered.filter((item) => item.actor.id === params.actorId);
  }

  // Lọc theo khoảng thời gian (from / to)
  if (params.from) {
    const fromTime = new Date(params.from).getTime();
    if (!Number.isNaN(fromTime)) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt).getTime() >= fromTime
      );
    }
  }

  if (params.to) {
    const toTime = new Date(params.to).getTime();
    if (!Number.isNaN(toTime)) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt).getTime() <= toTime
      );
    }
  }

  // Lọc theo từ khóa search (tìm trong tên actor, action, entityType, entityId)
  if (params.search && params.search.trim() !== '') {
    const keyword = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.actor.fullName.toLowerCase().includes(keyword) ||
        item.action.toLowerCase().includes(keyword) ||
        item.entityType.toLowerCase().includes(keyword) ||
        item.entityId.toLowerCase().includes(keyword)
    );
  }

  // Sắp xếp mới nhất lên đầu
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Tính toán phân trang (0-indexed giống hàm gốc của bạn)
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size);
  const startIndex = page * size;
  const items = filtered.slice(startIndex, startIndex + size);

  return {
    items,
    page,
    size,
    totalElements,
    totalPages,
  };
}