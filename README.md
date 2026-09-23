# ✈️ GoPlan — Smart Journey Organizer

> **Plan Smarter, Travel Better!**

GoPlan is a smart travel-planning application designed to help users organize trips, manage expenses, maintain checklists, and keep important travel information in one place.

The project combines a **React + TypeScript frontend** with a **Core Java OOP backend prototype**.

## ✨ Features

* 🗺️ Create and manage trips
* 📅 Manage trip dates and destinations
* 💰 Track travel expenses and budgets
* ✅ Maintain travel checklists
* 📝 Store travel notes
* 👤 User management
* 🔔 User-friendly notifications
* 💾 Local data storage and Java serialization
* 🧩 Object-Oriented backend architecture

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Java
* Object-Oriented Programming
* Generic Repository Pattern
* Exception Handling
* File Serialization

## 🏗️ Project Structure

```text
GoPlan/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── data/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── model/
│   │   ├── exception/
│   │   ├── repository/
│   │   ├── service/
│   │   └── Main.java
│   └── README.md
│
├── docs/
│   └── README.md
│
├── .gitignore
├── LICENSE.md
└── README.md
```

## 🧠 OOP Concepts Used

The backend demonstrates important Core Java and OOP concepts including:

* Encapsulation
* Inheritance
* Abstraction
* Polymorphism
* Abstract classes
* Interfaces
* Generics
* Exception handling
* File handling
* Object serialization
* Repository pattern

## 🚀 Running the Project

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

## 📚 Documentation

Additional architecture and workflow information is available in the `docs` folder.

## 🔮 Future Improvements

* Connect frontend and backend through REST APIs
* Add persistent database support
* Add authentication
* Add map and location services
* Add travel recommendations
* Deploy the application online
* Add automated testing

## 👨‍💻 Author

**Shubham Sharma**

Computer Engineering — Software Engineering

---

⭐ If you find this project useful, consider giving the repository a star.
