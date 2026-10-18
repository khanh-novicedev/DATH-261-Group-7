import React from 'react';
import {
  Video,
  FileText,
  HelpCircle,
  Users,
  Upload,
  BookOpen,
  User,
  Circle,
} from 'lucide-react';
import { Course, Lesson, LessonType } from '../types';

interface CoursePreviewProps {
  course: Course;
  onBack: () => void;
  onToggleStatus: (course: Course) => void;
  onDelete: (course: Course) => void;
  onViewMetrics?: (course: Course) => void;
}

export const CoursePreview: React.FC<CoursePreviewProps> = ({
  course,
  onBack,
  onToggleStatus,
  onDelete,
  onViewMetrics,
}) => {
  const isPublished = course.status === 'Published';
  const lessons = course.lessons || [];

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4 text-slate-700" />;
      case 'Document':
        return <FileText className="w-4 h-4 text-slate-700" />;
      case 'Quiz':
        return <HelpCircle className="w-4 h-4 text-slate-700" />;
      case 'Live Practice':
        return <Users className="w-4 h-4 text-slate-700" />;
      case 'Assignment':
        return <Upload className="w-4 h-4 text-slate-700" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Course Management
        </button>
        <span className="text-slate-400 font-medium">&gt;</span>
        <span className="text-slate-900 font-medium">Course Preview</span>
      </nav>

      {/* Header and Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Course Info */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {course.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {course.instructor} · {lessons.length} lessons ·{' '}
            {course.livePracticesCount || 1} live practice
          </p>
        </div>

        {/* Action Toolbar Card */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs flex flex-wrap items-center gap-4 self-start lg:self-auto">
          {/* Status Switch */}
          <div className="flex items-center gap-2.5 text-sm">
            <span
              className={`font-medium ${
                !isPublished ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Hidden
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isPublished}
              onClick={() => onToggleStatus(course)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                isPublished ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5 ${
                  isPublished ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span
              className={`font-medium ${
                isPublished ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Published
            </span>
          </div>

          <div className="hidden sm:block h-5 w-px bg-slate-200" />

          {/* Enrolment Metrics Button */}
          <button
            type="button"
            onClick={() => onViewMetrics?.(course)}
            className="px-3.5 py-1.5 border border-slate-200 text-slate-900 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Enrolment Metrics
          </button>

          {/* Delete Course Button */}
          <button
            type="button"
            onClick={() => onDelete(course)}
            className="px-3.5 py-1.5 border border-slate-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Delete Course
          </button>
        </div>
      </div>

      {/* Main 2-Column Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Syllabus & Course Details (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Syllabus Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Syllabus</h2>
              <span className="text-sm text-slate-500 font-medium">
                {lessons.length} lessons
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {lessons.map((lesson: Lesson) => (
                <div
                  key={lesson.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    <div className="p-1 rounded-md bg-slate-50 shrink-0">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        Lesson {lesson.lessonNumber} · {lesson.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lesson.durationOrMeta}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-normal">
                    {lesson.isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-2.5">
            <h2 className="text-base font-bold text-slate-900">Description</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.description ||
                "This course is designed to provide a comprehensive overview of the platform's core features and best practices for course creation. It covers everything from setting up your first lesson to managing advanced user permissions."}
            </p>
          </div>

          {/* Prerequisites Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-2.5">
            <h2 className="text-base font-bold text-slate-900">Prerequisites</h2>
            <div className="text-sm text-slate-600 space-y-1.5 leading-relaxed">
              {course.prerequisites && course.prerequisites.length > 0 ? (
                course.prerequisites.map((req, idx) => (
                  <p key={idx}>• {req}</p>
                ))
              ) : (
                <p>
                  • Basic understanding of course management systems • Access to the
                  admin dashboard • Familiarity with user roles and permissions
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Aside Cards (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* About this course */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                About this course
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Description</p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{course.livePracticesCount || 1} live practice</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{course.studentCount || 0} students</span>
              </div>
            </div>
          </div>

          {/* Course Forum Link */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Course forum</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {course.forumThreadsCount || 0} threads ·{' '}
                {course.unansweredThreadsCount || 0} unanswered
              </p>
            </div>

            <button
              type="button"
              className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              Open forum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
