export type LessonType = "video" | "document" | "quiz" | "assignment" | "live";
export type LessonStatus = "completed" | "in-progress" | "not-started";
export type QnaItemKind = "question" | "report";
export type QnaItemStatus = "resolved" | "unresolved";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** Secondary line, e.g. "Video · 12 min" or "Quiz · 10 questions · Score 8/10". */
  detail: string;
  status: LessonStatus;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  students: number;
  forumThreads: number;
  unansweredThreads: number;
  lessons: Lesson[];
}

export interface NewCourseInput {
  name: string;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  author: string;
}

export interface ForumAnswer {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ForumQuestion {
  id: string;
  courseId: string;
  title: string;
  author: string;
  createdAt: string;
  answers: ForumAnswer[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  detail: string;
  status: LessonStatus;

  // New lesson fields
  description?: string;
  openAt?: string;
  closeAt?: string;
  fileName?: string;
  fileUrl?: string;
  accessibleClassIds?: string[];
}

export interface NewLessonInput {
  title: string;
  description: string;
  type: LessonType;
  openAt: string;
  closeAt: string;
  fileName?: string;
  fileUrl?: string;
  accessibleClassIds?: string[];
}

export type QuizQuestionType = "single" | "multiple";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  options: QuizOption[];
  correctOptionIds: string[];
  saved: boolean;
}

export interface QuizData {
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface QnaReply {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  fileName?: string;
  fileUrl?: string;
}

export interface QnaReportItem {
  id: string;
  kind: QnaItemKind;
  title: string;
  status: QnaItemStatus;
  author: string;
  anonymous: boolean;
  className: string;
  courseTitle: string;
  lessonTitle: string;
  content: string;
  createdAt: string;
  fileName?: string;
  fileUrl?: string;
  replies: QnaReply[];
}
