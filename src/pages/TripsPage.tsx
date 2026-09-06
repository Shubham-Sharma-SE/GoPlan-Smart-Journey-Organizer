import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { tripService } from '../services/tripService';
import { destinationService } from '../services/destinationService';
import { Trip, Destination, TravelMode, TripStatus } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  MapPin, 
  Users, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Map, 
  Clock, 
  Compass,
  Check,
  X,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Wallet
} from 'lucide-react';

export const TripsPage: React.FC = () => {
  const { currentUser, trips, activeTripId, setActiveTripId, refreshTrips, showToast } = useAppContext();

  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-asc');

  // Active expanded trip for destination management
  const [managingDestTrip, setManagingDestTrip] = useState<Trip | null>(null);

  // Modals state
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Form states - Trip
  const [tripName, setTripName] = useState('');
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [travelMode, setTravelMode] = useState<TravelMode>('car');
  const [estimatedBudget, setEstimatedBudget] = useState(10000);
  const [description, setDescription] = useState('');
  
  // Form states - Destination
  const [destName, setDestName] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [destArrival, setDestArrival] = useState('');
  const [destDeparture, setDestDeparture] = useState('');
  const [destCost, setDestCost] = useState(0);
  const [destNotes, setDestNotes] = useState('');

  // Auto-expand/reload destinations when expanded trip is edited/changed
  const currentDestinations = useMemo(() => {
    if (!managingDestTrip) return [];
    return destinationService.getDestinationsByTripId(managingDestTrip.id);
  }, [managingDestTrip, isDestModalOpen]);

  // Synchronise expanded trip ref with the latest trip object (if edited)
  useEffect(() => {
    if (managingDestTrip) {
      const latest = trips.find(t => t.id === managingDestTrip.id);
      if (latest) {
        setManagingDestTrip(latest);
      } else {
        setManagingDestTrip(null);
      }
    }
  }, [trips]);

  // Fetch filtered trips
  const filteredTrips = useMemo(() => {
    if (!currentUser) return [];
    return tripService.searchAndFilter(currentUser.id, searchQuery, statusFilter, sortBy);
  }, [trips, searchQuery, statusFilter, sortBy, currentUser]);

  // Open Add Trip modal
  const handleOpenAddTrip = () => {
    setEditingTrip(null);
    setTripName('');
    setStartingLocation('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setTravelers(1);
    setTravelMode('car');
    setEstimatedBudget(10000);
    setDescription('');
    setIsTripModalOpen(true);
  };

  // Open Edit Trip modal
  const handleOpenEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setTripName(trip.name);
    setStartingLocation(trip.startingLocation);
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setTravelers(trip.travelers);
    setTravelMode(trip.travelMode);
    setEstimatedBudget(trip.estimatedBudget);
    setDescription(trip.description);
    setIsTripModalOpen(true);
  };

  // Save Trip form
  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Validations
    if (!tripName.trim() || !startingLocation.trim() || !destination.trim() || !startDate || !endDate) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      showToast('End Date cannot be before Start Date.', 'error');
      return;
    }

    if (estimatedBudget < 0) {
      showToast('Estimated budget cannot be negative.', 'error');
      return;
    }

    if (travelers < 1) {
      showToast('There must be at least 1 traveler.', 'error');
      return;
    }

    const tripData = {
      name: tripName,
      startingLocation,
      destination,
      startDate,
      endDate,
      travelers,
      travelMode,
      estimatedBudget,
      description
    };

    try {
      if (editingTrip) {
        tripService.updateTrip({ ...editingTrip, ...tripData });
        showToast('Trip updated successfully!', 'success');
      } else {
        const created = tripService.createTrip(tripData, currentUser.id);
        setActiveTripId(created.id); // Auto-focus on new trip
        showToast('Trip created successfully!', 'success');
      }
      setIsTripModalOpen(false);
      refreshTrips();
    } catch (err: any) {
      showToast(err.message || 'Error saving trip.', 'error');
    }
  };

  // Delete Trip
  const handleDeleteTrip = (id: string) => {
    if (window.confirm('Are you sure you want to delete this trip? All destinations, itineraries, and expenses will be deleted.')) {
      tripService.deleteTrip(id);
      
      // If deleted active trip, clear it or set to another
      if (activeTripId === id) {
        const remaining = tripService.getTripsByUserId(currentUser?.id || '');
        setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
      }
      showToast('Trip deleted successfully.', 'info');
      refreshTrips();
    }
  };

  // Open Destination Form
  const handleOpenAddDest = () => {
    if (!managingDestTrip) return;
    setEditingDest(null);
    setDestName('');
    setDestLocation('');
    // Default destination dates to match trip
    setDestArrival(managingDestTrip.startDate);
    setDestDeparture(managingDestTrip.endDate);
    setDestCost(0);
    setDestNotes('');
    setIsDestModalOpen(true);
  };

  // Open Edit Destination Form
  const handleOpenEditDest = (dest: Destination) => {
    setEditingDest(dest);
    setDestName(dest.name);
    setDestLocation(dest.location);
    setDestArrival(dest.arrivalDate);
    setDestDeparture(dest.departureDate);
    setDestCost(dest.estimatedCost);
    setDestNotes(dest.notes);
    setIsDestModalOpen(true);
  };

  // Save Destination
  const handleSaveDest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingDestTrip) return;

    // Validations
    if (!destName.trim() || !destLocation.trim() || !destArrival || !destDeparture) {
      showToast('Please fill in all required destination fields.', 'error');
      return;
    }

    const tStart = new Date(managingDestTrip.startDate);
    const tEnd = new Date(managingDestTrip.endDate);
    const dArrival = new Date(destArrival);
    const dDeparture = new Date(destDeparture);

    if (dArrival < tStart || dArrival > tEnd || dDeparture < tStart || dDeparture > tEnd) {
      showToast(`Dates must fall within the trip range: ${managingDestTrip.startDate} to ${managingDestTrip.endDate}`, 'error');
      return;
    }

    if (dDeparture < dArrival) {
      showToast('Departure date cannot be before arrival date.', 'error');
      return;
    }

    if (destCost < 0) {
      showToast('Estimated cost cannot be negative.', 'error');
      return;
    }

    const destData = {
      tripId: managingDestTrip.id,
      name: destName,
      location: destLocation,
      arrivalDate: destArrival,
      departureDate: destDeparture,
      estimatedCost: destCost,
      notes: destNotes
    };

    if (editingDest) {
      destinationService.updateDestination({ ...editingDest, ...destData });
      showToast('Destination updated!', 'success');
    } else {
      destinationService.createDestination(destData);
      showToast('Destination added!', 'success');
    }

    setIsDestModalOpen(false);
    refreshTrips(); // Triggers update
  };

  // Delete Destination
  const handleDeleteDest = (id: string) => {
    if (window.confirm('Delete this destination?')) {
      destinationService.deleteDestination(id);
      showToast('Destination removed.', 'info');
      refreshTrips();
    }
  };

  // Reorder Destinations
  const handleReorderDest = (index: number, direction: 'up' | 'down') => {
    if (!managingDestTrip) return;
    const dests = [...currentDestinations];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIdx < 0 || targetIdx >= dests.length) return;

    // Swap elements
    const temp = dests[index];
    dests[index] = dests[targetIdx];
    dests[targetIdx] = temp;

    // Save orders
    const orderedIds = dests.map(d => d.id);
    destinationService.reorderDestinations(managingDestTrip.id, orderedIds);
    refreshTrips();
  };

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case 'upcoming': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'ongoing': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const travelIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return <Plane className="w-4 h-4 text-slate-400" />;
      case 'train': return <Train className="w-4 h-4 text-slate-400" />;
      case 'bus': return <Bus className="w-4 h-4 text-slate-400" />;
      case 'car': return <Car className="w-4 h-4 text-slate-400" />;
      case 'bike': return <Bike className="w-4 h-4 text-slate-400" />;
      default: return <Compass className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      {/* Search & Sort Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search trips by name or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
          />
        </div>

        {/* Filter and Sort options */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="all">All Trips</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="name">Name A-Z</option>
              <option value="budget-asc">Budget Low-High</option>
              <option value="budget-desc">Budget High-Low</option>
            </select>
          </div>

          <button
            onClick={handleOpenAddTrip}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Trip
          </button>
        </div>
      </div>

      {/* Trips list grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => {
          const isActive = activeTripId === trip.id;
          const duration = dateUtils.calculateDuration(trip.startDate, trip.endDate);
          
          return (
            <div 
              key={trip.id}
              className={`bg-white border rounded-3xl p-5.5 shadow-sm transition-all flex flex-col justify-between ${
                isActive 
                  ? 'border-sky-500 ring-2 ring-sky-500/15' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Card Title Header */}
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 text-left">
                    <h3 className="font-extrabold text-slate-800 truncate text-base">{trip.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      ID: {trip.id}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border capitalize ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>

                {/* Info List */}
                <div className="mt-4.5 space-y-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{trip.startingLocation} ➔ {trip.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>
                      {dateUtils.formatDate(trip.startDate)} - {dateUtils.formatDate(trip.endDate)} 
                      <span className="text-slate-400 font-normal"> ({duration} days)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{trip.travelers} Traveler(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {travelIcon(trip.travelMode)}
                    <span className="capitalize">{trip.travelMode} mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-500/70 flex-shrink-0" />
                    <span className="text-slate-700">Budget Limit: <span className="font-bold text-emerald-600">₹{trip.estimatedBudget.toLocaleString('en-IN')}</span></span>
                  </div>
                </div>

                {/* Description */}
                {trip.description && (
                  <p className="mt-4 text-xs text-slate-400 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    {trip.description}
                  </p>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  onClick={() => setActiveTripId(trip.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-white border border-slate-200 hover:border-sky-200 text-slate-600 hover:text-sky-600'
                  }`}
                >
                  {isActive ? <Check className="w-3.5 h-3.5 text-sky-600" /> : null}
                  {isActive ? 'Selected' : 'Select Trip'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setManagingDestTrip(trip)}
                    className="p-2 bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-600 rounded-xl border border-slate-100 hover:border-sky-100 transition-all"
                    title="Manage Destinations"
                  >
                    <Map className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditTrip(trip)}
                    className="p-2 bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-600 rounded-xl border border-slate-100 hover:border-sky-100 transition-all"
                    title="Edit Trip Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl border border-slate-100 hover:border-rose-100 transition-all"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
          No trips found matching the search query or status filter.
        </div>
      )}

      {/* --- DESTINATION MANAGEMENT TIMELINE PANEL --- */}
      {managingDestTrip && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mt-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Map className="w-4.5 h-4.5 text-sky-600" />
                Destination Timeline: {managingDestTrip.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Organise and sequence the travel stops. Reorder timeline nodes.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleOpenAddDest}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stop
              </button>
              <button
                onClick={() => setManagingDestTrip(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Destinations Visual Timeline */}
          {currentDestinations.length > 0 ? (
            <div className="relative pl-6 space-y-6">
              {/* Vertical connector line */}
              <div className="absolute left-[34px] top-6 bottom-6 w-0.5 bg-slate-200 -z-10"></div>
              
              {currentDestinations.map((dest, idx) => (
                <div key={dest.id} className="relative flex gap-4.5 items-start pl-8 group">
                  {/* Timeline bullet / order indicator */}
                  <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-white border-2 border-sky-500 text-sky-600 font-extrabold text-xs flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </div>

                  {/* Stop detail card */}
                  <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-sm md:text-base">{dest.name}</span>
                        <span className="text-[10px] bg-slate-200/60 px-2 py-0.5 rounded-full text-slate-500 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {dest.location}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Arrival: {dateUtils.formatDate(dest.arrivalDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Departure: {dateUtils.formatDate(dest.departureDate)}
                        </span>
                        <span className="text-emerald-600 font-bold">
                          Est: ₹{dest.estimatedCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {dest.notes && (
                        <p className="text-xs text-slate-400 italic bg-white p-2 rounded-lg border border-slate-100 inline-block mt-1">
                          ✏️ {dest.notes}
                        </p>
                      )}
                    </div>

                    {/* Timeline Controls (Reorder up/down, Edit, Delete) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleReorderDest(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 bg-white border border-slate-200 disabled:opacity-30 disabled:hover:bg-white hover:bg-slate-50 rounded-lg text-slate-500 shadow-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReorderDest(idx, 'down')}
                        disabled={idx === currentDestinations.length - 1}
                        className="p-1.5 bg-white border border-slate-200 disabled:opacity-30 disabled:hover:bg-white hover:bg-slate-50 rounded-lg text-slate-500 shadow-xs"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditDest(dest)}
                        className="p-1.5 bg-white border border-slate-200 hover:bg-sky-50 text-slate-500 hover:text-sky-600 rounded-lg shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDest(dest.id)}
                        className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-medium">
              No stops added to this journey timeline yet. Add stops above to build your map path (e.g. Pune ➔ Mumbai ➔ Goa).
            </div>
          )}
        </div>
      )}

      {/* --- TRIP CRUD MODAL --- */}
      {isTripModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800">
                {editingTrip ? 'Edit Trip Details' : 'Create New Trip'}
              </h3>
              <button 
                onClick={() => setIsTripModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Trip Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Adventure, Diwali Break"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Starting Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Goa"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Travelers Count *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Travel Mode *</label>
                  <select
                    value={travelMode}
                    onChange={(e) => setTravelMode(e.target.value as TravelMode)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer bg-white"
                  >
                    <option value="flight">Flight</option>
                    <option value="train">Train</option>
                    <option value="bus">Bus</option>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Estimated Budget (₹) *</label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 20000"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(parseFloat(e.target.value))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short notes about the journey..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTripModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-600/10 cursor-pointer"
                >
                  {editingTrip ? 'Save Changes' : 'Create Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DESTINATION CRUD MODAL --- */}
      {isDestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800">
                {editingDest ? 'Edit Destination Stop' : 'Add Journey Stop'}
              </h3>
              <button 
                onClick={() => setIsDestModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Stop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baga Beach, Fontainhas"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Exact Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Goa"
                  value={destLocation}
                  onChange={(e) => setDestLocation(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Arrival Date *</label>
                  <input
                    type="date"
                    required
                    value={destArrival}
                    onChange={(e) => setDestArrival(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={destDeparture}
                    onChange={(e) => setDestDeparture(e.target.value)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Estimated Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={destCost}
                  onChange={(e) => setDestCost(parseFloat(e.target.value))}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Try scuba diving here, buy souvenirs"
                  value={destNotes}
                  onChange={(e) => setDestNotes(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold cursor-pointer shadow-md shadow-sky-600/10"
                >
                  {editingDest ? 'Save Stop' : 'Add Stop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
