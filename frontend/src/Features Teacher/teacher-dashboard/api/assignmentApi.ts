import { apiClient, unwrap, type AssignmentDto } from "@shared/api";

export interface CreateQuizOptionPayload {
  content: string;
  isCorrect: boolean;
}

export interface CreateQuizQuestionPayload {
  content: string;
  points?: number;
  options: CreateQuizOptionPayload[];
}

export interface CreateAssignmentPayload {
  title: string;
  type: "QUIZ" | "FILE_SUBMISSION";
  instructions?: string;
  passScore?: number | null;
  deadline?: string | null;
  questions?: CreateQuizQuestionPayload[];
}

// API-25: POST /api/lessons/{lessonId}/assignments
export function createAssignmentApi(
  lessonId: string,
  instructorId: string,
  payload: CreateAssignmentPayload,
): Promise<AssignmentDto> {
  return unwrap(
    apiClient.post(`/lessons/${lessonId}/assignments`, payload, {
      params: { instructorId },
    }),
  );
}
