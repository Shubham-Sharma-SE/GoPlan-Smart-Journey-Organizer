# GoPlan System Documentation

## Architecture Summary
GoPlan is split into a modular **React + Vite + TypeScript Frontend** and a **Core Java OOP Backend**. 

### Communication Flow
```text
[React Client] --(REST API / JSON)-- [Spring Boot / JAX-RS (Future)] -- [Java Service] -- [Repository File DB]
```

Currently:
1. The React frontend interacts with a client-side **Service Layer** ([tripService.ts](file:///c:/Users/HP%20ZBOOK/OneDrive/Documents/Antigravity_workspace/frontend/src/services/tripService.ts), etc.).
2. This client service stores data in `localStorage`.
3. In a future production environment, the frontend services will invoke standard REST endpoint HTTP requests (using `fetch` or `axios`) pointing to a Java Web Framework backend mapping directly to the classes in `backend/src`.

## Component Modules
* **Dashboard**: Analytical grids with expense progress bars and custom SVG category breakdown rings.
* **Trip & Destinations**: Journey creation with dynamic chronological timelines and reordering indexes.
* **Itinerary Planner**: Time-sorted calendar timelines representing travel activity stops.
* **Budget & Cost Estimator**: Tally comparison formulas and alert warnings.
* **Expense Tracker**: Category outflows with dynamic syncing update handlers.
* **Packing Checklist**: Auto-generated document, electronic, and apparel checks.
* **Notes Journal**: Emergency instructions and tip boxes.
