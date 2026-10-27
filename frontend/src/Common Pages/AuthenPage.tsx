import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import { CommonHeader } from './components/LandingPageHeader';

export type AuthMode = 'signup' | 'login' | 'reset';

interface AuthenPageProps {
  initialMode?: AuthMode;
}

export const AuthenPage: React.FC<AuthenPageProps> = ({ initialMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode can be driven by props, query string (?mode=login), or local state
  const queryMode = (searchParams.get('mode') as AuthMode) || initialMode || 'signup';
  const [mode, setMode] = useState<AuthMode>(queryMode);

  useEffect(() => {
    if (searchParams.get('mode')) {
      const q = searchParams.get('mode') as AuthMode;
      if (['signup', 'login', 'reset'].includes(q)) {
        setMode(q);
      }
    }
  }, [searchParams]);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setSearchParams({ mode: nextMode });
    setSuccessMessage('');
    setError('');
  };

  // Form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please provide an email address.');
      return;
    }

    if (mode === 'signup') {
      if (!username.trim()) {
        setError('Please enter a username.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    if (mode === 'login' && !password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signup') {
        setSuccessMessage('Account created successfully! You can now log in.');
        setTimeout(() => switchMode('login'), 1500);
      } else if (mode === 'login') {
        setSuccessMessage('Logged in successfully! Redirecting...');
        setTimeout(() => navigate('/student/dashboard'), 800);
      } else if (mode === 'reset') {
        setSuccessMessage('Password reset link has been dispatched to your email.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <CommonHeader activeTab="none" />

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-107.5">
          {/* Card Frame matching Figma's dialog component (padding: 24px, gap: 16px, border: #CBD5E1, bg: white) */}
          <div className="bg-white border border-slate-300/80 rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
            {/* Header Content */}
            <div className="space-y-1.5">
              {mode === 'signup' && (
                <>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sign up</h1>
                  <p className="text-sm text-slate-500">
                    Already sign up ?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-slate-600 underline font-medium hover:text-slate-900 cursor-pointer"
                    >
                      Log in
                    </button>
                  </p>
                </>
              )}

              {mode === 'login' && (
                <>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Log in</h1>
                  <p className="text-sm text-slate-500">
                    <button
                      type="button"
                      onClick={() => switchMode('reset')}
                      className="text-slate-600 underline font-medium hover:text-slate-900 cursor-pointer"
                    >
                      Forgot password ?
                    </button>
                  </p>
                </>
              )}

              {mode === 'reset' && (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="p-1 -ml-1 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
                      title="Back to login"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reset password</h1>
                  </div>
                  <p className="text-sm text-slate-500">
                    Enter your email to receive reset password link.
                  </p>
                </>
              )}
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message Banner */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-900">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="@example.com"
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Username Input (Sign up only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-900">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your preferred username"
                      required
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Password Input (Login & Sign up) */}
              {(mode === 'signup' || mode === 'login') && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-900">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
                      required
                      className="w-full pl-3 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password Input (Sign up only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-900">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Enter your password again"
                      required
                      className="w-full pl-3 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button Section matching Figma (justify-end, bg-slate/900) */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 text-white text-sm font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
                >
                  {isLoading
                    ? 'Processing...'
                    : mode === 'signup'
                    ? 'Sign up'
                    : mode === 'login'
                    ? 'Log in'
                    : 'Send reset link'}
                </button>
              </div>
            </form>

            {/* Bottom auxiliary switcher for Log in & Reset Password */}
            {mode === 'login' && (
              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Sign up now
                  </button>
                </p>
              </div>
            )}

            {mode === 'reset' && (
              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Back to Log in
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400">
        <Link to="/landing" className="hover:text-slate-600 transition-colors">
          ← Back to Landing page
        </Link>
      </footer>
    </div>
  );
};

export default AuthenPage;
