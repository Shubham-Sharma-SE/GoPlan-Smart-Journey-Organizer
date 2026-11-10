package bharatyatra.model;

/**
 * Concrete Ticket implementation for Senior Citizens (Strictly Above 60 years of age).
 * Discount Rule: 50% discount on base ticket price.
 * Demonstrates Inheritance and Polymorphic Method Overriding.
 */
public class SeniorCitizenTicket extends Ticket {

    public SeniorCitizenTicket(Destination destination, String travellerName) {
        super(destination, travellerName);
    }

    public SeniorCitizenTicket(double basePrice, String travellerName) {
        super(basePrice, travellerName);
    }

    @Override
    public double calculatePrice() {
        // 50% discount for visitors strictly above 60 years
        return basePrice * 0.50;
    }

    @Override
    public String getDiscountCategory() {
        return "Senior Citizen (Above 60 - 50% Off)";
    }
}
