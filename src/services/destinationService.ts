import { Destination } from '../types';
import { sampleDestinations } from '../data/demoData';

const STORAGE_KEY = 'goplan_destinations';

export const destinationService = {
  getAllDestinations(): Destination[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDestinations));
      return sampleDestinations;
    }
    return JSON.parse(data);
  },

  getDestinationsByTripId(tripId: string): Destination[] {
    return this.getAllDestinations()
      .filter(dest => dest.tripId === tripId)
      .sort((a, b) => a.order - b.order);
  },

  createDestination(destination: Omit<Destination, 'id' | 'order'>): Destination {
    const all = this.getAllDestinations();
    const tripDestinations = this.getDestinationsByTripId(destination.tripId);
    
    const newDest: Destination = {
      ...destination,
      id: `dest-${Date.now()}`,
      order: tripDestinations.length
    };

    all.push(newDest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newDest;
  },

  updateDestination(updated: Destination): Destination {
    const all = this.getAllDestinations();
    const index = all.findIndex(d => d.id === updated.id);
    if (index === -1) {
      throw new Error(`Destination not found: ${updated.id}`);
    }
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  deleteDestination(id: string): void {
    const all = this.getAllDestinations();
    const destToDelete = all.find(d => d.id === id);
    if (!destToDelete) return;

    const filtered = all.filter(d => d.id !== id);
    
    // Adjust orders for remaining destinations in the same trip
    const tripId = destToDelete.tripId;
    let orderIndex = 0;
    const finalData = filtered.map(d => {
      if (d.tripId === tripId) {
        return { ...d, order: orderIndex++ };
      }
      return d;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
  },

  deleteByTripId(tripId: string): void {
    const all = this.getAllDestinations();
    const filtered = all.filter(d => d.tripId !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  reorderDestinations(tripId: string, orderedIds: string[]): Destination[] {
    const all = this.getAllDestinations();
    
    // Map order values according to index in orderedIds
    const updated = all.map(d => {
      if (d.tripId === tripId) {
        const newIndex = orderedIds.indexOf(d.id);
        if (newIndex !== -1) {
          return { ...d, order: newIndex };
        }
      }
      return d;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return this.getDestinationsByTripId(tripId);
  }
};
