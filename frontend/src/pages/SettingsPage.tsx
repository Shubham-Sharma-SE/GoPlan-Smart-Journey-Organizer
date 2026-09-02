import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { Settings, ShieldAlert, RotateCcw, Save, Moon, Sun, Bell, Coins } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast, logout } = useAppContext();

  // Settings states (stored locally or just mock)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState('INR');
  const [notify, setNotify] = useState('email');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully (Mock save)!', 'success');
  };

  const handleClearLocalData = () => {
    if (window.confirm('WARNING: This will permanently delete all your custom trips, itineraries, expenses, notes, and checklist items. The page will reload and restore default demo data. Proceed?')) {
      localStorage.clear();
      showToast('Cache cleared. Resetting database to default demo values...', 'info');
      
      // Force reload after 1.5 seconds to seed demo values
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      {/* Settings Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pb-4 border-b border-slate-100">
          <Settings className="w-5 h-5 text-sky-600" />
          Application Preferences
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-5">
          {/* Currency setting */}
          <div className="grid sm:grid-cols-3 items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Coins className="w-4.5 h-4.5 text-slate-400" />
              Default Currency
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="sm:col-span-2 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold cursor-pointer bg-white text-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="INR">₹ INR (Indian Rupee - Default)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
              <option value="GBP">£ GBP (British Pound)</option>
            </select>
          </div>

          {/* Theme setting */}
          <div className="grid sm:grid-cols-3 items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              {theme === 'light' ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
              Theme Preference
            </span>
            <div className="sm:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 border rounded-xl py-2 px-4 text-xs font-semibold cursor-pointer transition-all ${
                  theme === 'light' 
                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Light Theme
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 border rounded-xl py-2 px-4 text-xs font-semibold cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Dark Theme
              </button>
            </div>
          </div>

          {/* Notifications setting */}
          <div className="grid sm:grid-cols-3 items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <Bell className="w-4.5 h-4.5 text-slate-400" />
              Notifications
            </span>
            <select
              value={notify}
              onChange={(e) => setNotify(e.target.value)}
              className="sm:col-span-2 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold cursor-pointer bg-white text-sm focus:ring-2 focus:ring-sky-500"
            >
              <option value="email">Email Digests Only</option>
              <option value="push">Live Browser Notifications</option>
              <option value="none">No Notifications</option>
            </select>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/10 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Database control section */}
      <div className="bg-rose-50/50 border border-rose-200/50 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          Critical Operations Zone
        </h3>
        <p className="text-xs text-rose-700 leading-relaxed font-semibold">
          If your mockup data becomes bloated, inconsistent, or if you wish to reset your journey plans, click below. This will wipe out all sandbox browser storages and reload the application structure.
        </p>
        
        <button
          onClick={handleClearLocalData}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/10 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Clear & Reset Mock Data
        </button>
      </div>
    </div>
  );
};
