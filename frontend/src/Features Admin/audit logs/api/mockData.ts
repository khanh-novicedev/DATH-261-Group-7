import { Log } from '../types';

export const initialLogs: Log[] = [
  {
    id: '1',
    date: new Date('2023-10-24T14:32:01'),
    actorName: 'Sarah Jenkins',
    actorRole: 'Admin',
    action: 'SUSPEND_USER',
    entityType: 'app_users',
    entityId: '1245',
    targetEntity: 'app_users: #1245',
  },
  {
    id: '2',
    date: new Date('2023-10-24T13:15:22'),
    actorName: 'Michael Chen',
    actorRole: 'Teacher',
    action: 'DELETE_COURSE',
    entityType: 'courses',
    entityId: '45',
    targetEntity: 'courses: #45',
  },
  {
    id: '3',
    date: new Date('2023-10-24T11:50:05'),
    actorName: 'David Kim',
    actorRole: 'Student',
    action: 'SUBMIT_REPORT',
    entityType: 'reports',
    entityId: '882',
    targetEntity: 'reports: #882',
  },
  {
    id: '4',
    date: new Date('2023-10-24T09:12:44'),
    actorName: 'Sarah Jenkins',
    actorRole: 'Admin',
    action: 'RESOLVE_REPORT',
    entityType: 'reports',
    entityId: '881',
    targetEntity: 'reports: #881',
  }
];
