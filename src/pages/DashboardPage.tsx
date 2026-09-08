import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { tripService } from '../services/tripService';
import { expenseService } from '../services/expenseService';
import { checklistService } from '../services/checklistService';
import { dateUtils } from '../utils/dateUtils';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  AlertCircle,
  CheckSquare, 
  ExternalLink,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Compass
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, activeTrip, activeTripId, trips, navigateTo, setActiveTripId } = useAppContext();

  // 1. Calculate overall trip counts
  const stats = useMemo(() => {
    const userTrips = trips;
    const total = userTrips.length;
    const upcoming = userTrips.filter(t => t.status === 'upcoming').length;
    const completed = userTrips.filter(t => t.status === 'completed').length;
    
    return { total, upcoming, completed };
  }, [trips]);

  // 2. Fetch data for active trip
  const activeTripData = useMemo(() => {
    if (!activeTripId) return null;
    
    const trip = activeTrip;
    if (!trip) return null;

    const expenses = expenseService.getExpensesByTripId(activeTripId);
    const expStats = expenseService.getExpenseStats(activeTripId);
    const packing = checklistService.getPackingProgress(activeTripId);
    
    const remaining = trip.estimatedBudget - expStats.total;
    const usagePercent = trip.estimatedBudget > 0 
      ? Math.min(Math.round((expStats.total / trip.estimatedBudget) * 100), 100) 
      : 0;

    // Get alert class and warning
    let alertMsg = "✓ You are comfortably within your budget.";
    let alertColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
    let alertBarColor = "bg-emerald-500";
    
    if (usagePercent >= 70 && usagePercent < 90) {
      alertMsg = "⚠ You are approaching your budget limit.";
      alertColor = "bg-amber-50 text-amber-800 border-amber-200";
      alertBarColor = "bg-amber-500";
    } else if (usagePercent >= 90 && usagePercent < 100) {
      alertMsg = "⚠ You have almost reached your budget limit.";
      alertColor = "bg-orange-50 text-orange-800 border-orange-200";
      alertBarColor = "bg-orange-500";
    } else if (expStats.total > trip.estimatedBudget) {
      alertMsg = "🔴 Your trip budget has been exceeded.";
      alertColor = "bg-rose-50 text-rose-800 border-rose-200";
      alertBarColor = "bg-rose-500";
    }

    return {
      trip,
      expenses: expenses.slice(-3).reverse(), // Last 3 expenses
      totalSpent: expStats.total,
      remaining,
      usagePercent,
      categoryTotals: expStats.categoryTotals,
      packing,
      alertMsg,
      alertColor,
      alertBarColor
    };
  }, [activeTripId, activeTrip]);

  const travelModeIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return <Plane className="w-4 h-4 text-sky-500" />;
      case 'train': return <Train className="w-4 h-4 text-sky-500" />;
      case 'bus': return <Bus className="w-4 h-4 text-sky-500" />;
      case 'car': return <Car className="w-4 h-4 text-sky-500" />;
      case 'bike': return <Bike className="w-4 h-4 text-sky-500" />;
      default: return <Compass className="w-4 h-4 text-sky-500" />;
    }
  };

  // Render empty state if there are no trips at all
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 border border-sky-100 shadow-inner">
          <Compass className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">No Trips Created Yet</h2>
        <p className="text-slate-400 text-sm max-w-sm mt-2 leading-relaxed">
          Welcome to GoPlan! To start planning your itinerary, tracking expenses, and managing checklists, create your first trip.
        </p>
        <button
          onClick={() => navigateTo('dashboard', 'trips')}
          className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-600/15 transition-all text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create First Trip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Header banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800">Hello, {currentUser?.name}!</h2>
          <p className="text-slate-400 text-xs md:text-sm mt-0.5 font-medium">
            Welcome to your GoPlan dashboard. Select or create trips to begin organizing.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => navigateTo('dashboard', 'trips')}
            className="flex-1 md:flex-initial bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Trips</span>
          <span className="text-2xl font-black text-slate-800 mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Upcoming</span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">{stats.upcoming}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-black text-slate-500 mt-1 block">{stats.completed}</span>
        </div>

        {activeTripData ? (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trip Budget</span>
              <span className="text-2xl font-black text-slate-800 mt-1 block">₹{activeTripData.trip.estimatedBudget.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Expenses</span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">₹{activeTripData.totalSpent.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Remaining</span>
              <span className={`text-2xl font-black mt-1 block ${activeTripData.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{activeTripData.remaining.toLocaleString('en-IN')}
              </span>
            </div>
          </>
        ) : (
          <div className="col-span-3 bg-slate-100 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-xs text-slate-400 font-medium">
            Select a trip to view budget statistics
          </div>
        )}
      </div>

      {activeTripData ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Active Trip Info & Budget / Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Trip Quick Overview Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-sky-100">
                    Active Focus Trip
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 pt-1">{activeTripData.trip.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activeTripData.trip.startingLocation} ➔ {activeTripData.trip.destination}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {dateUtils.formatDate(activeTripData.trip.startDate)} - {dateUtils.formatDate(activeTripData.trip.endDate)} ({dateUtils.calculateDuration(activeTripData.trip.startDate, activeTripData.trip.endDate)} Days)
                    </span>
                    <span className="flex items-center gap-1">
                      {travelModeIcon(activeTripData.trip.travelMode)}
                      {activeTripData.trip.travelMode.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('dashboard', 'summary')}
                  className="text-xs text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1 bg-sky-50 hover:bg-sky-100/80 px-3 py-1.5 rounded-xl border border-sky-100 transition-all cursor-pointer"
                >
                  Full Summary
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Budget Progress Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                  <span>Budget Utilisation</span>
                  <span>{activeTripData.usagePercent}% Spent</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-100">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeTripData.usagePercent > 100 
                        ? 'bg-rose-500' 
                        : activeTripData.usagePercent >= 90 
                          ? 'bg-orange-500' 
                          : activeTripData.usagePercent >= 70 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(activeTripData.usagePercent, 100)}%` }}
                  ></div>
                </div>
                <div className={`mt-3 p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${activeTripData.alertColor}`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {activeTripData.alertMsg}
                </div>
              </div>
            </div>

            {/* Custom SVG Expense Distribution Chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-4">Expense Distribution by Category</h3>
              
              {activeTripData.totalSpent > 0 ? (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* Category bars */}
                  <div className="space-y-3.5">
                    {Object.entries(activeTripData.categoryTotals).map(([cat, amount]) => {
                      const percentage = activeTripData.totalSpent > 0 ? Math.round((amount / activeTripData.totalSpent) * 100) : 0;
                      if (amount === 0) return null; // Only show non-zero categories
                      
                      let barColor = 'bg-sky-500';
                      switch (cat) {
                        case 'transport': barColor = 'bg-sky-500'; break;
                        case 'accommodation': barColor = 'bg-indigo-500'; break;
                        case 'food': barColor = 'bg-amber-500'; break;
                        case 'activities': barColor = 'bg-emerald-500'; break;
                        case 'shopping': barColor = 'bg-purple-500'; break;
                        default: barColor = 'bg-slate-400';
                      }

                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600 capitalize">{cat}</span>
                            <span className="font-bold text-slate-800">₹{amount.toLocaleString('en-IN')} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* SVG Chart visualization */}
                  <div className="flex justify-center p-2">
                    <svg viewBox="0 0 200 200" className="w-44 h-44">
                      {/* Simple mock donut circle using SVG strokes */}
                      <circle cx="100" cy="100" r="70" className="stroke-slate-100 fill-none" strokeWidth="20" />
                      
                      {/* Let's construct a stacked ring using SVGs or render legend blocks */}
                      {/* We show category legend blocks inside a clean aesthetic grid */}
                      <g transform="translate(45, 60)">
                        <circle cx="10" cy="10" r="7" className="fill-sky-500" />
                        <text x="25" y="14" className="text-[10px] font-bold fill-slate-500">Transit</text>
                        
                        <circle cx="10" cy="30" r="7" className="fill-indigo-500" />
                        <text x="25" y="34" className="text-[10px] font-bold fill-slate-500">Stay</text>

                        <circle cx="10" cy="50" r="7" className="fill-amber-500" />
                        <text x="25" y="54" className="text-[10px] font-bold fill-slate-500">Food</text>

                        <circle cx="10" cy="70" r="7" className="fill-emerald-500" />
                        <text x="25" y="74" className="text-[10px] font-bold fill-slate-500">Activities</text>
                      </g>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  No expenses logged yet. Go to Expense Tracker to log spending!
                </div>
              )}
            </div>

          </div>

          {/* Column 3: Secondary Widgets */}
          <div className="space-y-6">
            
            {/* Packing Checklist Progress Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-fit">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-slate-800">Packing Progress</h3>
                  <button
                    onClick={() => navigateTo('dashboard', 'checklist')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700"
                  >
                    Pack Items
                  </button>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <div className="w-14 h-14 rounded-full border-4 border-slate-100 flex items-center justify-center flex-shrink-0 relative">
                    {/* SVG Circle Progress */}
                    <svg className="w-full h-full transform -rotate-90 absolute">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-sky-500 fill-none"
                        strokeWidth="4"
                        strokeDasharray={125}
                        strokeDashoffset={125 - (125 * activeTripData.packing.percentage) / 100}
                        transform="translate(4,4)"
                      />
                    </svg>
                    <span className="text-xs font-extrabold text-slate-700 z-10">{activeTripData.packing.percentage}%</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-extrabold text-slate-700">
                      {activeTripData.packing.packed} / {activeTripData.packing.total} Packed
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      Categorised checklist items ready
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Expenses Widget */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-800">Recent Expenses</h3>
                <button
                  onClick={() => navigateTo('dashboard', 'expenses')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  View All
                </button>
              </div>

              {activeTripData.expenses.length > 0 ? (
                <div className="space-y-3">
                  {activeTripData.expenses.map(exp => (
                    <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="text-left min-w-0">
                        <span className="text-xs font-bold text-slate-800 truncate block">{exp.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">{exp.category}</span>
                      </div>
                      <span className="text-xs font-black text-rose-600">
                        -₹{exp.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  No expenses recorded.
                </div>
              )}
            </div>

            {/* Quick Tips Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-3xl p-6 text-left shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                💡 Travel Planning Tip
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Keep the **Estimated Budget** close to your expectations and log your transportation/hotel bookings in the **Expense Tracker** immediately to stay on top of warning levels.
              </p>
            </div>

          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-slate-400 font-medium bg-white border border-slate-200 rounded-3xl">
          Please select a trip using the sidebar or dropdown to see analytical stats.
        </div>
      )}
    </div>
  );
};
