export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed or plain for mock check
}

export type TravelMode = 'flight' | 'train' | 'bus' | 'car' | 'bike' | 'other';
export type TripStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  name: string;
  startingLocation: string;
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  travelers: number;
  travelMode: TravelMode;
  estimatedBudget: number;
  description: string;
  status: TripStatus;
  userId: string;
}

export interface Destination {
  id: string;
  tripId: string;
  name: string;
  location: string;
  arrivalDate: string;
  departureDate: string;
  estimatedCost: number;
  notes: string;
  order: number;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "08:00 AM" or "14:30"
  activity: string;
  location: string;
  description: string;
  estimatedCost: number;
}

export type ExpenseCategory = 'transport' | 'accommodation' | 'food' | 'activities' | 'shopping' | 'other';

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
}

export type ChecklistCategory = 'documents' | 'electronics' | 'clothing' | 'personal' | 'custom';

export interface ChecklistItem {
  id: string;
  tripId: string;
  name: string;
  category: ChecklistCategory;
  completed: boolean;
}

export type NoteCategory = 'tip' | 'important' | 'info' | 'personal';

export interface TravelNote {
  id: string;
  tripId: string;
  title: string;
  description: string;
  category: NoteCategory;
  date: string;
}

export interface SmartEstimateInput {
  days: number;
  travelers: number;
  transportCost: number;
  hotelCostPerDay: number;
  foodCostPerDay: number;
  activityCost: number;
  miscCost: number;
}

export interface DashboardStats {
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
}
