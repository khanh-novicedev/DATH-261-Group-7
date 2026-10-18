export type UserRole = 'Student' | 'Teacher' | 'Admin'; //NOTE: trùng với trang User

export type ActionType = 'Created Account' | 'Suspended Account' | 'Activated Acount' | 'Created Coure' | 'Deleted Course' | 'Submitted Report' | 'Resolved Report';

export interface Log {
  id: number;
  date: Date;
  actorName: string;
  actorRole: UserRole;
  actorAvatarUrl?: string;
  actorInitials?: string;
  action: ActionType;
  targetEntity: string;
  ipAddress: string;
}

export interface FilterState {
  search: string;
  startDate: Date;
  endDate: Date;
  action: 'All' | ActionType;
  actorRole: 'All' | UserRole;
}
