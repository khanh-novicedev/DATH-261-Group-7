import React from 'react';
import { AlertTriangle, EyeOff, X } from 'lucide-react';
import { Course } from '../types';
import { CourseStatus } from '@shared/types'
interface DeleteCourseModalProps {
  course: Course | null;
  status?: CourseStatus;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  course,
  status,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !course) return null;

  const isStatusChange = Boolean(status);
  const isHiding = status === 'HIDDEN';

  const title = isStatusChange
    ? isHiding
      ? 'Hide Course'
      : `Change Course Status to ${status}`
    : 'Delete Course';

  const message = isStatusChange
    ? isHiding
      ? (
        <>
          Are you sure you want to hide{' '}
          <strong className="text-slate-900 font-semibold">&ldquo;{course.title}&rdquo;</strong>?
          Students will no longer be able to discover or enrol in this course.
        </>
      )
      : (
        <>
          Are you sure you want to set status of{' '}
          <strong className="text-slate-900 font-semibold">&ldquo;{course.title}&rdquo;</strong> to{' '}
          <strong className="text-slate-900 font-semibold">{status}</strong>?
        </>
      )
    : (
      <>
        Are you sure you want to delete{' '}
        <strong className="text-slate-900 font-semibold">&ldquo;{course.title}&rdquo;</strong>?
        This action will remove all enrolled progress, syllabi, and materials permanently.
      </>
    );

  const confirmButtonText = isStatusChange
    ? isHiding
      ? 'Hide Course'
      : `Set to ${status}`
    : 'Delete Course';

  const confirmButtonClass = isHiding || !isStatusChange
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-slate-900 hover:bg-slate-800';

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
            {isHiding ? <EyeOff className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{message}</p>
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
            className={`px-4 py-2 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer ${confirmButtonClass}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
