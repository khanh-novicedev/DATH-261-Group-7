import React from 'react';

/**
 * Simple wrapper for table rows that provides the common Tailwind styling
 * used across admin tables.
 */
export const SharedTableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors">
    {children}
  </tr>
);
