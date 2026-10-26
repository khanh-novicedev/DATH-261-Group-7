export type UserRole = 'Student' | 'Teacher' | 'Admin';

export type UserStatus = 'Active' | 'Suspended';

export interface RecentLogin {
  id: string;
  timestamp: string;
  device: string;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  currentLesson: number;
  totalLessons: number;
  progressPercentage: number;
}

export interface PersonalInfo {
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  status: UserStatus;
  initials: string;
  avatarUrl?: string;
  personalInfo?: PersonalInfo;
  recentLogins?: RecentLogin[];
  enrolledCourses?: EnrolledCourse[];
}

export interface FilterState {
  search: string;
  role: 'All' | UserRole;
  status: 'All' | UserStatus;
}
