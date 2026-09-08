import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Logo } from '../components/Logo';
import { Eye, EyeOff, Lock, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password. Please check your credentials or register a new account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div onClick={() => navigateTo('landing')} className="cursor-pointer mb-6">
          <Logo size="lg" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to GoPlan
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your account or register with a new email
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200/80 shadow-xl rounded-3xl sm:px-10 relative overflow-hidden">
          
          {/* Auth Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/60">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all bg-white text-sky-600 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigateTo('signup')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50"
            >
              <UserPlus className="w-4 h-4" />
              Register New
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-700 text-left">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 text-left">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 text-left">
                Password
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-1.5 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all cursor-pointer shadow-sky-600/10"
            >
              Sign In
              <ArrowRight className="w-4 h-4 text-sky-100" />
            </button>
          </form>

          {/* New Registration Button / CTA */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
            <p className="text-xs text-slate-500">
              Don't have an account or want to use your personal email?
            </p>
            <button
              type="button"
              onClick={() => navigateTo('signup')}
              className="w-full py-2.5 px-4 border border-sky-200 hover:border-sky-300 bg-sky-50 hover:bg-sky-100/80 text-sky-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Register New Account with Email
            </button>
          </div>

          {/* Quick Mock Help Info */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium block">
              Default Demo Account:
            </span>
            <code className="text-xs mt-1 block bg-slate-50 border border-slate-100 text-slate-600 py-1 px-2 rounded-md font-mono">
              admin@goplan.com / password123
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
