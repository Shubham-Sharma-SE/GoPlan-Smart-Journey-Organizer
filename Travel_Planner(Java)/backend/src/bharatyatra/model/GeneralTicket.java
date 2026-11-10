package bharatyatra.model;

/**
 * Concrete Ticket implementation for General Category Travellers (e.g. Adult males aged 8 to 60).
 * Discount Rule: Full ticket price (No discount).
 * Demonstrates Inheritance and Polymorphic Method Overriding.
 */
public class GeneralTicket extends Ticket {

    public GeneralTicket(Destination destination, String travellerName) {
        super(destination, travellerName);
    }

    public GeneralTicket(double basePrice, String travellerName) {
        super(basePrice, travellerName);
    }

    @Override
    public double calculatePrice() {
        // Full ticket price
        return basePrice;
    }

    @Override
    public String getDiscountCategory() {
        return "General (Full Price)";
    }
}
