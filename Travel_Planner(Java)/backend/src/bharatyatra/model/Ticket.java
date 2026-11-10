package bharatyatra.model;

/**
 * Abstract base class representing an Entry Ticket for an Indian Tourist Destination.
 * 
 * Demonstrates:
 * 1. Abstraction: Defines abstract methods calculatePrice() and getDiscountCategory().
 * 2. Inheritance: Subclasses extend this base class to represent specific discount categories.
 * 3. Polymorphism: Subclasses override calculatePrice() to implement category-specific discount rules.
 */
public abstract class Ticket {
    protected Destination destination;
    protected double basePrice;
    protected String travellerName;

    // Parameterized constructor
    public Ticket(Destination destination, String travellerName) {
        this.destination = destination;
        this.basePrice = (destination != null) ? destination.getTicketPrice() : 0.0;
        this.travellerName = travellerName;
    }

    public Ticket(double basePrice, String travellerName) {
        this.destination = null;
        this.basePrice = basePrice;
        this.travellerName = travellerName;
    }

    /**
     * Polymorphic method to calculate final ticket price after applying applicable discount.
     * Overridden by each specific ticket subclass.
     * 
     * @return final payable ticket amount in INR.
     */
    public abstract double calculatePrice();

    /**
     * Polymorphic method to return the descriptive discount category name.
     * 
     * @return discount category description.
     */
    public abstract String getDiscountCategory();

    // Concrete helper methods shared across all ticket types
    public double getBasePrice() {
        return basePrice;
    }

    public Destination getDestination() {
        return destination;
    }

    public String getTravellerName() {
        return travellerName;
    }

    public double getDiscountAmount() {
        return basePrice - calculatePrice();
    }

    @Override
    public String toString() {
        return getDiscountCategory() + " [Base: \u20B9" + basePrice 
                + ", Final: \u20B9" + calculatePrice() + "]";
    }
}
