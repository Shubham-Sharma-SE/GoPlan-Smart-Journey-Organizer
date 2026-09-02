# GoPlan — Smart Journey Organizer-

> Plan Smarter, Travel Better!

GoPlan is a complete, feature-rich travel-planning web application designed for students and travel groups. This project serves as a demonstration of **Core Java and Object-Oriented Programming (OOP)**, featuring a clean separation of concerns between a React + TypeScript frontend and a Core Java OOP backend prototype.

---

## 1. TECHNOLOGY STACK-

* **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React
* **Backend (OOP Prototype)**: Core Java (JDK 8+), Java Date/Time Temporal API, custom Exception Handling, File Serialization DB
* **Communication Interface**: REST API specifications (REST-ready service layer mapping to Java repositories)

---

## 2. KEY FEATURES-

* 📁 **Authentication**: Mock login and registration forms with validation checks, password visibility toggles, and persistent login states.
* 📊 **Dashboard**: Summary stats (Total Trips, Spent vs Budget, Packed items) with interactive warning flags and custom SVG graphs.
* 🗺️ **Trip & Destination Management**: Create, edit, and delete journeys. Add multiple destination stops and reorder stops to create a vertical timeline (e.g. Pune ➔ Mumbai ➔ Goa).
* 📅 **Itinerary Planner**: Log scheduled events (activities, times, costs) in chronological day-wise timelines.
* 💰 **Budget & Cost Estimator**: Set budget limits with warning level alerts. Use the Smart Estimator to forecast lodging/food costs using multiplication formulas.
* 💳 **Expense Tracker**: Log transactions under categories (accommodation, food, transit), which dynamically sync with and update the active trip budget.
* 🧳 **Packing Checklist**: Automatically populates standard documents, electronics, and clothing items for newly created trips. Supports toggling packed progress.
* 📝 **Notes & Travel Tips**: Card-based notepad for critical reminders, tips, and emergency contacts.
* 🖨️ **Trip Summary & Print**: A consolidated view of all plans, budgets, and checklists, optimized with CSS media queries for printing clean physical summaries.

---

## 3. FOLDER STRUCTURE-

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
│   │   ├── repository/       # Generic Repository<T> interface and class implementations
│   │   ├── service/          # TripService, ExpenseService, FileService (Serialization)
│   │   └── Main.java         # Compilation test and run execution driver
│   ├── README.md             # Compilation instructions
│   └── trips.dat / expenses.dat  # Generated serialization databases
├── docs/
│   └── README.md             # Architecture workflows
├── .gitignore
└── README.md                 # Root read file (This file)
```

---

## 4. GETTING STARTED-

### Running the Frontend (React + Vite)
Ensure you have [Node.js](https://nodejs.org) installed.

1. Open a terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite local development server:
   ```bash
   npm run dev
   ```
4. Click the link in your console (usually `http://localhost:5173`) to view the application in your browser.

---

### Running the Backend (Core Java OOP)-
Requires [Java JDK](https://www.oracle.com/java/technologies/downloads/) (JDK 8 or above).

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Compile all source code packages:
   ```bash
   javac -d bin src/model/*.java src/exception/*.java src/repository/*.java src/service/*.java src/Main.java
   ```
3. Run the compiled driver:
   ```bash
   java -cp bin Main
   ```
4. Verify console readouts showing serialization data writes, custom date temporal calculations, and caught invalid budget violations.

---

## 5. FUTURE ENHANCEMENTS-

1. **REST Integration**: Replace the frontend client `localStorage` service layer inside `frontend/src/services` with actual `fetch` HTTP REST API requests pointing to endpoints.
2. **Spring Boot MVC**: Expose the backend `Service` and `Repository` modules as JSON REST endpoints via Spring Boot controllers (e.g. `@RestController`).
3. **Database Integration**: Connect repositories to a MySQL / PostgreSQL database using JDBC or Spring Data JPA.
