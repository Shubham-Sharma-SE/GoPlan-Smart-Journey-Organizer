import { Trip } from '../types';
import { sampleTrips } from '../data/demoData';
import { dateUtils } from '../utils/dateUtils';

const STORAGE_KEY = 'goplan_trips';

export const tripService = {
  // Get all trips, seeding if empty
  getAllTrips(): Trip[] {
    const data = localStorage.getItem(STORAGE_KEY);
    let trips: Trip[] = [];
    if (!data) {
      trips = sampleTrips;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } else {
      trips = JSON.parse(data);
    }
    
    // Automatically update trip status based on dates on every fetch
    const updatedTrips = trips.map(trip => {
      const calculatedStatus = dateUtils.determineStatus(trip.startDate, trip.endDate);
      if (trip.status !== calculatedStatus) {
        return { ...trip, status: calculatedStatus };
      }
      return trip;
    });

    // Save back if any status changed
    const statusChanged = updatedTrips.some((t, i) => t.status !== trips[i].status);
    if (statusChanged) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    }

    return updatedTrips;
  },

  // Get trips for a specific user
  getTripsByUserId(userId: string): Trip[] {
    return this.getAllTrips().filter(trip => trip.userId === userId);
  },

  // Get a specific trip by ID
  getTripById(id: string): Trip | null {
    const trips = this.getAllTrips();
    return trips.find(trip => trip.id === id) || null;
  },

  // Create a trip
  createTrip(trip: Omit<Trip, 'id' | 'status' | 'userId'>, userId: string): Trip {
    const trips = this.getAllTrips();
    const status = dateUtils.determineStatus(trip.startDate, trip.endDate);
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}`,
      status,
      userId
    };
    trips.push(newTrip);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return newTrip;
  },

  // Update an existing trip
  updateTrip(updatedTrip: Trip): Trip {
    const trips = this.getAllTrips();
    const index = trips.findIndex(t => t.id === updatedTrip.id);
    if (index === -1) {
      throw new Error(`Trip with ID ${updatedTrip.id} not found.`);
    }
    
    const status = dateUtils.determineStatus(updatedTrip.startDate, updatedTrip.endDate);
    const tripToSave = { ...updatedTrip, status };
    trips[index] = tripToSave;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return tripToSave;
  },

  // Delete a trip
  deleteTrip(id: string): void {
    const trips = this.getAllTrips();
    const filteredTrips = trips.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTrips));

    // Also trigger deletion of related child records (cascade delete in Java / local simulation)
    // We can import services dynamically or clean them up here
    import('./destinationService').then(s => s.destinationService.deleteByTripId(id));
    import('./itineraryService').then(s => s.itineraryService.deleteByTripId(id));
    import('./expenseService').then(s => s.expenseService.deleteByTripId(id));
    import('./checklistService').then(s => s.checklistService.deleteByTripId(id));
    import('./noteService').then(s => s.noteService.deleteByTripId(id));
  },

  // Search and Filter Trips
  searchAndFilter(
    userId: string,
    query: string,
    statusFilter?: string,
    sortBy?: string
  ): Trip[] {
    let trips = this.getTripsByUserId(userId);

    // Search query matching trip name, starting location, or destination
    if (query) {
      const q = query.toLowerCase();
      trips = trips.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.startingLocation.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }

    // Filter by status (upcoming, ongoing, completed)
    if (statusFilter && statusFilter !== 'all') {
      trips = trips.filter(t => t.status === statusFilter);
    }

    // Sorting
    if (sortBy) {
      if (sortBy === 'name') {
        trips.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'date-asc') {
        trips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      } else if (sortBy === 'date-desc') {
        trips.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      } else if (sortBy === 'budget-asc') {
        trips.sort((a, b) => a.estimatedBudget - b.estimatedBudget);
      } else if (sortBy === 'budget-desc') {
        trips.sort((a, b) => b.estimatedBudget - a.estimatedBudget);
      }
    }

    return trips;
  }
};
