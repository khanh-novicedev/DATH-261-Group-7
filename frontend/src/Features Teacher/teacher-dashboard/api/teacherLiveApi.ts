import { apiClient, unwrap } from "@shared/api";

export interface LiveBreakoutRoomInput {
  name: string;
  learnerIds: string[];
}

export interface CreateLiveSessionPayload {
  lessonId: string;
  scheduledTime: string; // ISO-8601 format: YYYY-MM-DDTHH:mm:ss
  rooms?: LiveBreakoutRoomInput[];
}

export interface TeacherLiveSessionDto {
  id: string;
  lessonId: string;
  hostId: string;
  scheduledTime: string;
  sessionStatus?: "SCHEDULED" | "ONGOING" | "COMPLETED";
  status?: "SCHEDULED" | "ONGOING" | "COMPLETED";
  createdAt?: string;
}

// API-42: POST /api/live
export function createLiveSessionApi(
  payload: CreateLiveSessionPayload,
): Promise<TeacherLiveSessionDto> {
  return unwrap(apiClient.post("/live", payload));
}
