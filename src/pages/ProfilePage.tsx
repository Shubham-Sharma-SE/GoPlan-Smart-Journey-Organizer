import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Mail, Compass, UserPlus, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, trips, logout, navigateTo } = useAppContext();

  const stats = useMemo(() => {
    const total = trips.length;
    const upcoming = trips.filter(t => t.status === 'upcoming').length;
    const completed = trips.filter(t => t.status === 'completed').length;
    const ongoing = trips.filter(t => t.status === 'ongoing').length;

    return { total, upcoming, completed, ongoing };
  }, [trips]);

  if (!currentUser) return null;

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-3xl border border-sky-100 shadow-sm">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
            <p className="text-sm font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-4 h-4 text-slate-400" />
              {currentUser.email}
            </p>
            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-sky-100 mt-2">
              🌍 Active Explorer Account
            </span>
          </div>
        </div>

        {/* Member Stats */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Milestones</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Trips</span>
              <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.total}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Stops</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.completed}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ongoing Journeys</span>
              <span className="text-2xl font-black text-amber-500 mt-1 block">{stats.ongoing}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center sm:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Upcoming Plans</span>
              <span className="text-2xl font-black text-sky-600 mt-1 block">{stats.upcoming}</span>
            </div>
          </div>
        </div>

        {/* Info text */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3 text-xs text-slate-400 font-semibold leading-relaxed">
          <Compass className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
          <p>
            Your account data and registered journeys are stored securely in browser storage. You can register multiple accounts with different email addresses on this device.
          </p>
        </div>

        {/* Account Switching / Register New */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              logout();
              navigateTo('signup');
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100/80 text-sky-700 font-bold px-4 py-2.5 rounded-xl text-xs border border-sky-200 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Register a New Account
          </button>
          
          <button
            onClick={logout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-rose-600 hover:bg-rose-50 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
