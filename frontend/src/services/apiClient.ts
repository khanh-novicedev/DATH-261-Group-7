const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(
  /\/+$/,
  "",
);
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : configuredApiBaseUrl || "/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

export class ApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function fetchWithBackendError(
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "The API network request failed. Check that the frontend and backend are running.",
      );
    }
    throw error;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body?: unknown,
): Promise<T> {
  // Replace this storage lookup with your actual authentication implementation.
  const token = localStorage.getItem("accessToken");

  const response = await fetchWithBackendError(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...(body !== undefined && {
        "Content-Type": "application/json",
      }),
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    ...(body !== undefined && {
      body: JSON.stringify(body),
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      result?.message || `Request failed (${response.status})`,
      response.status,
      result?.errorCode,
    );
  }

  const apiResult = result as ApiResponse<T>;

  if (!apiResult?.success) {
    throw new ApiError(
      apiResult?.message || "The API request was unsuccessful.",
      response.status,
      apiResult?.errorCode,
    );
  }

  return apiResult.data;
}
