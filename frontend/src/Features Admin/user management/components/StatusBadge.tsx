import React from 'react';
import { UserStatus } from '../types';

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const isSuspended = status === 'Suspended';

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
        isSuspended
          ? 'bg-[#FEF2F2] text-[#DC2626]'
          : 'bg-[#F0FDF4] text-[#16A34A]'
      } ${className}`}
    >
      {status}
    </span>
  );
};
