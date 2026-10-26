import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';
import { Course, CourseStatus } from '../types';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (
    courseData: Omit<Course, 'id' | 'enrolments' | 'completionRate'>
  ) => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
}) => {
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CourseStatus>('Published');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructor.trim()) return;

    onAddCourse({
      title: title.trim(),
      instructor: instructor.trim(),
      description: description.trim(),
      status,
      prerequisites: [
        'Basic understanding of course principles',
        'Access to learning platform',
      ],
      lessons: [],
      livePracticesCount: 0,
      studentCount: 0,
      forumThreadsCount: 0,
      unansweredThreadsCount: 0,
    });

    setTitle('');
    setInstructor('');
    setDescription('');
    setStatus('Published');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <BookPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Course</h2>
            <p className="text-xs text-slate-500">
              Create a new course catalog entry.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js 15 & Server Actions"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Instructor Name *
            </label>
            <input
              type="text"
              required
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Alex Thorne"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide an overview of this course..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CourseStatus)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all cursor-pointer bg-white"
            >
              <option value="Published">Published</option>
              <option value="Hidden">Hidden</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
