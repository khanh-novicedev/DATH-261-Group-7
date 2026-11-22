import type {
  AssignmentType,
  CompletionStatus,
  CourseStatus,
  LessonType,
  UserRole,
  UUID,
} from "@shared/types";
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LessonDto {
  id: UUID;
  sequenceNumber: number;
  title: string;
  type: LessonType;
  contentUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseDto {
  id: UUID;
  instructorId: UUID | null;
  instructor?: InstructorSummary | null;
  title: string;
  description: string | null;
  category: string | null;
  prerequisites?: string | null;
  status: CourseStatus;
  enrolled?: boolean;
  lessons: LessonDto[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstructorSummary {
  id: UUID;
  fullName: string;
}

export interface CourseCatalogItem {
  id: UUID;
  title: string;
  description: string | null;
  category: string | null;
  status: CourseStatus;
  instructor: InstructorSummary | null;
  lessonCount: number;
}

export interface EnrolResult {
  enrolmentId: UUID;
  courseId: UUID;
  completionStatus: CompletionStatus;
  enrolledAt: string;
}

export interface EnrolmentDto {
  enrolmentId: UUID;
  course: { id: UUID; title: string; category: string | null };
  completionStatus: CompletionStatus;
  progressPercent: number;
  lastPositionLessonId: UUID | null;
  enrolledAt: string;
}

export interface LessonProgressDto {
  lessonId: UUID;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface CourseProgressDto {
  courseId: UUID;
  userId: UUID;
  completionStatus: CompletionStatus;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  lastPositionLessonId: UUID | null;
  lessons: LessonProgressDto[];
}

export interface QnaAuthor {
  id: UUID;
  fullName: string;
  role: UserRole | null;
}

export interface QnaPostDto {
  id: UUID;
  author: QnaAuthor;
  content: string;
  createdAt: string;
}

export interface QnaThreadDto extends QnaPostDto {
  replies: QnaPostDto[];
}

export interface AssignmentDto {
  id: UUID;
  lessonId: UUID;
  title: string;
  type: AssignmentType;
  instructions: string | null;
  passScore: number | null;
  deadline: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmissionDto {
  id: UUID;
  assignmentId: UUID;
  learnerId: UUID;
  learnerName: string;
  fileUrl: string;
  score: number | null;
  feedback: string | null;
  gradedBy: UUID | null;
  submittedAt: string;
  gradedAt: string | null;
}
