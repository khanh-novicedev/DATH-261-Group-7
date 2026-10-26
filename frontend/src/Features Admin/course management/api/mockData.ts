import { Course, CourseMetricsData, Lesson } from '../types';
import reactThumb from '../../../Shared/assets/course-react.png';
import uiThumb from '../../../Shared/assets/course-ui.png';
import fullstackThumb from '../../../Shared/assets/course-fullstack.png';

export const defaultLessons: Lesson[] = [
  {
    id: 'l-1',
    lessonNumber: 1,
    title: 'Introduction',
    type: 'Video',
    durationOrMeta: 'Video · 15 min',
    isUnlocked: true,
  },
  {
    id: 'l-2',
    lessonNumber: 2,
    title: 'Foundations',
    type: 'Document',
    durationOrMeta: 'Document · 10 min read',
    isUnlocked: true,
  },
  {
    id: 'l-3',
    lessonNumber: 3,
    title: 'Quiz 1',
    type: 'Quiz',
    durationOrMeta: 'Quiz · 10 questions',
    isUnlocked: true,
  },
  {
    id: 'l-4',
    lessonNumber: 4,
    title: 'Advanced Concepts',
    type: 'Video',
    durationOrMeta: 'Video · 20 min',
    isUnlocked: true,
  },
  {
    id: 'l-5',
    lessonNumber: 5,
    title: 'Live Practice',
    type: 'Live Practice',
    durationOrMeta: 'Live practice · Date · Time',
    isUnlocked: true,
  },
  {
    id: 'l-6',
    lessonNumber: 6,
    title: 'Assignment',
    type: 'Assignment',
    durationOrMeta: 'Assignment · Due date',
    isUnlocked: true,
  },
  {
    id: 'l-7',
    lessonNumber: 7,
    title: 'Final Document',
    type: 'Document',
    durationOrMeta: 'Document · 15 min read',
    isUnlocked: true,
  },
  {
    id: 'l-8',
    lessonNumber: 8,
    title: 'Final Quiz',
    type: 'Quiz',
    durationOrMeta: 'Quiz · 15 questions',
    isUnlocked: true,
  },
];

export const initialCourses: Course[] = [
  {
    id: 'c-1',
    title: 'Advanced React Patterns',
    instructor: 'Sarah Jenkins',
    enrolments: 1240,
    completionRate: 68,
    status: 'Published',
    thumbnailUrl: reactThumb,
    description:
      "This course is designed to provide a comprehensive overview of the platform's core features and best practices for course creation. It covers everything from setting up your first lesson to managing advanced user permissions.",
    prerequisites: [
      'Basic understanding of course management systems',
      'Access to the admin dashboard',
      'Familiarity with user roles and permissions',
    ],
    lessons: defaultLessons,
    livePracticesCount: 1,
    studentCount: 0,
    forumThreadsCount: 0,
    unansweredThreadsCount: 0,
  },
  {
    id: 'c-2',
    title: 'UI Design Fundamentals',
    instructor: 'Michael Chen',
    enrolments: 850,
    completionRate: 45,
    status: 'Published',
    thumbnailUrl: uiThumb,
    description:
      'Master the principles of visual design, spacing, typography, component hierarchies, and modern user experience patterns.',
    prerequisites: [
      'Basic design familiarity',
      'Curiosity for user-centric digital experiences',
    ],
    lessons: defaultLessons.slice(0, 6),
    livePracticesCount: 1,
    studentCount: 0,
    forumThreadsCount: 2,
    unansweredThreadsCount: 0,
  },
  {
    id: 'c-3',
    title: 'Full Stack Development',
    instructor: 'David Kim',
    enrolments: 2100,
    completionRate: 82,
    status: 'Published',
    thumbnailUrl: fullstackThumb,
    description:
      'From database modeling and REST APIs to reactive frontends and deployment pipelines, build production-grade web applications from scratch.',
    prerequisites: [
      'JavaScript fundamentals',
      'Basic command line & Git familiarity',
    ],
    lessons: defaultLessons,
    livePracticesCount: 2,
    studentCount: 0,
    forumThreadsCount: 5,
    unansweredThreadsCount: 1,
  },
];

export const initialMetrics: CourseMetricsData = {
  totalEnrolments: 4190,
  completionRate: 70,
  totalCourses: 3,
};
