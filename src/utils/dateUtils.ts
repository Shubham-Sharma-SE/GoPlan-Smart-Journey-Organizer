import { TripStatus } from '../types';

export const dateUtils = {
  // Calculates trip duration in days (inclusive)
  calculateDuration(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Clear hours to avoid daylight savings discrepancies
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  },

  // Automatically determine if trip is upcoming, ongoing, or completed
  determineStatus(startDate: string, endDate: string): TripStatus {
    if (!startDate || !endDate) return 'upcoming';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (today < start) {
      return 'upcoming';
    } else if (today > end) {
      return 'completed';
    } else {
      return 'ongoing';
    }
  },

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
};
