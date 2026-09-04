# GoPlan — Core Java OOP Backend

This directory contains the Java backend prototype designed to mirror the React frontend service-oriented architecture. It is built as a console-ready Java application illustrating **Object-Oriented Programming (OOP)** principles.

---

## 1. OOP CONCEPTS IMPLEMENTED

### Encapsulation
* All model classes (e.g., [User.java](src/model/User.java), [Trip.java](src/model/Trip.java)) use `private` instance variables with public getter and setter methods.
* Logic/rules validation is embedded in setters/constructors. For example, `Trip.validateDates()` throws an exception if the end date precedes the start date, preventing objects from entering an invalid state.

### Abstraction
* [TravelItem.java](src/model/TravelItem.java) is defined as an `abstract` base class that contains a declaration of the abstract method `public abstract double getCost()`.
* The generic Repository interface [Repository.java](src/repository/Repository.java) abstracts database transactions away from services.

### Inheritance
* Concrete entities that are associated with travel costs—such as [Expense.java](src/model/Expense.java), [Destination.java](src/model/Destination.java), and [ItineraryItem.java](src/model/ItineraryItem.java)—inherit from `TravelItem`.

### Polymorphism
* **Overriding**: Subclasses override `getCost()` to calculate their respective cost parameters (Expenses return actual amount, while Destinations and Itineraries return estimates).
* **Generics**: Generic types `Repository<T>` allow polymorphic behavior for repositories handling different models.
* **Driver Demonstration**: `Main.java` adds different subclass objects (`Destination` and `Expense`) to a single polymorphic `List<TravelItem>`, and calculates the sum by calling the abstract `.getCost()` method on each node.

### Collections & Date API
* Java `ArrayList` is used to accumulate dynamically size-varying records.
* Java Date/Time API (`java.time.LocalDate` and `java.time.temporal.ChronoUnit`) is used to automatically determine trip status (upcoming, ongoing, completed) and calculate trip durations.

### Exception Handling
* Contains custom exceptions: `InvalidTripDatesException` and `BudgetExceededException`.
* Throwing and catching operations are tested inside `Main.java`.

### File Handling & Serialization
* [FileService.java](src/service/FileService.java) implements Java Binary Serialization using `ObjectOutputStream` and `ObjectInputStream` to write lists to `.dat` database files.

---

## 2. COMPILING AND RUNNING THE DRIVER

To compile and run the backend driver locally:

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Compile all java source files into byte code:
   ```bash
   javac -d bin src/model/*.java src/exception/*.java src/repository/*.java src/service/*.java src/Main.java
   ```

3. Execute the compiled `Main` class:
   ```bash
   java -cp bin Main
   ```

You should see output demonstrating user setups, dynamic date durations, polymorphic expense tallies, caught invalid date/budget exceptions, and binary database file saving and loading!
