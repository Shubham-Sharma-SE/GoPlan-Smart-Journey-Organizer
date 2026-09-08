import { Expense, ExpenseCategory } from '../types';
import { sampleExpenses } from '../data/demoData';

const STORAGE_KEY = 'goplan_expenses';

export const expenseService = {
  getAllExpenses(): Expense[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleExpenses));
      return sampleExpenses;
    }
    return JSON.parse(data);
  },

  getExpensesByTripId(tripId: string): Expense[] {
    return this.getAllExpenses().filter(e => e.tripId === tripId);
  },

  createExpense(expense: Omit<Expense, 'id'>): Expense {
    const all = this.getAllExpenses();
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    all.push(newExpense);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newExpense;
  },

  updateExpense(updated: Expense): Expense {
    const all = this.getAllExpenses();
    const index = all.findIndex(e => e.id === updated.id);
    if (index === -1) {
      throw new Error(`Expense not found: ${updated.id}`);
    }
    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return updated;
  },

  deleteExpense(id: string): void {
    const all = this.getAllExpenses();
    const filtered = all.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  deleteByTripId(tripId: string): void {
    const all = this.getAllExpenses();
    const filtered = all.filter(e => e.tripId !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Calculate statistics for a trip
  getExpenseStats(tripId: string): {
    total: number;
    highest: number;
    average: number;
    categoryTotals: Record<ExpenseCategory, number>;
  } {
    const expenses = this.getExpensesByTripId(tripId);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const highest = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;
    const average = expenses.length > 0 ? parseFloat((total / expenses.length).toFixed(2)) : 0;

    const categoryTotals: Record<ExpenseCategory, number> = {
      transport: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
      shopping: 0,
      other: 0
    };

    expenses.forEach(e => {
      if (categoryTotals[e.category] !== undefined) {
        categoryTotals[e.category] += e.amount;
      } else {
        categoryTotals.other += e.amount;
      }
    });

    return { total, highest, average, categoryTotals };
  },

  // Search, Filter and Sort
  searchAndFilter(
    tripId: string,
    query: string,
    categoryFilter?: string,
    sortBy?: string
  ): Expense[] {
    let expenses = this.getExpensesByTripId(tripId);

    // Search matching title or description
    if (query) {
      const q = query.toLowerCase();
      expenses = expenses.filter(
        e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== 'all') {
      expenses = expenses.filter(e => e.category === categoryFilter);
    }

    // Sort
    if (sortBy) {
      if (sortBy === 'date-desc') {
        expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (sortBy === 'date-asc') {
        expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else if (sortBy === 'amount-desc') {
        expenses.sort((a, b) => b.amount - a.amount);
      } else if (sortBy === 'amount-asc') {
        expenses.sort((a, b) => a.amount - b.amount);
      } else if (sortBy === 'title') {
        expenses.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return expenses;
  }
};
