import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { UserSummary } from "@shared/types";

export interface AuthContextValue {
  user: UserSummary | null;
  setUser: Dispatch<SetStateAction<UserSummary | null>>;
}

export const MOCK_GUEST = null;
export const MOCK_STUDENT: UserSummary = {
  id: "u-learner-1",
  fullName: "Student name",
  role: "STUDENT",
};
export const MOCK_TEACHER: UserSummary = {
  id: "u-learner-2",
  fullName: "Teacher name",
  role: "TEACHER",
};
export const MOCK_ADMIN: UserSummary = {
  id: "u-learner-3",
  fullName: "Admin name",
  role: "ADMIN",
};

export const MOCK_USER = MOCK_TEACHER;
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => undefined,
});

export function useAuth() {
  return useContext(AuthContext);
}
