import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { itineraryService } from '../services/itineraryService';
import { ItineraryItem } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { 
  Plus, 
  MapPin, 
  Clock, 
  CalendarDays, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Tag, 
  X,
  Compass
} from 'lucide-react';

export const ItineraryPage: React.FC = () => {
  const { activeTrip, trips, setActiveTripId, showToast } = useAppContext();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);

  // Form states
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('08:00 AM');
  const [activityName, setActivityName] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityCost, setActivityCost] = useState(0);

  // Load activities for the active trip
  const activities = useMemo(() => {
    if (!activeTrip) return [];
    return itineraryService.getItineraryByTripId(activeTrip.id);
  }, [activeTrip, isModalOpen]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ItineraryItem[]> = {};
    activities.forEach(act => {
      if (!groups[act.date]) {
        groups[act.date] = [];
      }
      groups[act.date].push(act);
    });

    // Sort the dates chronologically
    return Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => ({
        date,
        items: groups[date]
      }));
  }, [activities]);

  // Handle open add modal
  const handleOpenAdd = (dateStr?: string) => {
    if (!activeTrip) return;
    setEditingItem(null);
    setActivityDate(dateStr || activeTrip.startDate);
    setActivityTime('09:00 AM');
    setActivityName('');
    setActivityLocation('');
    setActivityDesc('');
    setActivityCost(0);
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (item: ItineraryItem) => {
    setEditingItem(item);
    setActivityDate(item.date);
    setActivityTime(item.time);
    setActivityName(item.activity);
    setActivityLocation(item.location);
    setActivityDesc(item.description);
    setActivityCost(item.estimatedCost);
    setIsModalOpen(true);
  };

  // Submit handler
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    // Field validation
    if (!activityDate || !activityTime.trim() || !activityName.trim()) {
      showToast('Date, Time, and Activity Name are required.', 'error');
      return;
    }

    // Check dates fall within trip range
    const tStart = new Date(activeTrip.startDate);
    const tEnd = new Date(activeTrip.endDate);
    const actDateObj = new Date(activityDate);
    
    tStart.setHours(0,0,0,0);
    tEnd.setHours(0,0,0,0);
    actDateObj.setHours(0,0,0,0);

    if (actDateObj < tStart || actDateObj > tEnd) {
      showToast(`Activity date must fall between trip start (${activeTrip.startDate}) and end (${activeTrip.endDate}).`, 'error');
      return;
    }

    if (activityCost < 0) {
      showToast('Estimated cost cannot be negative.', 'error');
      return;
    }

    const itemData = {
      tripId: activeTrip.id,
      date: activityDate,
      time: activityTime,
      activity: activityName,
      location: activityLocation,
      description: activityDesc,
      estimatedCost: activityCost
    };

    try {
      if (editingItem) {
        itineraryService.updateItineraryItem({ ...editingItem, ...itemData });
        showToast('Activity updated successfully!', 'success');
      } else {
        itineraryService.createItineraryItem(itemData);
        showToast('Activity added to itinerary!', 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving activity.', 'error');
    }
  };

  // Delete activity
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Remove this activity from your itinerary?')) {
      itineraryService.deleteItineraryItem(id);
      showToast('Activity removed.', 'info');
      // Force render update by changing modal state briefly or re-evaluating memo
      setIsModalOpen(false); // harmless state trigger
    }
  };

  // Check if there is a trip selected
  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-800">No active trip selected</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Please create a trip or select an existing one to plan your daily itineraries.
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

  // Generate list of days of the trip for quick adding
  const duration = dateUtils.calculateDuration(activeTrip.startDate, activeTrip.endDate);
  const tripDaysList = useMemo(() => {
    const dates: string[] = [];
    const current = new Date(activeTrip.startDate);
    const end = new Date(activeTrip.endDate);
    
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [activeTrip]);

  return (
    <div className="space-y-6 text-left relative">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Itinerary Planner</span>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 pt-0.5">{activeTrip.name}</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            Trip Dates: {dateUtils.formatDate(activeTrip.startDate)} - {dateUtils.formatDate(activeTrip.endDate)} ({duration} Days)
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd()}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      {/* Main timeline schedule */}
      {groupedActivities.length > 0 ? (
        <div className="space-y-8 relative pl-6">
          {/* Main timeline vertical line */}
          <div className="absolute left-[33px] top-6 bottom-6 w-0.5 bg-slate-200/80 -z-10"></div>

          {groupedActivities.map((day, dIdx) => {
            const dayNum = tripDaysList.indexOf(day.date) + 1;
            
            return (
              <div key={day.date} className="relative space-y-4 pl-8">
                {/* Day Header Badge on Timeline */}
                <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                  D{dayNum > 0 ? dayNum : dIdx + 1}
                </div>

                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                    Day {dayNum > 0 ? dayNum : dIdx + 1}: {dateUtils.formatDate(day.date)}
                  </h3>
                  <button
                    onClick={() => handleOpenAdd(day.date)}
                    className="p-1 hover:bg-sky-50 text-sky-600 hover:text-sky-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add stop
                  </button>
                </div>

                {/* Day activities stack */}
                <div className="space-y-3">
                  {day.items.map((act) => (
                    <div 
                      key={act.id} 
                      className="bg-white border border-slate-200/80 hover:border-slate-300 p-4 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div className="space-y-1.5 text-left">
                        {/* Time & Title */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100/50">
                            <Clock className="w-3 h-3 text-sky-500" />
                            {act.time}
                          </span>
                          <span className="font-extrabold text-slate-800 text-sm md:text-base">{act.activity}</span>
                        </div>

                        {/* Location and Cost */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold">
                          {act.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {act.location}
                            </span>
                          )}
                          {act.estimatedCost > 0 && (
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <Tag className="w-3.5 h-3.5" />
                              Est: ₹{act.estimatedCost.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {act.description && (
                          <p className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-50 p-2 rounded-xl border border-slate-100 inline-block">
                            {act.description}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => handleOpenEdit(act)}
                          className="p-1.5 bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-600 rounded-lg border border-slate-100 hover:border-sky-100 transition-all shadow-xs"
                          title="Edit Activity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(act.id)}
                          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg border border-slate-100 hover:border-rose-100 transition-all shadow-xs"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center p-6 shadow-sm">
          <CalendarDays className="w-12 h-12 text-slate-200 mb-3" />
          <h3 className="text-base font-bold text-slate-800">Itinerary is empty</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
            Organise and add sightseeing points, lunch stops, or transport timings to build your daily travel map.
          </p>
          <button
            onClick={() => handleOpenAdd()}
            className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>
      )}

      {/* --- ITINERARY CRUD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800">
                {editingItem ? 'Edit Itinerary Activity' : 'Add Activity stop'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Date *</label>
                  <input
                    type="date"
                    required
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM, 13:00"
                    value={activityTime}
                    onChange={(e) => setActivityTime(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Activity / Stop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scuba diving, Visit Aguada Fort"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Location / Venue</label>
                <input
                  type="text"
                  placeholder="e.g. Baga Beach, Candolim"
                  value={activityLocation}
                  onChange={(e) => setActivityLocation(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Estimated Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={activityCost}
                  onChange={(e) => setActivityCost(parseFloat(e.target.value))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Activity Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring extra clothes, carry driving license..."
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold cursor-pointer shadow-md shadow-sky-600/10"
                >
                  {editingItem ? 'Save Activity' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
