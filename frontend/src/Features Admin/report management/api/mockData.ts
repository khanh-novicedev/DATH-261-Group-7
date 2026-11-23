import { ReportItem } from '../types';

export const initialReports: ReportItem[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    date: new Date('2023-10-24T14:32:01'),
    entityType: 'QNA',
    entityId: '882',
    reason: 'Inappropriate language in lecture comments.',
    status: 'PENDING',
    reportedContent: 'This user keeps posting rude remarks in question threads.',
    reportedPage: 'QNA #882',
  },
  {
    id: '2',
    name: 'Alex Rivera',
    date: new Date('2023-10-23T11:15:00'),
    entityType: 'QNA',
    entityId: '883',
    reason: 'Spam link to external commercial website.',
    status: 'DELETE_CONTENT',
    reportedContent: 'Check out this website for free test answers: spam-link.com',
    reportedPage: 'QNA #883',
  },
  {
    id: '3',
    name: 'Maria Garcia',
    date: new Date('2023-10-22T09:40:12'),
    entityType: 'QNA',
    entityId: '880',
    reason: 'Repeated disruption during discussion forum.',
    status: 'WARN_USER',
    reportedContent: 'Continuous spamming of identical questions.',
    reportedPage: 'QNA #880',
  }
];
