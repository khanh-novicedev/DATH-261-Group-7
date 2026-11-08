import type { CourseStatus } from '@shared/types';

export type LessonType =
  | 'Video'
  | 'Document'
  | 'Quiz'
  | 'Live Practice'
  | 'Assignment';

export interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  type: LessonType;
  durationOrMeta: string;
  isUnlocked: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorId?: string;
  category?: string | null;
  lessonCount?: number;
  enrolments: number;
  completionRate: number;
  status: CourseStatus;
  thumbnailUrl?: string;
  description?: string;
  prerequisites?: string[];
  lessons?: Lesson[];
  livePracticesCount?: number;
  studentCount?: number;
  forumThreadsCount?: number;
  unansweredThreadsCount?: number;
}

export interface CourseMetricsData {
  totalEnrolments: number;
  completionRate: number;
  totalCourses: number;
}
