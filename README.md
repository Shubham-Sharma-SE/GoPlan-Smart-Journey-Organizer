# GoPlan — Smart Journey Organizer

> Plan Smarter, Travel Better!

GoPlan is a travel-planning project with a React + TypeScript frontend and a Core Java OOP backend prototype.

## Folder Structure

```text
GoPlan/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (Logo, ToastContainer)
│   │   ├── pages/            # Landing page, Login, Signup, Dashboard, Trips, Budget, etc.
│   │   ├── layouts/          # DashboardLayout
│   │   ├── services/         # Client services wrapper (local storage mock repo)
│   │   ├── hooks/            # useAppContext state manager
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Helper files (dateUtils)
│   │   ├── data/             # Initial sample/mock database
│   │   ├── App.tsx           # Router and views layout coordinator
│   │   └── main.tsx          # App mounting entry point
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── model/            # User, Trip, Destination, TravelItem (abstract), Expense, ChecklistItem, TravelNote
│   │   ├── exception/        # InvalidTripDatesException, BudgetExceededException
│   │   ├── repository/       # Generic Repository interface and class implementations
│   │   ├── service/          # TripService, ExpenseService, FileService (Serialization)
│   │   └── Main.java         # Compilation test and run execution driver
│   ├── README.md             # Compilation instructions
│   └── trips.dat / expenses.dat  # Generated serialization databases
├── docs/
│   └── README.md             # Architecture workflows
├── .gitignore
└── README.md                 # Root read file (This file)
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
javac -d bin src/model/*.java src/exception/*.java src/repository/*.java src/service/*.java src/Main.java
java -cp bin Main
```
