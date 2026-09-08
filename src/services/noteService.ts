import { TravelNote } from '../types';
import { sampleNotes } from '../data/demoData';

const STORAGE_KEY = 'goplan_notes';

export const noteService = {
  getAllNotes(): TravelNote[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleNotes));
      return sampleNotes;
    }
    return JSON.parse(data);
  },

  getNotesByTripId(tripId: string): TravelNote[] {
    return this.getAllNotes().filter(note => note.tripId === tripId);
  },

  createNote(note: Omit<TravelNote, 'id' | 'date'>): TravelNote {
    const all = this.getAllNotes();
    const newNote: TravelNote = {
      ...note,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0] // today YYYY-MM-DD
    };
    all.push(newNote);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newNote;
  },

  updateNote(updated: TravelNote): TravelNote {
    const all = this.getAllNotes();
    const index = all.findIndex(n => n.id === updated.id);
    if (index === -1) {
      throw new Error(`Note not found: ${updated.id}`);
    }
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  deleteNote(id: string): void {
    const all = this.getAllNotes();
    const filtered = all.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  deleteByTripId(tripId: string): void {
    const all = this.getAllNotes();
    const filtered = all.filter(n => n.tripId !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  searchAndFilter(tripId: string, query: string, categoryFilter?: string): TravelNote[] {
    let notes = this.getNotesByTripId(tripId);

    // Search query matching title or description
    if (query) {
      const q = query.toLowerCase();
      notes = notes.filter(
        n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== 'all') {
      notes = notes.filter(n => n.category === categoryFilter);
    }

    // Sort by date descending (newest notes first)
    notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return notes;
  }
};
