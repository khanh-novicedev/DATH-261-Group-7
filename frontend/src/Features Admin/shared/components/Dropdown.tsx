import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownProps {
  /** Element that triggers the dropdown (e.g., an icon or button) */
  trigger: ReactNode;
  /** Content of the dropdown menu */
  children: ReactNode;
  /** Optional custom wrapper classes */
  wrapperClassName?: string;
  /** Optional custom menu classes */
  menuClassName?: string;
}

/**
 * Generic dropdown that handles open/close state and outside‑click detection.
 * Used by table rows and filter controls across the admin UI.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  wrapperClassName = 'relative inline-block',
  menuClassName = 'absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150 text-left',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={wrapperClassName} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && <div className={menuClassName}>{children}</div>}
    </div>
  );
};
