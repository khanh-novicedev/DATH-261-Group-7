export type UserRole = 'Learner' | 'Instructor' | 'Admin';

export type UserStatus = 'ACTIVE' | 'SUSPENDED';

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
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  initials?: string;
  avatarUrl?: string;
  personalInfo?: PersonalInfo;
  recentLogins?: RecentLogin[];
  enrolledCourses?: EnrolledCourse[];
}

export interface FilterState {
  page?: number;
  size?: number;
  keyword?: string;
  role?: 'All' | UserRole;
  status?: 'All' | UserStatus;
}
