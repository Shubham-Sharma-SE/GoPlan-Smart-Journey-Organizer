import React, { useState, useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { expenseService } from '../services/expenseService';
import { Expense, ExpenseCategory } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  X,
  Compass,
  ArrowUpDown,
  Calendar,
  DollarSign
} from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const { activeTrip, trips, setActiveTripId, showToast, refreshTrips } = useAppContext();

  // Search, Filter, Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState(0);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('food');
  const [expDate, setExpDate] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Fetch expenses matching query, filter, sort
  const expenses = useMemo(() => {
    if (!activeTrip) return [];
    return expenseService.searchAndFilter(activeTrip.id, searchQuery, categoryFilter, sortBy);
  }, [activeTrip, searchQuery, categoryFilter, sortBy, isModalOpen]);

  // Fetch live statistics
  const stats = useMemo(() => {
    if (!activeTrip) return null;
    return expenseService.getExpenseStats(activeTrip.id);
  }, [activeTrip, expenses]);

  // Open Add modal
  const handleOpenAdd = () => {
    if (!activeTrip) return;
    setEditingExpense(null);
    setExpTitle('');
    setExpAmount(0);
    setExpCategory('food');
    setExpDate(activeTrip.startDate);
    setExpDesc('');
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setExpTitle(exp.title);
    setExpAmount(exp.amount);
    setExpCategory(exp.category);
    setExpDate(exp.date);
    setExpDesc(exp.description);
    setIsModalOpen(true);
  };

  // Save Expense
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    // Field validation
    if (!expTitle.trim() || !expAmount || !expDate) {
      showToast('Title, Amount, and Date are required.', 'error');
      return;
    }

    if (expAmount <= 0) {
      showToast('Expense amount must be greater than zero.', 'error');
      return;
    }

    // Date range check
    const tStart = new Date(activeTrip.startDate);
    const tEnd = new Date(activeTrip.endDate);
    const exDate = new Date(expDate);

    tStart.setHours(0,0,0,0);
    tEnd.setHours(0,0,0,0);
    exDate.setHours(0,0,0,0);

    if (exDate < tStart || exDate > tEnd) {
      showToast(`Expense date must fall within trip: ${activeTrip.startDate} to ${activeTrip.endDate}`, 'error');
      return;
    }

    const expenseData = {
      tripId: activeTrip.id,
      title: expTitle,
      amount: expAmount,
      category: expCategory,
      date: expDate,
      description: expDesc
    };

    try {
      if (editingExpense) {
        expenseService.updateExpense({ ...editingExpense, ...expenseData });
        showToast('Expense updated successfully!', 'success');
      } else {
        expenseService.createExpense(expenseData);
        showToast('Expense logged successfully!', 'success');
      }
      setIsModalOpen(false);
      refreshTrips(); // Refresh to update dashboard/budget pages
    } catch (err: any) {
      showToast(err.message || 'Error logging expense.', 'error');
    }
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Delete this expense? This will update your budget immediately.')) {
      expenseService.deleteExpense(id);
      showToast('Expense deleted.', 'info');
      refreshTrips();
      setIsModalOpen(false); // harmless refresh trigger
    }
  };

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-black text-slate-800">No active trip selected</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Select or create a trip to start tracking expenses.
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

  const categoryBarColor = (category: string) => {
    switch (category) {
      case 'transport': return 'bg-sky-500';
      case 'accommodation': return 'bg-indigo-500';
      case 'food': return 'bg-amber-500';
      case 'activities': return 'bg-emerald-500';
      case 'shopping': return 'bg-purple-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      {/* Top Banner and Quick Stats */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Expense Tracker</span>
            <h2 className="text-xl font-bold text-slate-800">{activeTrip.name} Accounts</h2>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/10 cursor-pointer animate-pulse"
          >
            <Plus className="w-4 h-4" /> Log Expense
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Outflow</span>
                <span className="text-xl font-black text-rose-600 block mt-1">₹{stats.total.toLocaleString('en-IN')}</span>
              </div>
              <TrendingUp className="w-8 h-8 text-rose-100" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Single Peak Outflow</span>
                <span className="text-xl font-black text-slate-800 block mt-1">₹{stats.highest.toLocaleString('en-IN')}</span>
              </div>
              <DollarSign className="w-8 h-8 text-sky-100" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mean Spending / Expense</span>
                <span className="text-xl font-black text-slate-800 block mt-1">₹{stats.average.toLocaleString('en-IN')}</span>
              </div>
              <SlidersHorizontal className="w-8 h-8 text-slate-100" />
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute inset-y-0 left-3.5 my-auto w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
              <option value="food">Food</option>
              <option value="activities">Activities</option>
              <option value="shopping">Shopping</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (Highest First)</option>
              <option value="amount-asc">Amount (Lowest First)</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Log Table / Cards */}
      {expenses.length > 0 ? (
        <div className="space-y-3">
          {expenses.map((exp) => (
            <div 
              key={exp.id} 
              className="bg-white border border-slate-200/80 hover:border-slate-300 p-4.5 rounded-2xl shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-start gap-3.5 text-left">
                {/* Category Indicator dot */}
                <span className={`w-3.5 h-3.5 rounded-full mt-1.5 flex-shrink-0 ${categoryBarColor(exp.category)}`} title={exp.category}></span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-800 text-sm md:text-base">{exp.title}</span>
                    <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-50/50">
                      {exp.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {dateUtils.formatDate(exp.date)}
                    </span>
                    {exp.description && (
                      <span className="text-slate-400 font-normal line-clamp-1 italic max-w-sm">
                        💬 {exp.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & CRUD */}
              <div className="flex items-center gap-4 self-end sm:self-auto flex-shrink-0">
                <span className="font-black text-rose-600 text-base md:text-lg">
                  -₹{exp.amount.toLocaleString('en-IN')}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-100 text-slate-500 hover:text-sky-600 rounded-lg shadow-xs transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 text-slate-500 hover:text-rose-600 rounded-lg shadow-xs transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center p-6 shadow-sm">
          <DollarSign className="w-12 h-12 text-slate-200 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No expenses recorded</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
            Keep your budget up to date by logging taxi fare, dinners, stays, or entrance tickets.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            Log First Expense
          </button>
        </div>
      )}

      {/* --- EXPENSE CRUD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 md:p-8 animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-black text-slate-800">
                {editingExpense ? 'Edit Expense Record' : 'Log Travel Expense'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood Dinner, Fuel refill"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(parseFloat(e.target.value))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Category *</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer bg-white"
                  >
                    <option value="transport">Transport</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="food">Food</option>
                    <option value="activities">Activities</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Date *</label>
                <input
                  type="date"
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Description</label>
                <textarea
                  rows={2}
                  placeholder="Additional details..."
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
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
                  {editingExpense ? 'Save Changes' : 'Log Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
