package bharatyatra.main;

import bharatyatra.model.*;

import java.time.LocalDate;

/**
 * Phase 2 Verification & Demonstration Runner.
 * Tests Model classes, Encapsulation, Abstraction, Inheritance, and Polymorphism.
 */
public class Phase2Test {
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("       BHARAT YATRA - PHASE 2 MODEL TEST        ");
        System.out.println("=================================================");

        // 1. Test Destination model & Method Overloading
        Destination taj = new Destination(1, "Taj Mahal", "Uttar Pradesh", "Agra", 
                "Historical Places", "White marble wonder", 50.00, "3-4 hours", null);
        System.out.println("[Test 1] Destination created: " + taj);
        System.out.println(" - Overloaded Match by keyword 'agra': " + taj.matches("agra"));
        System.out.println(" - Overloaded Match by state & category: " + taj.matches("Uttar Pradesh", "Historical Places"));

        // 2. Test Polymorphic Ticket Discount Rules
        // Sample Destination with Rs 200 base ticket
        Destination testDest = new Destination("Demo Fort", "Rajasthan", "Jaipur", 
                "Historical Places", "Test Fort", 200.00, "2 hours");

        // Visitor 1: Child aged 6 -> Free (Rs 0)
        Ticket childTicket = new ChildTicket(testDest, "Master Rohan");
        // Visitor 2: Woman aged 25 -> 50% discount (Rs 100)
        Ticket womanTicket = new WomanTicket(testDest, "Ms. Ananya");
        // Visitor 3: Senior Citizen aged 65 -> 50% discount (Rs 100)
        Ticket seniorTicket = new SeniorCitizenTicket(testDest, "Mr. Ramesh");
        // Visitor 4: Adult Male aged 30 -> Full price (Rs 200)
        Ticket generalTicket = new GeneralTicket(testDest, "Mr. Suresh");

        Ticket[] tickets = {childTicket, womanTicket, seniorTicket, generalTicket};
        System.out.println("\n[Test 2] Polymorphic Ticket Pricing (Base Price: \u20B9200):");
        double totalTickets = 0.0;
        for (Ticket t : tickets) {
            System.out.printf(" - %-15s | %-32s | Payable: \u20B9%.2f\n", 
                    t.getTravellerName(), t.getDiscountCategory(), t.calculatePrice());
            totalTickets += t.calculatePrice();
        }
        System.out.printf("   Total Ticket Expense for 4 Travellers: \u20B9%.2f\n", totalTickets);

        // 3. Test Trip & Itinerary
        LocalDate start = LocalDate.now().plusDays(10);
        LocalDate end = start.plusDays(4); // 5 days duration
        Trip trip = new Trip(1, "Golden Triangle Tour", start, end, 4);
        trip.addDestination(taj);
        trip.addDestination(testDest);

        Traveller t1 = new Traveller("Master Rohan", LocalDate.now().minusYears(6), "Male");
        t1.setTicketPrice(childTicket.calculatePrice());
        t1.setDiscountCategory(childTicket.getDiscountCategory());

        Traveller t2 = new Traveller("Ms. Ananya", LocalDate.now().minusYears(25), "Female");
        t2.setTicketPrice(womanTicket.calculatePrice());
        t2.setDiscountCategory(womanTicket.getDiscountCategory());

        trip.addTraveller(t1);
        trip.addTraveller(t2);

        // 4. Test Expense Breakdown & Auto Calculation
        Expense expense = new Expense(trip.getTripId(), 200.00, 8000.00, 4500.00, 3500.00);
        trip.setExpense(expense);

        System.out.println("\n[Test 3] Generated Itinerary Summary:\n");
        Itinerary itinerary = new Itinerary(trip);
        System.out.println(itinerary.generateSummaryText());

        System.out.println("[SUCCESS] Phase 2 models and OOP hierarchy verified without error!");
    }
}
