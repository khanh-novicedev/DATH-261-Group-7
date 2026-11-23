import { UserRole } from '../../../Shared/types/index'

export type AuditLogAction = 'ACTIVE_USER' | 'SUSPEND_USER';

export const AUDIT_LOG_ACTIONS: AuditLogAction[] = ['ACTIVE_USER', 'SUSPEND_USER'];

export const USER_ROLES: UserRole[] = ['LEARNER', 'ADMIN', 'INSTRUCTOR'];

export interface AuditActor {
  id: string;
  fullName: string;
  role?: string;
  avatarUrl?: string;
}

export interface AuditLogItem {
  id: string;
  actor: AuditActor;
  action: AuditLogAction | string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export interface Log {
  id: string;
  date: Date;
  actorName: string;
  actorRole?: string;
  actorAvatarUrl?: string;
  actorInitials?: string;
  action: AuditLogAction | string;
  entityType: string;
  entityId: string;
  targetEntity: string;
}

export interface AuditLogFilterParams {
  page?: number;
  size?: number;
  action?: AuditLogAction | string;
  actorRole?: 'All' | UserRole;
  actorId?: string;
  from?: string; // ISO date string
  to?: string;   // ISO date string
  search?: string; // client search helper if needed
}

export interface AuditLogListInfo {
  items: AuditLogItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
