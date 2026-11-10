package bharatyatra.model;

/**
 * Concrete Ticket implementation for Female Travellers (Age 8 to 60).
 * Discount Rule: 50% discount on base ticket price.
 * Demonstrates Inheritance and Polymorphic Method Overriding.
 */
public class WomanTicket extends Ticket {

    public WomanTicket(Destination destination, String travellerName) {
        super(destination, travellerName);
    }

    public WomanTicket(double basePrice, String travellerName) {
        super(basePrice, travellerName);
    }

    @Override
    public double calculatePrice() {
        // 50% discount for female travellers
        return basePrice * 0.50;
    }

    @Override
    public String getDiscountCategory() {
        return "Woman (50% Off)";
    }
}
