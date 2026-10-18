import React from 'react';
import { ConfirmModal as SharedConfirmModal } from '../../shared/components/ConfirmModal';
import { User } from '../types';

/** Thin wrapper that re‑exports the shared ConfirmModal for backward compatibility */
export const ConfirmModal: React.FC<{
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = (props) => <SharedConfirmModal {...props} />;
