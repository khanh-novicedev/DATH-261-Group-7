import React from 'react';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  UserX,
  UserCheck,
} from 'lucide-react';
import { User } from '../types';
import defaultAvatar from '../../../Shared/assets/avatar.png';

interface UserDetailProps {
  user: User;
  onBack: () => void;
  onToggleStatus: (user: User) => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  user,
  onBack,
  onToggleStatus,
}) => {
  const isSuspended = user.status === 'Suspended';

  const personalInfo = user.personalInfo || {
    dateOfBirth: 'October 12, 1998',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
  };

  const recentLogins = user.recentLogins || [
    { id: '1', timestamp: 'Today, 10:42 AM', device: 'Chrome on macOS' },
    { id: '2', timestamp: 'Yesterday, 8:15 PM', device: 'Safari on iOS' },
  ];

  const enrolledCourses = user.enrolledCourses || [
    {
      id: 'c-1',
      title: 'Advanced Data Structures',
      instructor: 'Prof. Sarah Jenkins',
      currentLesson: 5,
      totalLessons: 12,
      progressPercentage: 42,
    },
    {
      id: 'c-2',
      title: 'Introduction to Machine Learning',
      instructor: 'Dr. Michael Chen',
      currentLesson: 2,
      totalLessons: 8,
      progressPercentage: 25,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back to Users Button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Users</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl || defaultAvatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-2xs shrink-0"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {user.name}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            <div className="mt-2">
              <span className="inline-block px-3 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Suspend / Activate Account */}
        <button
          type="button"
          onClick={() => onToggleStatus(user)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-2xs flex items-center gap-2 cursor-pointer ${
            isSuspended
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#EF4444] hover:bg-[#DC2626] text-white'
          }`}
        >
          {isSuspended ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Activate Account</span>
            </>
          ) : (
            <>
              <UserX className="w-4 h-4" />
              <span>Suspend Account</span>
            </>
          )}
        </button>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Personal Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 py-2">
              <span className="w-36 text-sm text-slate-500 shrink-0">
                Date of Birth
              </span>
              <span className="text-sm font-medium text-slate-900">
                {personalInfo.dateOfBirth}
              </span>
            </div>

            <div className="flex items-start gap-4 py-2">
              <span className="w-36 text-sm text-slate-500 shrink-0">
                Phone Number
              </span>
              <span className="text-sm font-medium text-slate-900">
                {personalInfo.phoneNumber}
              </span>
            </div>

            <div className="flex items-start gap-4 py-2">
              <span className="w-36 text-sm text-slate-500 shrink-0">
                Address
              </span>
              <span className="text-sm font-medium text-slate-900">
                {personalInfo.address}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Activity Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Platform Activity
          </h2>

          {/* Recent Logins */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-slate-700">Recent Logins</h3>
            <div className="space-y-2.5">
              {recentLogins.map((login) => (
                <div
                  key={login.id}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{login.timestamp}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {login.device}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 my-6" />

          {/* Enrolled Courses */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">Enrolled Courses</h3>
            <div className="space-y-3">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  {/* Left: Thumbnail & Course Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] text-slate-700 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {course.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {course.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Right: Progress */}
                  <div className="w-full sm:w-48 shrink-0">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500">
                        Lesson {course.currentLesson}/{course.totalLessons}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {course.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-full rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
