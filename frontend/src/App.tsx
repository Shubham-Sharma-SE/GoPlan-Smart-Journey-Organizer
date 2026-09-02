import React from 'react';
import { AppProvider, useAppContext } from './hooks/useAppContext';
import { ToastContainer } from './components/ToastContainer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TripsPage } from './pages/TripsPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { BudgetPage } from './pages/BudgetPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { NotesPage } from './pages/NotesPage';
import { SummaryPage } from './pages/SummaryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';

const AppContent: React.FC = () => {
  const { view, subView } = useAppContext();

  // Render correct page view
  switch (view) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'dashboard':
      return (
        <DashboardLayout>
          {(() => {
            switch (subView) {
              case 'home':
                return <DashboardPage />;
              case 'trips':
                return <TripsPage />;
              case 'itinerary':
                return <ItineraryPage />;
              case 'budget':
                return <BudgetPage />;
              case 'expenses':
                return <ExpensesPage />;
              case 'checklist':
                return <ChecklistPage />;
              case 'notes':
                return <NotesPage />;
              case 'summary':
                return <SummaryPage />;
              case 'profile':
                return <ProfilePage />;
              case 'settings':
                return <SettingsPage />;
              default:
                return <DashboardPage />;
            }
          })()}
        </DashboardLayout>
      );
    default:
      return <LandingPage />;
  }
};

function App() {
  return (
    <AppProvider>
      <AppContent />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
