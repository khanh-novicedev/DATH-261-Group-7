import { User } from '../types';
import avatarImg from '../../../Shared/assets/avatar.png';

export const initialUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Student',
    email: 'alex.student@example.com',
    role: 'Student',
    joinedDate: 'Oct 24, 2023',
    status: 'Active',
    initials: 'AS',
    avatarUrl: avatarImg,
    personalInfo: {
      dateOfBirth: 'October 12, 1998',
      phoneNumber: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
    },
    recentLogins: [
      { id: 'l-1', timestamp: 'Today, 10:42 AM', device: 'Chrome on macOS' },
      { id: 'l-2', timestamp: 'Yesterday, 8:15 PM', device: 'Safari on iOS' },
    ],
    enrolledCourses: [
      {
        id: 'c-1',
        title: 'Advanced Data Structures',
        instructor: 'Prof. Sarah Jenkins',
        currentLesson: 5,
        totalLessons: 12,
        progressPercentage: 42,
      },
      {
        id: 'c-2',
        title: 'Introduction to Machine Learning',
        instructor: 'Dr. Michael Chen',
        currentLesson: 2,
        totalLessons: 8,
        progressPercentage: 25,
      },
    ],
  },
  {
    id: 'user-2',
    name: 'Jane Teacher',
    email: 'jane.teacher@example.com',
    role: 'Teacher',
    joinedDate: 'Sep 12, 2023',
    status: 'Active',
    initials: 'JT',
    personalInfo: {
      dateOfBirth: 'March 22, 1989',
      phoneNumber: '+1 (555) 987-6543',
      address: '456 College Ave, Boston, MA 02115',
    },
    recentLogins: [
      { id: 'l-3', timestamp: 'Today, 08:15 AM', device: 'Firefox on Windows' },
      { id: 'l-4', timestamp: '2 days ago', device: 'Chrome on Android' },
    ],
    enrolledCourses: [
      {
        id: 'c-3',
        title: 'Curriculum Planning & Pedagogy',
        instructor: 'Dean Adams',
        currentLesson: 8,
        totalLessons: 10,
        progressPercentage: 80,
      },
    ],
  },
  {
    id: 'user-3',
    name: 'Bob Admin',
    email: 'bob.admin@example.com',
    role: 'Student',
    joinedDate: 'Aug 01, 2023',
    status: 'Suspended',
    initials: 'BA',
    personalInfo: {
      dateOfBirth: 'July 15, 1995',
      phoneNumber: '+1 (555) 234-5678',
      address: '789 Market St, San Francisco, CA 94103',
    },
    recentLogins: [
      { id: 'l-5', timestamp: 'Aug 01, 2023, 11:20 AM', device: 'Edge on Windows' },
    ],
    enrolledCourses: [
      {
        id: 'c-4',
        title: 'Web Security Fundamentals',
        instructor: 'Prof. Alex Thorne',
        currentLesson: 1,
        totalLessons: 15,
        progressPercentage: 6,
      },
    ],
  },
  {
    id: 'user-4',
    name: 'Charlie Student',
    email: 'charlie.student@example.com',
    role: 'Student',
    joinedDate: 'Nov 15, 2023',
    status: 'Suspended',
    initials: 'CS',
    personalInfo: {
      dateOfBirth: 'December 05, 2001',
      phoneNumber: '+1 (555) 345-6789',
      address: '101 Pine St, Seattle, WA 98101',
    },
    recentLogins: [
      { id: 'l-6', timestamp: 'Nov 14, 2023, 03:45 PM', device: 'Chrome on macOS' },
    ],
    enrolledCourses: [
      {
        id: 'c-5',
        title: 'Database Management Systems',
        instructor: 'Dr. Emily Ross',
        currentLesson: 3,
        totalLessons: 12,
        progressPercentage: 25,
      },
    ],
  },
];
