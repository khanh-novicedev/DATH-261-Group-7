import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';
import { Avatar } from '@shared/components';
import { useAuth } from '@shared/context';
import { logoutApi } from '@shared/api';

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const CommonHeader: React.FC<HeaderProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    setUserMenuOpen(false);
    logout();
    navigate('/landing', { replace: true });

    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch (err) {
        console.error('[CommonHeader] API-04 logout revocation failed on server:', err);
      }
    }
  };

  const dashboardPath =
    user?.role === 'ADMIN'
      ? '/admin'
      : user?.role === 'INSTRUCTOR' || user?.role === 'TEACHER'
      ? '/teacher'
      : '/student/dashboard';

  return (
    <header className="w-full bg-[#F0F4F8] border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            to="/landing"
            className="h-10 px-3.5 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-bold tracking-tight text-slate-800">
              LMS<span className="text-blue-600">.Learn</span>
            </span>
          </Link>
        </div>

        {/* Right: User Profile Dropdown */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-full sm:rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
          >
            <Avatar name={user?.fullName ?? 'User'} size={30} />
            <span className="hidden sm:inline text-sm font-medium text-slate-800">
              {user?.fullName ?? 'Account'}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {user ? (
                <>
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user.fullName}
                    </p>
                    <span className="inline-block mt-0.5 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {user.role}
                    </span>
                  </div>
                  <Link
                    to={dashboardPath}
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    Dashboard
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Log out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
