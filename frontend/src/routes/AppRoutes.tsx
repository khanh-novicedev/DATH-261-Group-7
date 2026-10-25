import { Navigate, Route, Routes } from "react-router-dom";
import { TeacherDashboardPage } from "../Features Teacher/teacher-dashboard";
import { ProfilePage } from "../Shared/components/ProfilePage";
import { StudentRoutes } from "./StudentRoutes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />

      {/* Shared profile page for every user role */}
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/student/*" element={<StudentRoutes />} />

      {/* Teacher pages */}
      <Route path="/teacher/*" element={<TeacherDashboardPage />} />

      {/* Unknown URLs */}
      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Routes>
  );
}
