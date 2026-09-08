import { Trip, Destination, ItineraryItem, Expense, ChecklistItem, TravelNote } from '../types';

// Let's assume current date is 2026-08-31 (from metadata)
// Let's create an upcoming Goa Trip and a completed Mumbai Trip
export const sampleTrips: Trip[] = [
  {
    id: 'trip-1',
    name: 'Goa Adventure',
    startingLocation: 'Pune',
    destination: 'Goa',
    startDate: '2026-09-05',
    endDate: '2026-09-10',
    travelers: 3,
    travelMode: 'car',
    estimatedBudget: 20000,
    description: 'A fun road trip to Goa with college friends. Beach, food, and sightseeing!',
    status: 'upcoming',
    userId: 'user-1'
  },
  {
    id: 'trip-2',
    name: 'Mumbai Heritage Walk',
    startingLocation: 'Pune',
    destination: 'Mumbai',
    startDate: '2026-08-15',
    endDate: '2026-08-17',
    travelers: 2,
    travelMode: 'train',
    estimatedBudget: 8000,
    description: 'Exploring South Mumbai architecture, museums, and street food.',
    status: 'completed',
    userId: 'user-1'
  }
];

export const sampleDestinations: Destination[] = [
  {
    id: 'dest-1',
    tripId: 'trip-1',
    name: 'Panjim (Heritage)',
    location: 'Panjim, Goa',
    arrivalDate: '2026-09-05',
    departureDate: '2026-09-06',
    estimatedCost: 1500,
    notes: 'Stay at Fontainhas Latin Quarter.',
    order: 0
  },
  {
    id: 'dest-2',
    tripId: 'trip-1',
    name: 'Baga Beach (Adventure)',
    location: 'Baga, North Goa',
    arrivalDate: '2026-09-06',
    departureDate: '2026-09-08',
    estimatedCost: 3500,
    notes: 'Watersports, beach shacks, and night markets.',
    order: 1
  },
  {
    id: 'dest-3',
    tripId: 'trip-1',
    name: 'Fort Aguada (Sightseeing)',
    location: 'Candolim, Goa',
    arrivalDate: '2026-09-08',
    departureDate: '2026-09-09',
    estimatedCost: 500,
    notes: '17th-century Portuguese lighthouse and fort.',
    order: 2
  },
  {
    id: 'dest-4',
    tripId: 'trip-1',
    name: 'Calangute (Leisure)',
    location: 'Calangute, North Goa',
    arrivalDate: '2026-09-09',
    departureDate: '2026-09-10',
    estimatedCost: 2000,
    notes: 'Souvenir shopping and relaxing sunset view.',
    order: 3
  }
];

export const sampleItineraries: ItineraryItem[] = [
  {
    id: 'itin-1',
    tripId: 'trip-1',
    date: '2026-09-05',
    time: '06:00 AM',
    activity: 'Road Trip Start',
    location: 'Pune Highway',
    description: 'Drive from Pune early morning to avoid traffic. Pack snacks.',
    estimatedCost: 1200
  },
  {
    id: 'itin-2',
    tripId: 'trip-1',
    date: '2026-09-05',
    time: '01:00 PM',
    activity: 'Lunch at Amboli Ghat',
    location: 'Amboli Ghat',
    description: 'Stop for local Maharashtrian lunch with beautiful valley views.',
    estimatedCost: 800
  },
  {
    id: 'itin-3',
    tripId: 'trip-1',
    date: '2026-09-05',
    time: '04:00 PM',
    activity: 'Hotel Check-in & Rest',
    location: 'Fontainhas, Panjim',
    description: 'Check in to a heritage villa, unpack and freshen up.',
    estimatedCost: 0
  },
  {
    id: 'itin-4',
    tripId: 'trip-1',
    date: '2026-09-06',
    time: '09:00 AM',
    activity: 'Fontainhas Walking Tour',
    location: 'Fontainhas',
    description: 'Take photos in the colorful Latin Quarter, check out art shops.',
    estimatedCost: 200
  },
  {
    id: 'itin-5',
    tripId: 'trip-1',
    date: '2026-09-06',
    time: '03:00 PM',
    activity: 'Move to Baga Beach & Watersports',
    location: 'Baga Beach',
    description: 'Parasailing and jet skiing at Baga Beach.',
    estimatedCost: 2500
  },
  {
    id: 'itin-6',
    tripId: 'trip-1',
    date: '2026-09-07',
    time: '08:00 AM',
    activity: 'Breakfast & Dolphin Watch',
    location: 'Sinquerim Beach',
    description: 'Early morning boat tour to spot dolphins.',
    estimatedCost: 1000
  },
  {
    id: 'itin-7',
    tripId: 'trip-1',
    date: '2026-09-08',
    time: '10:00 AM',
    activity: 'Visit Fort Aguada',
    location: 'Candolim',
    description: 'Explore the fort ruins, take photos of the historic lighthouse.',
    estimatedCost: 100
  },
  {
    id: 'itin-8',
    tripId: 'trip-1',
    date: '2026-09-09',
    time: '07:00 PM',
    activity: 'Farewell Beach Dinner',
    location: 'Curlies Shack, Anjuna',
    description: 'Live music, sea breeze, and delicious Goan fish curry.',
    estimatedCost: 2000
  }
];

