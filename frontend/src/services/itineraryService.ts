import { ItineraryItem } from '../types';
import { sampleItineraries } from '../data/demoData';

const STORAGE_KEY = 'goplan_itineraries';

export const itineraryService = {
  getAllItineraries(): ItineraryItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleItineraries));
      return sampleItineraries;
    }
    return JSON.parse(data);
  },

  getItineraryByTripId(tripId: string): ItineraryItem[] {
    return this.getAllItineraries()
      .filter(item => item.tripId === tripId)
      // Sort by date, then by time (chronological)
      .sort((a, b) => {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        // Simple raw string time comparison (e.g. "08:00 AM" vs "01:00 PM")
        // Convert to standard 24h for reliable sorting comparison
        const t1 = this.convertTo24h(a.time);
        const t2 = this.convertTo24h(b.time);
        return t1.localeCompare(t2);
      });
  },

  createItineraryItem(item: Omit<ItineraryItem, 'id'>): ItineraryItem {
    const all = this.getAllItineraries();
    const newItem: ItineraryItem = {
      ...item,
      id: `itin-${Date.now()}`
    };
    all.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newItem;
  },

  updateItineraryItem(updated: ItineraryItem): ItineraryItem {
    const all = this.getAllItineraries();
    const index = all.findIndex(item => item.id === updated.id);
    if (index === -1) {
      throw new Error(`Itinerary item not found: ${updated.id}`);
    }
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  deleteItineraryItem(id: string): void {
    const all = this.getAllItineraries();
    const filtered = all.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  deleteByTripId(tripId: string): void {
    const all = this.getAllItineraries();
    const filtered = all.filter(item => item.tripId !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Helper to parse "08:00 AM" or "01:00 PM" into "08:00" or "13:00" for comparison
  convertTo24h(timeStr: string): string {
    if (!timeStr) return '00:00';
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return timeStr; // Return as-is if format is different (e.g., already 24h)
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
};
