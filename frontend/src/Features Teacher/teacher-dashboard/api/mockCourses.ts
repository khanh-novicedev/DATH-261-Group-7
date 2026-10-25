/**
 * Mock data only. Replace the contents of this file with real API calls
 * (and keep the exported names) when the backend is ready.
 */
import type { Announcement, Course } from '../types/course';

export const MOCK_USER = { name: 'User name' };

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-web-dev',
    title: 'Introduction to Web Development',
    instructor: MOCK_USER.name,
    description:
      'Learn how the web works and build your first responsive pages with HTML, CSS and JavaScript.',
    students: 0,
    forumThreads: 0,
    unansweredThreads: 0,
    lessons: [
      { id: 'l1', title: 'Welcome and course overview', type: 'video', detail: 'Video · 12 min', status: 'completed' },
      { id: 'l2', title: 'How the web works', type: 'document', detail: 'Document · 6 min read', status: 'completed' },
      { id: 'l3', title: 'HTML basics check', type: 'quiz', detail: 'Quiz · 10 questions · Score 8/10', status: 'completed' },
      { id: 'l4', title: 'Styling with CSS', type: 'video', detail: 'Video · 18 min', status: 'in-progress' },
      { id: 'l5', title: 'Live coding session', type: 'live', detail: 'Live practice · Sat 25 Oct · 19:00', status: 'not-started' },
      { id: 'l6', title: 'Build a landing page', type: 'assignment', detail: 'Assignment · Due 30 Oct', status: 'not-started' },
      { id: 'l7', title: 'Responsive layout guide', type: 'document', detail: 'Document · 8 min read', status: 'not-started' },
      { id: 'l8', title: 'Final review', type: 'quiz', detail: 'Quiz · 15 questions', status: 'not-started' },
    ],
  },
  {
    id: 'course-data-structures',
    title: 'Data Structures Basics',
    instructor: MOCK_USER.name,
    description: 'Arrays, lists, stacks and queues explained with small practical examples.',
    students: 0,
    forumThreads: 0,
    unansweredThreads: 0,
    lessons: [
      { id: 'd1', title: 'Why data structures matter', type: 'video', detail: 'Video · 10 min', status: 'completed' },
      { id: 'd2', title: 'Arrays and lists', type: 'document', detail: 'Document · 7 min read', status: 'in-progress' },
      { id: 'd3', title: 'Stacks and queues', type: 'video', detail: 'Video · 15 min', status: 'not-started' },
      { id: 'd4', title: 'Practice quiz', type: 'quiz', detail: 'Quiz · 12 questions', status: 'not-started' },
    ],
  },
  {
    id: 'course-english',
    title: 'English Communication Skills',
    instructor: MOCK_USER.name,
    description: 'Everyday speaking and writing practice for confident communication.',
    students: 0,
    forumThreads: 0,
    unansweredThreads: 0,
    lessons: [
      { id: 'e1', title: 'Introducing yourself', type: 'video', detail: 'Video · 8 min', status: 'in-progress' },
      { id: 'e2', title: 'Speaking practice', type: 'live', detail: 'Live practice · Sun 26 Oct · 20:00', status: 'not-started' },
      { id: 'e3', title: 'Write a short email', type: 'assignment', detail: 'Assignment · Due 2 Nov', status: 'not-started' },
    ],
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Announcement', author: 'Admin' },
  { id: 'a2', title: 'Announcement', author: 'Admin' },
];
