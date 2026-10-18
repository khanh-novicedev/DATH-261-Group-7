import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { User } from '../types';

interface ConfirmModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !user) return null;

  const isSuspending = user.status === 'Active';

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
          <div
            className={`p-3 rounded-full shrink-0 ${
              isSuspending ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isSuspending ? (
              <AlertTriangle className="w-6 h-6" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isSuspending ? 'Suspend Account?' : 'Activate Account?'}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {isSuspending
                ? `Are you sure you want to suspend ${user.name}'s account? They will lose access to course materials and forums until reactivated.`
                : `Are you sure you want to reactivate ${user.name}'s account? They will regain full access to their enrolled courses.`}
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
            className={`px-4 py-2 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer ${
              isSuspending
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isSuspending ? 'Confirm Suspend' : 'Confirm Activate'}
          </button>
        </div>
      </div>
    </div>
  );
};
