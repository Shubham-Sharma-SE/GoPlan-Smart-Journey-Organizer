package bharatyatra.service;

import bharatyatra.model.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

/**
 * Service class implementing the Age-Based Ticket Pricing & Discount Rules.
 * 
 * Configured Demonstration Rules:
 * 1. Children below 8 years: FREE Entry (ChildTicket)
 * 2. Visitors strictly above 60 years: 50% discount (SeniorCitizenTicket)
 * 3. Women (ages 8 to 60): 50% discount (WomanTicket)
 * 4. General visitors (men ages 8 to 60): Full price (GeneralTicket)
 * 
 * Guarantees:
 * - Age is calculated as of the planned visit date using Date of Birth.
 * - Single discount per visitor (discounts never compound).
 * - Exact age 60 does not qualify for senior citizen discount.
 */
public class TicketCalculationService {

    /**
     * Determines and creates the appropriate polymorphic Ticket instance.
     * 
     * @param destination The tourist attraction to visit
     * @param travellerName Name of traveller
     * @param dob Date of birth
     * @param gender "Male" / "Female" / "Other"
     * @param visitDate Planned travel start date
     * @return Concrete Ticket subclass instance
     */
    public Ticket createTicket(Destination destination, String travellerName, 
                               LocalDate dob, String gender, LocalDate visitDate) {
        double basePrice = (destination != null) ? destination.getTicketPrice() : 0.0;
        return createTicket(basePrice, travellerName, dob, gender, visitDate);
    }

    /**
     * Overloaded method for ticket creation from base price.
     */
    public Ticket createTicket(double basePrice, String travellerName, 
                               LocalDate dob, String gender, LocalDate visitDate) {
        if (visitDate == null) {
            visitDate = LocalDate.now();
        }

        int age = 30; // default adult
        if (dob != null) {
            age = Period.between(dob, visitDate).getYears();
        }

        boolean isFemale = (gender != null && (gender.equalsIgnoreCase("Female") || gender.equalsIgnoreCase("Woman")));

        // Rule 1: Children below 8 years receive free entry regardless of gender
        if (age < 8) {
            return new ChildTicket(basePrice, travellerName);
        }

        // Rule 2: Visitors strictly above 60 years receive 50% discount
        if (age > 60) {
            return new SeniorCitizenTicket(basePrice, travellerName);
        }

        // Rule 3: Women travellers receive 50% discount (ages 8 to 60)
        if (isFemale) {
            return new WomanTicket(basePrice, travellerName);
        }

        // Rule 4: Other visitors pay full ticket price
        return new GeneralTicket(basePrice, travellerName);
    }

    /**
     * Calculates the total ticket expense for all travellers across all selected destinations.
     */
    public double calculateTotalTicketCost(List<Destination> destinations, 
                                          List<Traveller> travellers, 
                                          LocalDate visitDate) {
        if (destinations == null || destinations.isEmpty() || travellers == null || travellers.isEmpty()) {
            return 0.0;
        }

        double total = 0.0;
        for (Destination dest : destinations) {
            for (Traveller traveller : travellers) {
                Ticket t = createTicket(dest, traveller.getFullName(), traveller.getDob(), 
                                        traveller.getGender(), visitDate);
                total += t.calculatePrice();
            }
        }
        return total;
    }

    /**
     * Calculates ticket price for an individual traveller visiting a single destination.
     */
    public Ticket calculateSingleVisitorTicket(Destination destination, Traveller traveller, LocalDate visitDate) {
        return createTicket(destination, traveller.getFullName(), traveller.getDob(), 
                            traveller.getGender(), visitDate);
    }
}
