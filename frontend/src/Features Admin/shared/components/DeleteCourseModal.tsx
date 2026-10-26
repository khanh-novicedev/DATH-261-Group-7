import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Course } from '../types';

/**
 * Generic delete‑confirmation modal for courses.
 */
export const DeleteCourseModal: React.FC<{
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ course, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-50 text-red-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Delete Course</h3>
            <p className="text-sm text-slate-600 mt-1">
              Are you sure you want to delete <strong className="text-slate-900 font-semibold">“{course.title}”</strong>? This action will remove all enrolled progress, syllabi, and materials permanently.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
};