export const sampleExpenses: Expense[] = [
  {
    id: 'exp-1',
    tripId: 'trip-1',
    title: 'Car Fuel (Pune to Goa)',
    amount: 3500,
    category: 'transport',
    date: '2026-09-05',
    description: 'Shared fuel cost for the trip.'
  },
  {
    id: 'exp-2',
    tripId: 'trip-1',
    title: 'Hotel Advance booking',
    amount: 6000,
    category: 'accommodation',
    date: '2026-09-03',
    description: 'Deposit paid online for North Goa villa.'
  },
  {
    id: 'exp-3',
    tripId: 'trip-1',
    title: 'Dinner at Beach Shack',
    amount: 2500,
    category: 'food',
    date: '2026-09-05',
    description: 'Dinner on day 1 for 3 people.'
  },
  {
    id: 'exp-4',
    tripId: 'trip-1',
    title: 'Scuba Diving & Watersports',
    amount: 4500,
    category: 'activities',
    date: '2026-09-06',
    description: 'Combo water sports package at Baga.'
  },
  {
    id: 'exp-5',
    tripId: 'trip-1',
    title: 'Souvenir T-shirts',
    amount: 1500,
    category: 'shopping',
    date: '2026-09-09',
    description: 'Bought Goan printed shirts.'
  }
];

export const sampleChecklist: ChecklistItem[] = [
  // Documents
  { id: 'chk-1', tripId: 'trip-1', name: 'Aadhaar Card / ID Proof', category: 'documents', completed: true },
  { id: 'chk-2', tripId: 'trip-1', name: 'Driving License', category: 'documents', completed: true },
  { id: 'chk-3', tripId: 'trip-1', name: 'Hotel Booking Vouchers', category: 'documents', completed: false },
  // Electronics
  { id: 'chk-4', tripId: 'trip-1', name: 'Phone Charger', category: 'electronics', completed: true },
  { id: 'chk-5', tripId: 'trip-1', name: 'Power Bank', category: 'electronics', completed: false },
  { id: 'chk-6', tripId: 'trip-1', name: 'Bluetooth Earphones', category: 'electronics', completed: true },
  // Clothing
  { id: 'chk-7', tripId: 'trip-1', name: 'Swimwear', category: 'clothing', completed: true },
  { id: 'chk-8', tripId: 'trip-1', name: 'Sunglasses & Cap', category: 'clothing', completed: false },
  { id: 'chk-9', tripId: 'trip-1', name: 'Slippers / Sandals', category: 'clothing', completed: true },
  // Personal
  { id: 'chk-10', tripId: 'trip-1', name: 'Sunscreen Lotion', category: 'personal', completed: false },
  { id: 'chk-11', tripId: 'trip-1', name: 'First Aid & Meds', category: 'personal', completed: true },
  { id: 'chk-12', tripId: 'trip-1', name: 'Water Bottle', category: 'personal', completed: false }
];

export const sampleNotes: TravelNote[] = [
  {
    id: 'note-1',
    tripId: 'trip-1',
    title: 'Rent scooter in North Goa',
    description: 'Cheaper way to travel around Baga and Calangute. Normal rate is Rs 350-500 per day. Need to carry physical driving license.',
    category: 'tip',
    date: '2026-08-30'
  },
  {
    id: 'note-2',
    tripId: 'trip-1',
    title: 'Emergency Contact Numbers',
    description: 'Goa Police Helpline: 100 / 112. Fire: 101. Ambulance: 108. Keep hotel phone card in pocket.',
    category: 'important',
    date: '2026-08-30'
  },
  {
    id: 'note-3',
    tripId: 'trip-1',
    title: 'Fontainhas Dress Code',
    description: 'Fontainhas is a residential area. Be respectful, do not climb on private doorsteps for photos.',
    category: 'info',
    date: '2026-08-30'
  }
];
