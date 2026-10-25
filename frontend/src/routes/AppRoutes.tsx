import { Navigate, Route, Routes } from "react-router-dom";
import { TeacherDashboardPage } from "../Features Teacher/teacher-dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />

      {/* Keep the teacher feature mounted while navigating its pages. */}
      <Route path="/teacher/*" element={<TeacherDashboardPage />} />

      {/* Redirect unknown URLs to the teacher dashboard. */}
      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Routes>
  );
}
