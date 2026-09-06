import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { destinationService } from '../services/destinationService';
import { itineraryService } from '../services/itineraryService';
import { expenseService } from '../services/expenseService';
import { checklistService } from '../services/checklistService';
import { noteService } from '../services/noteService';
import { dateUtils } from '../utils/dateUtils';
import { 
  Printer, 
  MapPin, 
  Calendar, 
  Users, 
  Wallet, 
  CheckSquare, 
  FileText, 
  Activity,
  Compass,
  ArrowRight
} from 'lucide-react';

export const SummaryPage: React.FC = () => {
  const { activeTrip, trips, setActiveTripId } = useAppContext();

  // Load summary details
  const summaryDetails = useMemo(() => {
    if (!activeTrip) return null;

    const dests = destinationService.getDestinationsByTripId(activeTrip.id);
    const activityCount = itineraryService.getItineraryByTripId(activeTrip.id).length;
    const expenseStats = expenseService.getExpenseStats(activeTrip.id);
    const packingStats = checklistService.getPackingProgress(activeTrip.id);
    const importantNotes = noteService.getNotesByTripId(activeTrip.id)
      .filter(n => n.category === 'important');

    const duration = dateUtils.calculateDuration(activeTrip.startDate, activeTrip.endDate);
    
    return {
      dests,
      activityCount,
      spent: expenseStats.total,
      remaining: activeTrip.estimatedBudget - expenseStats.total,
      categoryBreakdown: expenseStats.categoryTotals,
      packing: packingStats,
      importantNotes,
      duration
    };
  }, [activeTrip, trips]);

  const handlePrint = () => {
    window.print();
  };

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-800">No active trip selected</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Select or create a trip to view and print the Trip Summary.
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

  if (!summaryDetails) return null;

  return (
    <div className="space-y-6 text-left relative max-w-4xl mx-auto">
      
      {/* Action Header bar - HIDDEN IN PRINT */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex justify-between items-center print:hidden">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trip Reports</span>
          <h2 className="text-xl font-bold text-slate-800">Printable Trip Summary</h2>
        </div>
        <button
          onClick={handlePrint}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/10 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" /> Print Summary
        </button>
      </div>

      {/* --- PRINTABLE REPORT WRAPPER --- */}
      {/* In print mode, margins are reset, backgrounds are forced white */}
      <div className="bg-white border border-slate-200 print:border-none rounded-3xl print:rounded-none p-6 sm:p-8 md:p-12 shadow-sm print:shadow-none space-y-8 text-slate-800 font-sans print:p-0">
        
        {/* Letterhead Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">Go</span>
              <span className="text-xl font-black text-sky-600">Plan</span>
              <span className="text-xs text-slate-400 font-bold border-l border-slate-300 pl-2 uppercase tracking-widest">Travel Report</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Plan Smarter, Travel Better!</p>
          </div>
          <div className="text-left sm:text-right text-xs text-slate-400 font-semibold">
            <p>Report Date: {dateUtils.formatDate(new Date().toISOString().split('T')[0])}</p>
            <p className="mt-0.5">Trip ID: {activeTrip.id}</p>
          </div>
        </div>

        {/* Section 1: Trip Core Information */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl print:bg-white print:border-slate-200">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Trip Name</span>
            <span className="font-extrabold text-slate-800 text-sm mt-1 block">{activeTrip.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Source ➔ Stop</span>
            <span className="font-extrabold text-slate-800 text-sm mt-1 block truncate">
              {activeTrip.startingLocation} ➔ {activeTrip.destination}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Duration</span>
            <span className="font-extrabold text-slate-800 text-sm mt-1 block">
              {summaryDetails.duration} Days ({dateUtils.formatDate(activeTrip.startDate)} - {dateUtils.formatDate(activeTrip.endDate)})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Travelers Count</span>
            <span className="font-extrabold text-slate-800 text-sm mt-1 block">
              {activeTrip.travelers} ({activeTrip.travelMode.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Section 2: Destinations Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-sky-600" />
            Route stops sequence
          </h3>

          {summaryDetails.dests.length > 0 ? (
            <div className="flex flex-wrap items-center gap-y-3 gap-x-2 text-xs font-bold text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100 print:bg-white print:border-slate-200">
              <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-lg border border-sky-200 font-extrabold">
                {activeTrip.startingLocation}
              </span>
              {summaryDetails.dests.map((dest, i) => (
                <React.Fragment key={dest.id}>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-col items-start bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                    <span className="text-slate-800 font-extrabold">{dest.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Arrive: {dateUtils.formatDate(dest.arrivalDate)}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium italic">No destinations timeline configured.</p>
          )}
        </div>

        {/* Section 3: Financial Summary & Category breakdown */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Financial summary */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Wallet className="w-4.5 h-4.5 text-sky-600" />
              Budget Summary
            </h3>
            
            <table className="w-full text-xs text-left">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 font-semibold text-slate-500">Trip Budget Limit:</td>
                  <td className="py-2.5 font-extrabold text-slate-900 text-right">₹{activeTrip.estimatedBudget.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 font-semibold text-slate-500">Actual Outflow Spending:</td>
                  <td className="py-2.5 font-extrabold text-rose-600 text-right">₹{summaryDetails.spent.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-slate-200 font-bold text-sm">
                  <td className="py-3 text-slate-700">Remaining Balance:</td>
                  <td className={`py-3 text-right ${summaryDetails.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ₹{summaryDetails.remaining.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Category break tables */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-sky-600" />
              Category Expenses Outflow
            </h3>
            {summaryDetails.spent > 0 ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(summaryDetails.categoryBreakdown).map(([cat, amt]) => (
                  <div key={cat} className="flex justify-between items-center p-2 border border-slate-100 rounded-lg">
                    <span className="capitalize font-semibold text-slate-500">{cat}</span>
                    <span className="font-extrabold text-slate-800">₹{amt.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic py-2">No category logs registered.</p>
            )}
          </div>
        </div>

        {/* Section 4: Activities and Packing statistics */}
        <div className="grid md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-sky-600" />
              Activities & Packing Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 print:bg-white print:border-slate-200">
                <span>Itinerary activities:</span>
                <span className="block text-base font-extrabold text-slate-800 mt-1">{summaryDetails.activityCount} stops</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 print:bg-white print:border-slate-200">
                <span>Gear packed progress:</span>
                <span className="block text-base font-extrabold text-slate-800 mt-1">
                  {summaryDetails.packing.packed} / {summaryDetails.packing.total} items ({summaryDetails.packing.percentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Important Notes & Guidelines */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-sky-600" />
              Critical Guidelines & Notes
            </h3>

            {summaryDetails.importantNotes.length > 0 ? (
              <div className="space-y-2">
                {summaryDetails.importantNotes.map(n => (
                  <div key={n.id} className="p-3 bg-orange-50 border border-orange-200/60 rounded-xl text-xs print:bg-white print:border-slate-200 text-left">
                    <span className="font-extrabold text-orange-950 block">{n.title}</span>
                    <span className="text-slate-600 font-medium block mt-0.5">{n.description}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">No emergency guidelines or critical notes added.</p>
            )}
          </div>
        </div>

        {/* Footer print note */}
        <div className="border-t border-slate-200 pt-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden print:block">
          Thank you for traveling with GoPlan!
        </div>

      </div>
    </div>
  );
};
