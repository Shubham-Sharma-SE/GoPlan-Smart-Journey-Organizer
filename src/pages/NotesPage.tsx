import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { noteService } from '../services/noteService';
import { TravelNote, NoteCategory } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  X,
  Compass,
  FileText,
  AlertTriangle,
  Lightbulb,
  Compass as InfoIcon,
  BookOpen
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { activeTrip, trips, setActiveTripId, showToast } = useAppContext();

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<TravelNote | null>(null);

  // Form states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('tip');
  const [noteDesc, setNoteDesc] = useState('');

  // Fetch filtered notes
  const notes = useMemo(() => {
    if (!activeTrip) return [];
    return noteService.searchAndFilter(activeTrip.id, searchQuery, categoryFilter);
  }, [activeTrip, searchQuery, categoryFilter, isModalOpen]);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingNote(null);
    setNoteTitle('');
    setNoteCategory('tip');
    setNoteDesc('');
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (note: TravelNote) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteCategory(note.category);
    setNoteDesc(note.description);
    setIsModalOpen(true);
  };

  // Submit note save
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    // Field validation
    if (!noteTitle.trim() || !noteDesc.trim()) {
      showToast('Title and Description are required.', 'error');
      return;
    }

    const noteData = {
      tripId: activeTrip.id,
      title: noteTitle.trim(),
      category: noteCategory,
      description: noteDesc.trim()
    };

    try {
      if (editingNote) {
        noteService.updateNote({ ...editingNote, ...noteData });
        showToast('Note updated successfully!', 'success');
      } else {
        noteService.createNote(noteData);
        showToast('Note added successfully!', 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving note.', 'error');
    }
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    if (window.confirm('Delete this travel note?')) {
      noteService.deleteNote(id);
      showToast('Note removed.', 'info');
      setIsModalOpen(false); // harmless state trigger
    }
  };

  const getCategoryTheme = (category: NoteCategory) => {
    switch (category) {
      case 'important':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
          bgColor: 'bg-orange-50 border-orange-200/60',
          textColor: 'text-orange-900',
          badge: 'bg-orange-100 text-orange-800'
        };
      case 'tip':
        return {
          icon: <Lightbulb className="w-4 h-4 text-amber-600" />,
          bgColor: 'bg-amber-50 border-amber-200/60',
          textColor: 'text-amber-900',
          badge: 'bg-amber-100 text-amber-800'
        };
      case 'info':
        return {
          icon: <InfoIcon className="w-4 h-4 text-sky-600" />,
          bgColor: 'bg-sky-50 border-sky-200/60',
          textColor: 'text-sky-900',
          badge: 'bg-sky-100 text-sky-800'
        };
      default:
        return {
          icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
          bgColor: 'bg-emerald-50 border-emerald-200/60',
          textColor: 'text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800'
        };
    }
  };

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-800">No active trip selected</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Select or create a trip to start adding notes and travel tips.
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
    <div className="space-y-6 text-left relative">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Notes & Tips</span>
          <h2 className="text-xl font-bold text-slate-800">{activeTrip.name} Travel Journal</h2>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Note
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 pl-1" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="all">All Notes</option>
            <option value="tip">Travel Tips</option>
            <option value="important">Important Reminders</option>
            <option value="info">Place Information</option>
            <option value="personal">Personal Notes</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {notes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => {
            const theme = getCategoryTheme(note.category);
            return (
              <div 
                key={note.id}
                className={`border rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-lg ${theme.bgColor}`}
              >
                <div>
                  {/* Category Badge & Date */}
                  <div className="flex justify-between items-center pb-3.5 border-b border-slate-200/50">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${theme.badge}`}>
                      {theme.icon}
                      {note.category === 'info' ? 'Place Info' : note.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {dateUtils.formatDate(note.date)}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <div className="mt-4 space-y-2">
                    <h3 className="font-extrabold text-slate-800 text-sm md:text-base leading-snug">{note.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                      {note.description}
                    </p>
                  </div>
                </div>

                {/* Edit & Delete Controls */}
                <div className="mt-5 pt-3.5 border-t border-slate-200/50 flex justify-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(note)}
                    className="p-1.5 bg-white/80 hover:bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-sky-600 shadow-xs"
                    title="Edit Note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 bg-white/80 hover:bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-rose-600 shadow-xs"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center p-6 shadow-sm">
          <FileText className="w-12 h-12 text-slate-200 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No notes written</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
            Record sightseeing tips, emergency contacts, recommended local restaurants, or packing reminders.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            Create First Note
          </button>
        </div>
      )}

      {/* --- TRAVEL NOTE CRUD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800">
                {editingNote ? 'Edit Travel Note' : 'Write Travel Note'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scooter Rental Tip, Local Food Stall"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Category *</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as NoteCategory)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer bg-white"
                >
                  <option value="tip">Travel Tip</option>
                  <option value="important">Important Reminder</option>
                  <option value="info">Place Information</option>
                  <option value="personal">Personal Note</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Description / Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Scooter rent is Rs 350/day. Physical DL required. Don't leave license at shop, give xerox copy."
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-medium"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-600/10"
                >
                  {editingNote ? 'Save Note' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
