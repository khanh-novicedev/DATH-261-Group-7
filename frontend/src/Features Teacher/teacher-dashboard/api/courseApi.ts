import { apiClient } from "../../../Shared/api";
import type { NewCourseInput } from "../types/course";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errorCode?: string;
}

interface CreatedCourseResponse {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
}

export async function createCourse(input: NewCourseInput): Promise<string> {
  const { data: response } = await apiClient.post<
    ApiResponse<CreatedCourseResponse>
  >("/courses", {
    title: input.name,
    description: input.description,
    category: input.category?.trim() || null,
    lessons: [],
  });

  if (!response.success || !response.data?.id) {
    throw new Error(
      response.message || "The server returned an invalid course response.",
    );
  }

  return response.data.id;
}

export async function updateCourse(
  courseId: string,
  input: NewCourseInput,
): Promise<void> {
  const { data: response } = await apiClient.put<
    ApiResponse<CreatedCourseResponse>
  >(`/courses/${encodeURIComponent(courseId)}`, {
    title: input.name,
    description: input.description,
    category: input.category?.trim() || null,
    prerequisites: null,
    lessons: null,
  });

  if (!response.success || !response.data?.id) {
    throw new Error(
      response.message || "The server returned an invalid course response.",
    );
  }
}

export function isServerCourseId(id: string): boolean {
  return /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id);
}
