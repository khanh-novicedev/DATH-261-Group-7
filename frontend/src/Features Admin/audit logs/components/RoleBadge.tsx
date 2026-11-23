import React from 'react';

interface RoleBadgeProps {
  role?: string;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  if (!role) return null;

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-medium transition-colors bg-blue-50 text-blue-700 border border-blue-100/60 ${className}`}
    >
      {role}
    </span>
  );
};
