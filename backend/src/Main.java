import exception.BudgetExceededException;
import exception.InvalidTripDatesException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import model.Destination;
import model.Expense;
import model.TravelItem;
import model.Trip;
import model.User;
import service.ExpenseService;
import service.TripService;

public class Main {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("      GoPlan — Smart Journey Organizer Core Java  ");
        System.out.println("==================================================");

        // 1. Setup services
        TripService tripService = new TripService();
        ExpenseService expenseService = new ExpenseService();

        // Delete any existing files from past runs to make it clean
        new java.io.File("trips.dat").delete();
        new java.io.File("expenses.dat").delete();

        // 2. Create User (Encapsulation)
        User traveler = new User("user-1", "Apurva Patil", "apurva@goplan.com", "securepwd");
        System.out.println("\n[USER SET UP]: " + traveler);

        // 3. Create a valid trip (Dynamic Duration & Date temporal calculations)
        Trip goaTrip = null;
        try {
            goaTrip = new Trip(
                "trip-goa",
                "Goa College Roadtrip",
                "Pune",
                "Goa",
                LocalDate.of(2026, 9, 5),
                LocalDate.of(2026, 9, 10), // 6 days inclusive
                3,
                "car",
                20000.0,
                "Amazing roadtrip with hostel stays",
                traveler.getId()
            );

            tripService.createTrip(goaTrip);
            System.out.println("\n[TRIP SAVED SUCCESS]:");
            System.out.println("  " + goaTrip);
            System.out.println("  Duration calculated: " + goaTrip.getDurationInDays() + " Days");
            System.out.println("  Status: " + goaTrip.getStatus());
        } catch (InvalidTripDatesException e) {
            System.err.println("Fatal: Couldn't create trip: " + e.getMessage());
        }

        // 4. Demonstrate polymorphism: treating Destination and Expense as TravelItem (Inheritance)
        if (goaTrip != null) {
            List<TravelItem> checklistAndStops = new ArrayList<>();

            // Destination stops
            Destination stop1 = new Destination("dest-1", goaTrip.getId(), "Fontainhas Panjim", "Panjim Quarter", 
                LocalDate.of(2026, 9, 5), LocalDate.of(2026, 9, 6), 1500.0, "Historical walk", 0);
            Destination stop2 = new Destination("dest-2", goaTrip.getId(), "Baga Watersports", "North Goa Baga", 
                LocalDate.of(2026, 9, 6), LocalDate.of(2026, 9, 9), 3500.0, "Parasailing adventure", 1);

            // Expenses
            Expense fuel = new Expense("exp-1", goaTrip.getId(), "Fuel & Tolls", 3500.0, "transport", LocalDate.of(2026, 9, 5), "Pune highway tolls");
            Expense food = new Expense("exp-2", goaTrip.getId(), "Dinner Beach Shack", 2500.0, "food", LocalDate.of(2026, 9, 5), "Sea breeze dinner");

            // Adding different sub-classes to a single collection (Polymorphism)
            checklistAndStops.add(stop1);
            checklistAndStops.add(stop2);
            checklistAndStops.add(fuel);
            checklistAndStops.add(food);

            System.out.println("\n[POLYMORPHISM IN ACTION]: Iterating TravelItem subclasses:");
            double totalCalculatedSpend = 0;
            for (TravelItem item : checklistAndStops) {
                // Treats all items polymorphically and calls overridden getCost() method
                double cost = item.getCost();
                totalCalculatedSpend += cost;
                System.out.println("  - Item Type: " + item.getClass().getSimpleName() + " | Name: " + item.getName() + " | Cost: ₹" + cost);
            }
            System.out.println("  Combined polymorphic tally: ₹" + totalCalculatedSpend);
        }

        // 5. Demonstrate Exception Handling #1: Invalid Dates
        System.out.println("\n[EXCEPTION TEST #1]: Attempting invalid dates (End Date before Start Date)...");
        try {
            Trip invalidTrip = new Trip(
                "trip-fail",
                "Failed Trip",
                "Pune",
                "Mumbai",
                LocalDate.of(2026, 12, 10),
                LocalDate.of(2026, 12, 5), // Invalid: 5th is before 10th
                1,
                "train",
                5000.0,
                "Will fail",
                traveler.getId()
            );
            tripService.createTrip(invalidTrip);
        } catch (InvalidTripDatesException e) {
            System.out.println("  ✓ Successfully caught exception: " + e.getMessage());
        }

        // 6. Demonstrate Exception Handling #2: Budget limits exceeded
        System.out.println("\n[EXCEPTION TEST #2]: Logging expenses that breach the ₹20,000 limit...");
        try {
            // First valid expense under limit
            Expense stayExp = new Expense("exp-stay", goaTrip.getId(), "Hotel Villa booking", 12000.0, "accommodation", LocalDate.of(2026, 9, 5), "Fontainhas villa booking");
            expenseService.recordExpense(stayExp);
            System.out.println("  ✓ Logged stay expense of ₹12,000 (Spent total: ₹12,000)");

            // Second expense that goes over limit (12,000 + 9,500 = 21,500 > 20,000)
            Expense shoppingExp = new Expense("exp-shop", goaTrip.getId(), "Premium Souvenirs", 9500.0, "shopping", LocalDate.of(2026, 9, 9), "Goan cashew and spices");
            expenseService.recordExpense(shoppingExp);
        } catch (BudgetExceededException e) {
            System.out.println("  ✓ Successfully caught budget violation: " + e.getMessage());
        }

        // 7. Verify file binary serialization
        System.out.println("\n[SERIALIZATION VERIFICATION]: Reading saved records back from trips.dat...");
        TripService testTripService = new TripService();
        List<Trip> reloadedTrips = testTripService.getTripsByUserId(traveler.getId());
        for (Trip t : reloadedTrips) {
            System.out.println("  Reloaded Trip -> " + t.getName() + " (" + t.getDestination() + ") Status: " + t.getStatus());
        }

        System.out.println("\n==================================================");
        System.out.println("         Demonstration complete. Clean exit.       ");
        System.out.println("==================================================");
    }
}
