import { Navigate, useRoutes } from 'react-router-dom'
import { MainLayout, type NavItem } from '@shared/layouts'
import { DashboardPage, MyCoursesPage } from '@student/dashboard'
import { CatalogPage } from '@student/catalog'
import { CourseDetailPage } from '@student/course-detail'
import { CourseSyllabusPage } from '@student/course-syllabus'
import { LessonPage } from '@student/lesson'
import { QuizPage } from '@student/quiz'
import { AssignmentPage } from '@student/assignment'
import { LiveRoomPage, SessionHistoryPage } from '@student/live-room'
import { SessionFeedbackPage } from '@student/session-feedback'
import { ForumPage } from '@student/forum'

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Course Catalog', to: '/student/catalog' },
  { label: 'My Courses', to: '/student/courses', activePrefixes: ['/student/quiz', '/student/assignments', '/student/live'] },
]

export function StudentRoutes() {
  return useRoutes([
    {
      element: <MainLayout navItems={studentNav} />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'catalog', element: <CatalogPage /> },
        { path: 'catalog/:courseId', element: <CourseDetailPage /> },
        { path: 'courses', element: <MyCoursesPage /> },
        { path: 'courses/:courseId', element: <CourseSyllabusPage /> },
        { path: 'courses/:courseId/lessons/:lessonId', element: <LessonPage /> },
        { path: 'courses/:courseId/forum', element: <ForumPage /> },
        { path: 'quiz/:assignmentId', element: <QuizPage /> },
        { path: 'assignments/:assignmentId', element: <AssignmentPage /> },
        { path: 'live/:sessionId/feedback', element: <SessionFeedbackPage /> },
        { path: 'live/:sessionId/history', element: <SessionHistoryPage /> },
      ],
    },
    { path: 'live/:sessionId', element: <LiveRoomPage /> },
    { path: '*', element: <Navigate to="dashboard" replace /> },
  ])
}
