import { apiClient, unwrap } from "./client";
import type { AssignmentDto, PageResponse, SubmissionDto } from "./types";

// API-26: GET /api/lessons/{lessonId}/assignments
export function getLessonAssignments(
  lessonId: string,
): Promise<AssignmentDto[]> {
  return unwrap(apiClient.get(`/lessons/${lessonId}/assignments`));
}

// API-30: GET /api/assignments/{assignmentId}/submissions
export interface AssignmentSubmissionsQuery {
  instructorId: string;
  graded?: boolean;
  page?: number;
  size?: number;
}

export function getAssignmentSubmissions(
  assignmentId: string,
  query: AssignmentSubmissionsQuery,
): Promise<PageResponse<SubmissionDto>> {
  return unwrap(
    apiClient.get(`/assignments/${assignmentId}/submissions`, {
      params: {
        instructorId: query.instructorId,
        graded: query.graded,
        page: query.page ?? 0,
        size: query.size ?? 20,
      },
    }),
  );
}
