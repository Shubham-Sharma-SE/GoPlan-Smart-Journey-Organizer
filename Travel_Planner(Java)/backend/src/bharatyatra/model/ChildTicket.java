package bharatyatra.model;

/**
 * Concrete Ticket implementation for Children under 8 years of age.
 * Discount Rule: FREE Entry (100% discount regardless of gender).
 * Demonstrates Inheritance and Polymorphic Method Overriding.
 */
public class ChildTicket extends Ticket {

    public ChildTicket(Destination destination, String travellerName) {
        super(destination, travellerName);
    }

    public ChildTicket(double basePrice, String travellerName) {
        super(basePrice, travellerName);
    }

    @Override
    public double calculatePrice() {
        // Free entry for children below 8 years
        return 0.0;
    }

    @Override
    public String getDiscountCategory() {
        return "Child (Under 8 - Free Entry)";
    }
}
