import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Trip } from '../types';
import { authService } from '../services/authService';
import { tripService } from '../services/tripService';

export type ViewType = 'landing' | 'login' | 'signup' | 'dashboard';
export type SubViewType = 'home' | 'trips' | 'itinerary' | 'budget' | 'expenses' | 'checklist' | 'notes' | 'summary' | 'profile' | 'settings';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  view: ViewType;
  subView: SubViewType;
  currentUser: User | null;
  activeTripId: string | null;
  activeTrip: Trip | null;
  trips: Trip[];
  toasts: Toast[];
  navigateTo: (view: ViewType, subView?: SubViewType) => void;
  setActiveTripId: (id: string | null) => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  refreshTrips: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewType>('landing');
  const [subView, setSubView] = useState<SubViewType>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTripId, setActiveTripIdState] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Check login on load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView('dashboard');
      const savedTripId = localStorage.getItem('goplan_active_trip_id');
      if (savedTripId) {
        setActiveTripIdState(savedTripId);
      }
    }
  }, []);

  // Sync trips when user changes or trip changes
  useEffect(() => {
    if (currentUser) {
      const fetchedTrips = tripService.getTripsByUserId(currentUser.id);
      setTrips(fetchedTrips);
      
      // Auto-set active trip if not set
      if (!activeTripId && fetchedTrips.length > 0) {
        // Set first trip (e.g. Goa Adventure)
        setActiveTripId(fetchedTrips[0].id);
      }
    } else {
      setTrips([]);
      setActiveTripIdState(null);
    }
  }, [currentUser, activeTripId]);

  const navigateTo = (newView: ViewType, newSubView: SubViewType = 'home') => {
    setView(newView);
    setSubView(newSubView);
  };

  const setActiveTripId = (id: string | null) => {
    setActiveTripIdState(id);
    if (id) {
      localStorage.setItem('goplan_active_trip_id', id);
    } else {
      localStorage.removeItem('goplan_active_trip_id');
    }
  };

  const refreshTrips = () => {
    if (currentUser) {
      const fetchedTrips = tripService.getTripsByUserId(currentUser.id);
      setTrips(fetchedTrips);
    }
  };

  const login = (email: string, password: string): boolean => {
    const res = authService.login(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setView('dashboard');
      setSubView('home');
      showToast('Welcome back, ' + res.user.name + '!', 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const register = (name: string, email: string, password: string): boolean => {
    const res = authService.register({ name, email, password });
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setView('dashboard');
      setSubView('home');
      showToast('Welcome to GoPlan, ' + res.user.name + '!', 'success');
      return true;
    } else {
      showToast(res.message, 'error');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setActiveTripIdState(null);
    localStorage.removeItem('goplan_active_trip_id');
    setView('landing');
    showToast('Logged out successfully.', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  return (
    <AppContext.Provider value={{
      view,
      subView,
      currentUser,
      activeTripId,
      activeTrip,
      trips,
      toasts,
      navigateTo,
      setActiveTripId,
      login,
      register,
      logout,
      refreshTrips,
      showToast,
      dismissToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
