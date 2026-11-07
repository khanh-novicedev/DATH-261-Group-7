import { apiRequest } from "./apiClient";

export type ApiCourseStatus = "DRAFT" | "PUBLISHED";

export type ApiLessonType =
  | "VIDEO"
  | "TEXT"
  | "LIVE_PRACTICE";

export interface CourseRequest {
  title: string;
  description: string;
  category: string;
  prerequisites: string;
  status: ApiCourseStatus;
  lessons: ApiLessonRequest[];
}

export interface ApiLessonRequest {
  id: string;
  sequenceNumber: number;
  title: string;
  type: ApiLessonType;
  contentUrl?: string | null;
}

export interface CourseResponse {
  id: string;
  instructorId: string | null;
  title: string;
  description: string | null;
  category: string | null;
  prerequisites?: string | null;
  status: ApiCourseStatus | "HIDDEN";
  lessons: ApiLessonRequest[];
  createdAt: string | null;
  updatedAt: string | null;
}

// API-12: Create Course
export function createCourse(data: CourseRequest) {
  return apiRequest<CourseResponse>("/courses", "POST", data);
}

// API-13: Update Course
export function updateCourse(courseId: string, data: CourseRequest) {
  return apiRequest<CourseResponse>(
    `/courses/${encodeURIComponent(courseId)}`,
    "PUT",
    data,
  );
}
