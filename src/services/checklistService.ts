import { ChecklistItem, ChecklistCategory } from '../types';
import { sampleChecklist } from '../data/demoData';

const STORAGE_KEY = 'goplan_checklist';

const DEFAULT_ITEMS: Omit<ChecklistItem, 'id' | 'tripId' | 'completed'>[] = [
  // Documents
  { name: 'ID Card / Aadhaar Card', category: 'documents' },
  { name: 'Passport (if international)', category: 'documents' },
  { name: 'Travel Tickets (Flight/Train/Bus)', category: 'documents' },
  { name: 'Hotel Booking Confirmations', category: 'documents' },
  // Electronics
  { name: 'Mobile Phone', category: 'electronics' },
  { name: 'Charger & Cables', category: 'electronics' },
  { name: 'Power Bank', category: 'electronics' },
  { name: 'Earphones / Headphones', category: 'electronics' },
  // Clothing
  { name: 'Suitable Clothes', category: 'clothing' },
  { name: 'Comfortable Shoes & Socks', category: 'clothing' },
  { name: 'Jacket / Raincoat (weather dependent)', category: 'clothing' },
  // Personal
  { name: 'Toiletries (Toothbrush, paste, soap, etc.)', category: 'personal' },
  { name: 'Reusable Water Bottle', category: 'personal' },
  { name: 'Sunglasses & Sunscreen', category: 'personal' }
];

export const checklistService = {
  getAllItems(): ChecklistItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleChecklist));
      return sampleChecklist;
    }
    return JSON.parse(data);
  },

  getItemsByTripId(tripId: string): ChecklistItem[] {
    const all = this.getAllItems();
    const tripItems = all.filter(item => item.tripId === tripId);
    
    // If no checklist items exist for this trip, seed them with default checklist items
    if (tripItems.length === 0) {
      return this.seedDefaultItemsForTrip(tripId);
    }
    
    return tripItems;
  },

  seedDefaultItemsForTrip(tripId: string): ChecklistItem[] {
    const all = this.getAllItems();
    
    // Make sure we are not duplicating if they were deleted intentionally
    // In our prototype, if there's absolutely 0 items, we seed them.
    const newItems: ChecklistItem[] = DEFAULT_ITEMS.map((item, idx) => ({
      id: `chk-seed-${tripId}-${idx}-${Date.now()}`,
      tripId,
      name: item.name,
      category: item.category as ChecklistCategory,
      completed: false
    }));

    const updatedAll = [...all, ...newItems];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
    return newItems;
  },

  createItem(item: Omit<ChecklistItem, 'id' | 'completed'>): ChecklistItem {
    const all = this.getAllItems();
    const newItem: ChecklistItem = {
      ...item,
      id: `chk-${Date.now()}`,
      completed: false
    };
    all.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newItem;
  },

  updateItem(updated: ChecklistItem): ChecklistItem {
    const all = this.getAllItems();
    const index = all.findIndex(item => item.id === updated.id);
    if (index === -1) {
      throw new Error(`Checklist item not found: ${updated.id}`);
    }
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  toggleItemCompleted(id: string): ChecklistItem {
    const all = this.getAllItems();
    const index = all.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Checklist item not found: ${id}`);
    }
    all[index].completed = !all[index].completed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return all[index];
  },

  deleteItem(id: string): void {
    const all = this.getAllItems();
    const filtered = all.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  deleteByTripId(tripId: string): void {
    const all = this.getAllItems();
    const filtered = all.filter(item => item.tripId !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getPackingProgress(tripId: string): { packed: number; total: number; percentage: number } {
    const items = this.getItemsByTripId(tripId);
    const total = items.length;
    const packed = items.filter(item => item.completed).length;
    const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
    return { packed, total, percentage };
  }
};
