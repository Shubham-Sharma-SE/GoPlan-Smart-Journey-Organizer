package bharatyatra.main;

import bharatyatra.model.*;
import bharatyatra.service.BudgetCalculationService;
import bharatyatra.service.TicketCalculationService;
import bharatyatra.util.PasswordUtil;
import bharatyatra.util.ValidationUtil;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Comprehensive Automated Verification Suite for Bharat Yatra.
 * Tests Models, OOP Concepts, Calculation Services, Validations, and Itinerary generation.
 */
public class AllPhasesTestSuite {

    private static int testsPassed = 0;
    private static int testsTotal = 0;

    public static void main(String[] args) {
        System.out.println("============================================================================");
        System.out.println("          BHARAT YATRA – FULL PROJECT INTEGRATION TEST SUITE                ");
        System.out.println("============================================================================");

        // Test 1: PasswordUtil SHA-256 Hashing
        testPasswordHashing();

        // Test 2: Input Validation Logic
        testValidations();

        // Test 3: Destination Model & Method Overloading
        testDestinationOverloading();

        // Test 4: Age-Based Polymorphic Ticket Discount Rules
        testTicketDiscounts();

        // Test 5: Single Discount Rule (Discounts do not combine)
        testSingleDiscountRule();

        // Test 6: Boundary Condition for Exactly 60-Year-Old
        testBoundaryAge60();

        // Test 7: Budget Calculation Logic
        testBudgetCalculation();

        // Test 8: Travel Date Validation Logic
        testTravelDatesValidation();

        // Test 9: Complete Itinerary Summary Generation
        testItineraryGeneration();

        System.out.println("\n============================================================================");
        System.out.println("TEST SUITE RESULTS: " + testsPassed + " / " + testsTotal + " TESTS PASSED!");
        System.out.println("============================================================================");
    }

    private static void assertTrue(String testName, boolean condition) {
        testsTotal++;
        if (condition) {
            testsPassed++;
            System.out.printf("  [PASS] %-60s\n", testName);
        } else {
            System.err.printf("  [FAIL] %-60s\n", testName);
        }
    }

    private static void testPasswordHashing() {
        System.out.println("\n--- 1. Testing Password Hashing & Encryption ---");
        String plain = "Admin@123";
        String hash = PasswordUtil.hashPassword(plain);
        assertTrue("SHA-256 generates 64-char hex string", hash != null && hash.length() == 64);
        assertTrue("Plain password correctly verifies against stored hash", PasswordUtil.checkPassword(plain, hash));
        assertTrue("Incorrect password is rejected", !PasswordUtil.checkPassword("WrongPass", hash));
    }

    private static void testValidations() {
        System.out.println("\n--- 2. Testing Input Form Validations ---");
        assertTrue("Valid email accepted", ValidationUtil.isValidEmail("rahul.sharma@example.com"));
        assertTrue("Invalid email without @ rejected", !ValidationUtil.isValidEmail("invalidemail.com"));
        assertTrue("Invalid email without domain rejected", !ValidationUtil.isValidEmail("user@.com"));
        assertTrue("10-digit Indian mobile accepted", ValidationUtil.isValidContactNumber("9876543210"));
        assertTrue("Short contact number rejected", !ValidationUtil.isValidContactNumber("12345"));
        assertTrue("Contact starting with invalid digit rejected", !ValidationUtil.isValidContactNumber("2345678901"));
    }

    private static void testDestinationOverloading() {
        System.out.println("\n--- 3. Testing Method Overloading in Destination ---");
        Destination dest = new Destination("Taj Mahal", "Uttar Pradesh", "Agra", "Historical Places", 
                "Iconic white marble monument", 50.00, "3-4 hours");

        assertTrue("Overloaded matches(keyword) on city 'Agra'", dest.matches("Agra"));
        assertTrue("Overloaded matches(keyword) on category 'Historical'", dest.matches("Historical"));
        assertTrue("Overloaded matches(state, category) with exact match", dest.matches("Uttar Pradesh", "Historical Places"));
        assertTrue("Overloaded matches(state, category) with 'All States'", dest.matches("All States", "Historical Places"));
        assertTrue("Overloaded matches(state, category) fails on wrong state", !dest.matches("Kerala", "Historical Places"));
    }

    private static void testTicketDiscounts() {
        System.out.println("\n--- 4. Testing Age-Based Ticket Discount Rules (Base Price \u20B9200) ---");
        TicketCalculationService service = new TicketCalculationService();
        Destination dest = new Destination("Test Monument", "Delhi", "Delhi", "Historical Places", "Desc", 200.0, "2 hrs");
        LocalDate visitDate = LocalDate.of(2026, 12, 1);

        // Child aged 6: Free entry (0.0)
        Ticket child = service.createTicket(dest, "Child", LocalDate.of(2020, 12, 1), "Male", visitDate);
        assertTrue("Child (<8) gets FREE entry (\u20B90)", child.calculatePrice() == 0.0);
        assertTrue("Child ticket is instance of ChildTicket", child instanceof ChildTicket);

        // Senior Citizen aged 65: 50% discount (100.0)
        Ticket senior = service.createTicket(dest, "Senior Man", LocalDate.of(1961, 12, 1), "Male", visitDate);
        assertTrue("Senior Citizen (>60) gets 50% off (\u20B9100)", senior.calculatePrice() == 100.0);
        assertTrue("Senior ticket is instance of SeniorCitizenTicket", senior instanceof SeniorCitizenTicket);

        // Woman aged 28: 50% discount (100.0)
        Ticket woman = service.createTicket(dest, "Woman", LocalDate.of(1998, 12, 1), "Female", visitDate);
        assertTrue("Woman (8-60) gets 50% off (\u20B9100)", woman.calculatePrice() == 100.0);
        assertTrue("Woman ticket is instance of WomanTicket", woman instanceof WomanTicket);

        // General male aged 30: Full price (200.0)
        Ticket general = service.createTicket(dest, "General Man", LocalDate.of(1996, 12, 1), "Male", visitDate);
        assertTrue("General visitor pays full price (\u20B9200)", general.calculatePrice() == 200.0);
        assertTrue("General ticket is instance of GeneralTicket", general instanceof GeneralTicket);
    }

