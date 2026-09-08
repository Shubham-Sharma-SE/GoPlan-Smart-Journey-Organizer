import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { expenseService } from '../services/expenseService';
import { tripService } from '../services/tripService';
import { dateUtils } from '../utils/dateUtils';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Calculator, 
  ArrowRight,
  RefreshCw,
  Info,
  Compass
} from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const { activeTrip, trips, setActiveTripId, refreshTrips, showToast } = useAppContext();

  // Smart Estimator form state
  const [estTransport, setEstTransport] = useState(2000);
  const [estHotelPerDay, setEstHotelPerDay] = useState(1500);
  const [estFoodPerPersonPerDay, setEstFoodPerPersonPerDay] = useState(500);
  const [estActivity, setEstActivity] = useState(3000);
  const [estMisc, setEstMisc] = useState(1000);

  // Editable Budget Limit state
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [tempBudget, setTempBudget] = useState(0);

  // Initialize estimator values based on trip details when trip changes
  useEffect(() => {
    if (activeTrip) {
      setTempBudget(activeTrip.estimatedBudget);
    }
  }, [activeTrip]);

  // Compute actual spending and remaining budget
  const budgetStats = useMemo(() => {
    if (!activeTrip) return null;

    const expStats = expenseService.getExpenseStats(activeTrip.id);
    const spent = expStats.total;
    const remaining = activeTrip.estimatedBudget - spent;
    const percentage = activeTrip.estimatedBudget > 0 
      ? parseFloat(((spent / activeTrip.estimatedBudget) * 100).toFixed(1))
      : 0;

    // Determine Alert Message
    let alertMsg = "✓ You are comfortably within your budget.";
    let alertColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
    let alertProgress = "bg-emerald-500";

    if (percentage >= 70 && percentage < 90) {
      alertMsg = "⚠ You are approaching your budget limit.";
      alertColor = "bg-amber-50 text-amber-800 border-amber-200";
      alertProgress = "bg-amber-500";
    } else if (percentage >= 90 && percentage <= 100) {
      alertMsg = "⚠ You have almost reached your budget.";
      alertColor = "bg-orange-50 text-orange-800 border-orange-200";
      alertProgress = "bg-orange-500";
    } else if (spent > activeTrip.estimatedBudget) {
      alertMsg = "🔴 Your trip budget has been exceeded.";
      alertColor = "bg-rose-50 text-rose-800 border-rose-200";
      alertProgress = "bg-rose-500";
    }

    return {
      spent,
      remaining,
      percentage,
      alertMsg,
      alertColor,
      alertProgress,
      categoryTotals: expStats.categoryTotals
    };
  }, [activeTrip, trips]);

  // Get active trip details
  const tripDays = activeTrip ? dateUtils.calculateDuration(activeTrip.startDate, activeTrip.endDate) : 0;
  const tripTravelers = activeTrip ? activeTrip.travelers : 1;

  // Cost estimator computations
  const estimationResults = useMemo(() => {
    const hotelCost = estHotelPerDay * tripDays;
    const foodCost = estFoodPerPersonPerDay * tripTravelers * tripDays;
    const totalEstimate = estTransport + hotelCost + foodCost + estActivity + estMisc;

    return {
      hotelCost,
      foodCost,
      totalEstimate
    };
  }, [estTransport, estHotelPerDay, estFoodPerPersonPerDay, estActivity, estMisc, tripDays, tripTravelers]);

  // Save budget limit edit
  const handleUpdateBudgetLimit = () => {
    if (!activeTrip) return;
    if (tempBudget < 0) {
      showToast('Budget cannot be negative.', 'error');
      return;
    }

    try {
      tripService.updateTrip({
        ...activeTrip,
        estimatedBudget: tempBudget
      });
      showToast('Trip budget limit updated!', 'success');
      setIsEditingLimit(false);
      refreshTrips();
    } catch (err: any) {
      showToast(err.message || 'Error updating budget.', 'error');
    }
  };

  // Apply Cost Estimator total as Trip Budget
  const handleApplyEstimateAsBudget = () => {
    if (!activeTrip) return;
    try {
      tripService.updateTrip({
        ...activeTrip,
        estimatedBudget: estimationResults.totalEstimate
      });
      setTempBudget(estimationResults.totalEstimate);
      showToast(`Applied ₹${estimationResults.totalEstimate.toLocaleString('en-IN')} as Trip Budget!`, 'success');
      refreshTrips();
    } catch (err: any) {
      showToast(err.message || 'Error applying budget.', 'error');
    }
  };

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-800">No active trip selected</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Please select a trip using the dropdown or sidebar to view the Budget Manager.
        </p>
        {trips.length > 0 && (
          <select
            onChange={(e) => setActiveTripId(e.target.value)}
            className="mt-4 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="">Select a trip...</option>
            {trips.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Overview stats block */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Budget Manager</span>
            <h2 className="text-xl font-bold text-slate-800">{activeTrip.name} Finance Panel</h2>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditingLimit ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(parseFloat(e.target.value))}
                  className="w-28 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
                <button
                  onClick={handleUpdateBudgetLimit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setTempBudget(activeTrip.estimatedBudget);
                    setIsEditingLimit(false);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingLimit(true)}
                className="bg-sky-50 hover:bg-sky-100/80 text-sky-700 font-bold border border-sky-100 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                Change Budget Limit
              </button>
            )}
          </div>
        </div>

        {budgetStats && (
          <div className="mt-6 border-t border-slate-100 pt-6 space-y-6">
            {/* 3 Metric counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Budget Limit</span>
                  <Wallet className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-2xl font-black text-slate-800 mt-1 block">₹{activeTrip.estimatedBudget.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Actual Expenditure</span>
                  <TrendingUp className="w-4 h-4 text-rose-500/80" />
                </div>
                <span className="text-2xl font-black text-rose-600 mt-1 block">₹{budgetStats.spent.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Remaining Balance</span>
                  <TrendingDown className={`w-4 h-4 ${budgetStats.remaining >= 0 ? 'text-emerald-500/80' : 'text-rose-500/80'}`} />
                </div>
                <span className={`text-2xl font-black mt-1 block ${budgetStats.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ₹{budgetStats.remaining.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Overall Bar progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span>Budget Utilisation Progress</span>
                <span>{budgetStats.percentage}% Consumed</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-100 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${budgetStats.alertProgress}`}
                  style={{ width: `${Math.min(budgetStats.percentage, 100)}%` }}
                ></div>
              </div>
              
              {/* Alert Message Banner */}
              <div className={`mt-3 p-4 rounded-2xl border text-xs md:text-sm font-extrabold flex items-center gap-2.5 ${budgetStats.alertColor}`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {budgetStats.alertMsg}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Estimator vs Category list */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Smart cost estimator panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calculator className="w-5 h-5 text-sky-600" />
              Smart Journey Cost Estimator
            </h3>
            
            <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-2xl text-xs text-sky-800 font-semibold flex items-start gap-2">
              <Info className="w-4.5 h-4.5 text-sky-500 flex-shrink-0 mt-0.5" />
              <div>
                Auto-calculated based on trip configuration: 
                <span className="text-sky-950 font-bold"> {tripDays} days</span> and 
                <span className="text-sky-950 font-bold"> {tripTravelers} traveler(s)</span>.
              </div>
            </div>

            <div className="space-y-3.5 text-xs font-semibold text-slate-500">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-left mb-1">Transit / Transportation (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={estTransport}
                    onChange={(e) => setEstTransport(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-left mb-1">Stay / Hotel per day (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={estHotelPerDay}
                    onChange={(e) => setEstHotelPerDay(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-left mb-1">Food / person per day (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={estFoodPerPersonPerDay}
                    onChange={(e) => setEstFoodPerPersonPerDay(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-left mb-1">Activities Combo (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={estActivity}
                    onChange={(e) => setEstActivity(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-left mb-1">Miscellaneous / Shopping allowance (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={estMisc}
                  onChange={(e) => setEstMisc(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-left">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">Formula Calculations</span>
              
              <div className="flex justify-between text-slate-500">
                <span>Transportation:</span>
                <span className="font-bold">₹{estTransport.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hotel Cost ({estHotelPerDay} × {tripDays} days):</span>
                <span className="font-bold">₹{estimationResults.hotelCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Food Cost ({estFoodPerPersonPerDay} × {tripTravelers} travelers × {tripDays} days):</span>
                <span className="font-bold">₹{estimationResults.foodCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Activities:</span>
                <span className="font-bold">₹{estActivity.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Miscellaneous:</span>
                <span className="font-bold">₹{estMisc.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="border-t border-slate-200 pt-2.5 flex justify-between font-black text-sm text-slate-800">
                <span>Total Forecast Estimate:</span>
                <span className="text-sky-600">₹{estimationResults.totalEstimate.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleApplyEstimateAsBudget}
            className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10 text-xs md:text-sm cursor-pointer"
          >
            Apply Estimate as Trip Budget
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Expense distribution Category Breakdown List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
            Expenditure by Category
          </h3>
          
          {budgetStats && budgetStats.spent > 0 ? (
            <div className="space-y-4">
              {Object.entries(budgetStats.categoryTotals).map(([cat, amount]) => {
                const percentage = budgetStats.spent > 0 ? Math.round((amount / budgetStats.spent) * 100) : 0;
                
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
                  <div key={cat} className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-700 capitalize">
                        <span className={`w-2.5 h-2.5 rounded-full ${barColor}`}></span>
                        {cat}
                      </div>
                      <span className="font-black text-slate-800">
                        ₹{amount.toLocaleString('en-IN')} 
                        <span className="text-slate-400 font-medium text-[10px]"> ({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-400 font-medium bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              No category breakdown. Add expenses in the Expense Tracker page to populate breakdown figures dynamically.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
