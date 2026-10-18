import React, { useState } from 'react';
import { ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import defaultAvatar from '../../../Shared/assets/avatar.png';

interface AdminHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab = 'User Manager',
  onTabChange,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const tabs = [
    'User Manager',
    'Course Manager',
    'Forum Manager',
    'System Setting',
  ];

  return (
    <header className="w-full bg-[#F0F4F8] border-b border-slate-200 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 px-3 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
            <span className="text-sm font-bold tracking-tight text-slate-800">
              LMS<span className="text-blue-600">.Admin</span>
            </span>
          </div>
        </div>

        {/* Center: Menubar Navigation Tabs */}
        <nav className="hidden md:inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange?.(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        {/* Right: User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/60 transition-colors cursor-pointer"
          >
            <img
              src={defaultAvatar}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <span className="hidden sm:inline text-sm font-medium text-slate-800">
              User name
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@university.edu</p>
              </div>
              <button
                type="button"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                Settings
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                type="button"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