    private static void testSingleDiscountRule() {
        System.out.println("\n--- 5. Testing Single Discount Enforcement (No Compounding) ---");
        TicketCalculationService service = new TicketCalculationService();
        Destination dest = new Destination("Test Place", "Goa", "Goa", "Beaches", "Desc", 200.0, "2 hrs");
        LocalDate visitDate = LocalDate.of(2026, 12, 1);

        // Female visitor aged 65: qualifies as both Senior and Woman, but discount must remain 50%, NOT 100%
        Ticket seniorWoman = service.createTicket(dest, "Senior Woman", LocalDate.of(1961, 12, 1), "Female", visitDate);
        assertTrue("Senior woman receives 50% off (\u20B9100), not compounded to 0", seniorWoman.calculatePrice() == 100.0);

        // Female child aged 5: Free entry (0.0) regardless of gender
        Ticket girlChild = service.createTicket(dest, "Girl Child", LocalDate.of(2021, 12, 1), "Female", visitDate);
        assertTrue("Girl child (<8) gets Free entry (\u20B90)", girlChild.calculatePrice() == 0.0);
    }

    private static void testBoundaryAge60() {
        System.out.println("\n--- 6. Testing Age Boundary Condition (Visitor Exactly 60 Years Old) ---");
        TicketCalculationService service = new TicketCalculationService();
        Destination dest = new Destination("Demo Spot", "Punjab", "Amritsar", "Religious Places", "Desc", 200.0, "2 hrs");
        LocalDate visitDate = LocalDate.of(2026, 12, 1);

        // Born 1966-12-01 -> Exactly 60 on 2026-12-01
        LocalDate dob60 = LocalDate.of(1966, 12, 1);

        // Male exactly 60: does NOT qualify for above-60 discount -> General Full Price
        Ticket male60 = service.createTicket(dest, "Male Exactly 60", dob60, "Male", visitDate);
        assertTrue("Male exactly 60 does NOT qualify for senior discount (pays full \u20B9200)", 
                male60.calculatePrice() == 200.0 && male60 instanceof GeneralTicket);

        // Female exactly 60: qualifies for Woman discount (50% off)
        Ticket female60 = service.createTicket(dest, "Female Exactly 60", dob60, "Female", visitDate);
        assertTrue("Female exactly 60 receives Woman discount (\u20B9100)", 
                female60.calculatePrice() == 100.0 && female60 instanceof WomanTicket);
    }

    private static void testBudgetCalculation() {
        System.out.println("\n--- 7. Testing Budget & Expense Auto-Calculation ---");
        BudgetCalculationService budgetService = new BudgetCalculationService();
        double tickets = 650.00;
        double stay = 12000.00;
        double transport = 6500.00;
        double food = 5000.00;

        double total = budgetService.calculateTotalBudget(tickets, stay, transport, food);
        double expected = 24150.00;
        assertTrue("Total Budget = Tickets + Stay + Transport + Food (\u20B924,150.00)", Math.abs(total - expected) < 0.001);

        Expense expense = budgetService.createExpense(1, tickets, stay, transport, food);
        assertTrue("Expense model recomputes matching total", Math.abs(expense.getTotalExpense() - expected) < 0.001);
    }

    private static void testTravelDatesValidation() {
        System.out.println("\n--- 8. Testing Travel Dates Validation ---");
        LocalDate today = LocalDate.now();
        LocalDate futureStart = today.plusDays(5);
        LocalDate futureEnd = today.plusDays(10);
        LocalDate pastDate = today.minusDays(2);

        assertTrue("Valid future dates (return >= start)", ValidationUtil.isValidTravelDates(futureStart, futureEnd));
        assertTrue("Same-day trip (return == start)", ValidationUtil.isValidTravelDates(futureStart, futureStart));
        assertTrue("Past start date rejected", !ValidationUtil.isValidTravelDates(pastDate, futureEnd));
        assertTrue("Return before start rejected", !ValidationUtil.isValidTravelDates(futureEnd, futureStart));
    }

    private static void testItineraryGeneration() {
        System.out.println("\n--- 9. Testing Complete Itinerary Generation ---");
        Trip trip = new Trip(1, "Rajasthan Desert Safari", LocalDate.now().plusDays(10), LocalDate.now().plusDays(15), 2);
        trip.addDestination(new Destination("Hawa Mahal", "Rajasthan", "Jaipur", "Historical Places", "Desc", 50.0, "2 hrs"));
        trip.addTraveller(new Traveller("Rohan", LocalDate.now().minusYears(20), "Male"));

        Expense exp = new Expense(1, 100.0, 7000.0, 4000.0, 3000.0);
        trip.setExpense(exp);

        Itinerary itinerary = new Itinerary(trip);
        String summary = itinerary.generateSummaryText();

        assertTrue("Itinerary summary contains Trip Name", summary.contains("Rajasthan Desert Safari"));
        assertTrue("Itinerary summary contains Hawa Mahal", summary.contains("Hawa Mahal"));
        assertTrue("Itinerary summary contains Total Estimated Budget", summary.contains("TOTAL ESTIMATED BUDGET"));
    }
}
