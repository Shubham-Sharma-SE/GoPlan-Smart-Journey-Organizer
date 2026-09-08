import React, { useState } from 'react';
import { useAppContext, SubViewType } from '../hooks/useAppContext';
import { Logo } from '../components/Logo';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarDays, 
  Receipt, 
  Briefcase, 
  FileText, 
  LineChart, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Wallet,
  UserPlus
} from 'lucide-react';

interface SidebarItem {
  id: SubViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    subView, 
    navigateTo, 
    currentUser, 
    logout, 
    trips, 
    activeTripId, 
    setActiveTripId,
    activeTrip 
  } = useAppContext();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trips', label: 'My Trips', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary Planner', icon: CalendarDays },
    { id: 'budget', label: 'Budget Manager', icon: Wallet },
    { id: 'expenses', label: 'Expense Tracker', icon: Receipt },
    { id: 'checklist', label: 'Packing Checklist', icon: Briefcase },
    { id: 'notes', label: 'Notes & Tips', icon: FileText },
    { id: 'summary', label: 'Trip Summary', icon: LineChart },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (viewId: SubViewType) => {
    navigateTo('dashboard', viewId);
    setMobileMenuOpen(false);
  };

  const getPageTitle = () => {
    const activeItem = sidebarItems.find(item => item.id === subView);
    return activeItem ? activeItem.label : 'Dashboard';
  };

  const currentTripName = activeTrip ? activeTrip.name : 'No Trip Selected';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-700 overflow-hidden">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-full flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Logo />
        </div>

        {/* User context widget */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Trip</div>
          {trips.length > 0 ? (
            <select
              value={activeTripId || ''}
              onChange={(e) => setActiveTripId(e.target.value)}
              className="mt-1.5 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm cursor-pointer"
            >
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>
                  {trip.name} ({trip.destination})
                </option>
              ))}
            </select>
          ) : (
            <button
              onClick={() => handleNavClick('trips')}
              className="mt-1.5 w-full text-left bg-white border border-slate-200 hover:border-sky-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 font-medium flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-sky-500" />
              + Create a trip
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = subView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                logout();
                navigateTo('signup');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all cursor-pointer"
              title="Register a new email account"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register
            </button>
            <button
              onClick={logout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 bg-white h-full shadow-2xl animate-slide-right z-50">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <Logo />
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Trip</div>
              {trips.length > 0 ? (
                <select
                  value={activeTripId || ''}
                  onChange={(e) => {
                    setActiveTripId(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  className="mt-1.5 w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 focus:outline-none"
                >
                  {trips.map(trip => (
                    <option key={trip.id} value={trip.id}>
                      {trip.name}
                    </option>
                  ))}
                </select>
              ) : (
                <button
                  onClick={() => handleNavClick('trips')}
                  className="mt-1.5 w-full text-left bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 font-medium flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-500" />
                  + Create a trip
                </button>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = subView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                      isActive 
                        ? 'bg-sky-500 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                  {currentUser?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{currentUser?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigateTo('signup');
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 lg:text-xl">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Viewing Trip</span>
              <span className="text-sm font-bold text-sky-600 truncate max-w-[180px]">
                {currentTripName}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold border border-sky-100 shadow-sm">
              {currentUser?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
