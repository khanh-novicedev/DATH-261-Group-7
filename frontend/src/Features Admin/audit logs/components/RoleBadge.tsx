import React from 'react';
import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-xs font-medium transition-colors bg-blue-50 ${className}`}
    >
      {role}
    </span>
  );
};
