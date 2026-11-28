import { apiClient, unwrap } from "@shared/api";
import type { PageResponse } from "@shared/api";

export interface TeacherSubmissionDto {
  id: string;
  assignmentId: string;
  learnerId: string;
  learnerName: string;
  fileUrl: string;
  score: number | null;
  feedback: string | null;
  gradedBy: string | null;
  submittedAt: string;
  gradedAt: string | null;
}

export interface GradeSubmissionPayload {
  score: number;
  feedback?: string;
}

// API-30 (hỗ trợ lấy danh sách submission để chấm điểm)
export function getLatestSubmissionsApi(
  assignmentId: string,
  instructorId: string,
  page = 0,
  size = 50,
): Promise<PageResponse<TeacherSubmissionDto>> {
  return unwrap(
    apiClient.get(`/assignments/${assignmentId}/submissions`, {
      params: { instructorId, page, size },
    }),
  );
}

// API-31: PATCH /api/submissions/{submissionId}/grade?instructorId=...
export function gradeSubmissionApi(
  submissionId: string,
  instructorId: string,
  payload: GradeSubmissionPayload,
): Promise<TeacherSubmissionDto> {
  return unwrap(
    apiClient.patch(`/submissions/${submissionId}/grade`, payload, {
      params: { instructorId },
    }),
  );
}
