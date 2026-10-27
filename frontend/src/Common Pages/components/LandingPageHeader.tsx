import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogIn, UserPlus } from 'lucide-react';
import defaultAvatar from '../../Shared/assets/avatar.png';

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const CommonHeader: React.FC<HeaderProps> = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <header className="w-full bg-[#F0F4F8] border-b border-slate-200 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="h-9 px-3 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-bold tracking-tight text-slate-800">
              LMS<span className="text-blue-600">.Admin</span>
            </span>
          </Link>
        </div>


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
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Welcome</p>
                <p className="text-sm font-semibold text-slate-900">Access your account</p>
              </div>
              <Link
                to="/auth?mode=login"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                Log in
              </Link>
              <Link
                to="/auth?mode=signup"
                onClick={() => setUserMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                Sign up
              </Link>
            </div> 
          )}
        </div>
      </div>
    </header>
  );
};
