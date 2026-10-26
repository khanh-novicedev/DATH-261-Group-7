import { Log } from '../types';
// import avatarImg from '../../../Shared/assets/avatar.png';

export const initialLogs: Log[] = [
  {
    id: 1,
    date: new Date('2023-10-24T14:32:01'),
    actorName: 'Sarah Jenkins',
    actorRole: 'Admin',
    action: 'Suspended Account',
    targetEntity: 'User ID: #1245',
    ipAddress: '192.0.2.104'
  },
  {
    id: 2,
    date: new Date('2023-10-24T13:15:22'),
    actorName: 'Michael Chen',
    actorRole: 'Teacher',
    action: 'Deleted Course',
    targetEntity: 'Course: Soft Skills 101',
    ipAddress: '198.51.100.45'
  },
  {
    id: 3,
    date: new Date('2023-10-24T11:50:05'),
    actorName: 'David Kim',
    actorRole: 'Student',
    action: 'Submitted Report',
    targetEntity: 'Report ID: #882',
    ipAddress: '203.0.113.18'
  },
  {
    id: 4,
    date: new Date('2023-10-24T09:12:44'),
    actorName: 'Sarah Jenkins',
    actorRole: 'Admin',
    action: 'Resolved Report',
    targetEntity: 'Report ID: #881',
    ipAddress: '192.0.2.104'
  }
];