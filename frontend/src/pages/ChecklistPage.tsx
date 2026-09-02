import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { checklistService } from '../services/checklistService';
import { ChecklistItem, ChecklistCategory } from '../types';
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  SlidersHorizontal,
  Compass,
  FileText,
  Laptop,
  Shirt,
  HeartHandshake,
  Tag,
  X
} from 'lucide-react';

export const ChecklistPage: React.FC = () => {
  const { activeTrip, trips, setActiveTripId, showToast } = useAppContext();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Input state for inline adding
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistCategory>('custom');

  // Edit item state
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ChecklistCategory>('custom');

  // Load items from service
  const items = useMemo(() => {
    if (!activeTrip) return [];
    return checklistService.getItemsByTripId(activeTrip.id);
  }, [activeTrip, newItemName, editingItem]);

  // Packing progress calculation
  const progress = useMemo(() => {
    if (!activeTrip) return { packed: 0, total: 0, percentage: 0 };
    return checklistService.getPackingProgress(activeTrip.id);
  }, [activeTrip, items]);

  // Filter items based on checkbox state
  const filteredItems = useMemo(() => {
    switch (statusFilter) {
      case 'completed': return items.filter(item => item.completed);
      case 'pending': return items.filter(item => !item.completed);
      default: return items;
    }
  }, [items, statusFilter]);

  // Group items by category for UI layout
  const groupedItems = useMemo(() => {
    const groups: Record<ChecklistCategory, ChecklistItem[]> = {
      documents: [],
      electronics: [],
      clothing: [],
      personal: [],
      custom: []
    };

    filteredItems.forEach(item => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      } else {
        groups.custom.push(item);
      }
    });

    return groups;
  }, [filteredItems]);

  // Toggle packed status
  const handleToggle = (id: string) => {
    try {
      checklistService.toggleItemCompleted(id);
      // Hack state change to re-trigger memo
      setNewItemName(prev => prev); // safe triggering
    } catch (err: any) {
      showToast(err.message || 'Error updating item.', 'error');
    }
  };

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    if (!newItemName.trim()) {
      showToast('Please enter an item name.', 'error');
      return;
    }

    try {
      checklistService.createItem({
        tripId: activeTrip.id,
        name: newItemName.trim(),
        category: newItemCategory
      });
      setNewItemName('');
      showToast('Item added to checklist!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error creating item.', 'error');
    }
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    checklistService.deleteItem(id);
    setNewItemName(prev => prev); // safe triggering
    showToast('Checklist item removed.', 'info');
  };

  // Open Edit
  const handleStartEdit = (item: ChecklistItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editName.trim()) {
      showToast('Item name cannot be empty.', 'error');
      return;
    }

    try {
      checklistService.updateItem({
        ...editingItem,
        name: editName.trim(),
        category: editCategory
      });
      setEditingItem(null);
      showToast('Item updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error updating item.', 'error');
    }
  };

  const getCategoryIcon = (category: ChecklistCategory) => {
    switch (category) {
      case 'documents': return <FileText className="w-4 h-4 text-sky-500" />;
      case 'electronics': return <Laptop className="w-4 h-4 text-indigo-500" />;
      case 'clothing': return <Shirt className="w-4 h-4 text-amber-500" />;
      case 'personal': return <HeartHandshake className="w-4 h-4 text-emerald-500" />;
      default: return <Tag className="w-4 h-4 text-purple-500" />;
    }
  };

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-800">No active trip selected</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Select or create a trip to start managing your packing checklist.
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
      {/* Metrics Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Packing Checklist</span>
            <h2 className="text-xl font-bold text-slate-800">{activeTrip.name} Gear List</h2>
          </div>
          
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 font-bold text-xs text-slate-600">
            <span>{progress.packed} / {progress.total} Packed</span>
            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <span className="text-sky-600">{progress.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Quick Add layout */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Side: Add Item panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
            Add Packing Item
          </h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Swimming Goggles, Medicines"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category *</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as ChecklistCategory)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer bg-white"
              >
                <option value="documents">Documents</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="personal">Personal / Hygiene</option>
                <option value="custom">Custom / Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 shadow-md shadow-sky-600/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </form>
        </div>

        {/* Right Side: Categorised Checklists */}
        <div className="md:col-span-2 space-y-6">
          {/* Status filters */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 pl-1" />
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wide">Filters:</span>
            
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'all' 
                  ? 'bg-sky-500 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'completed' 
                  ? 'bg-sky-500 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Packed
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === 'pending' 
                  ? 'bg-sky-500 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Remaining
            </button>
          </div>

          {/* Checklist Categories panels */}
          <div className="space-y-4">
            {Object.entries(groupedItems).map(([cat, categoryItems]) => {
              if (categoryItems.length === 0) return null; // Hide empty sections
              
              return (
                <div key={cat} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-left">
                  <h3 className="text-sm font-bold text-slate-800 capitalize flex items-center gap-2 pb-3.5 border-b border-slate-100 mb-3.5">
                    {getCategoryIcon(cat as ChecklistCategory)}
                    {cat === 'personal' ? 'Personal / Hygiene' : cat}
                  </h3>

                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-2.5 hover:bg-slate-50/60 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggle(item.id)}
                            className="text-slate-400 hover:text-sky-600 transition-colors"
                          >
                            {item.completed ? (
                              <CheckSquare className="w-5 h-5 text-sky-500" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                          
                          <span className={`text-sm font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 hover:opacity-100">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1 hover:bg-sky-50 text-slate-500 hover:text-sky-600 rounded-lg transition-all"
                            title="Rename"
                          >
                            <Plus className="w-3.5 h-3.5 rotate-45" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-all"
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

            {filteredItems.length === 0 && (
              <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
                No items match the checklist status filter.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- EDIT CHECKLIST ITEM MODAL --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Edit Checklist Item</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as ChecklistCategory)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer bg-white"
                >
                  <option value="documents">Documents</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="personal">Personal / Hygiene</option>
                  <option value="custom">Custom / Other</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
