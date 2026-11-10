package bharatyatra.model;

import java.time.LocalDateTime;

/**
 * Model class representing an Indian Tourist Destination.
 * Demonstrates Encapsulation and Method Overloading.
 */
public class Destination {
    private int destinationId;
    private String destinationName;
    private String state;
    private String city;
    private String category;
    private String description;
    private double ticketPrice;
    private String visitingDuration;
    private LocalDateTime createdAt;

    // Default constructor
    public Destination() {
    }

    // Overloaded Constructor 1: Basic details without ID
    public Destination(String destinationName, String state, String city, String category, 
                       String description, double ticketPrice, String visitingDuration) {
        this.destinationName = destinationName;
        this.state = state;
        this.city = city;
        this.category = category;
        this.description = description;
        this.ticketPrice = ticketPrice;
        this.visitingDuration = visitingDuration;
    }

    // Overloaded Constructor 2: Full constructor with ID and timestamp
    public Destination(int destinationId, String destinationName, String state, String city, 
                       String category, String description, double ticketPrice, 
                       String visitingDuration, LocalDateTime createdAt) {
        this.destinationId = destinationId;
        this.destinationName = destinationName;
        this.state = state;
        this.city = city;
        this.category = category;
        this.description = description;
        this.ticketPrice = ticketPrice;
        this.visitingDuration = visitingDuration;
        this.createdAt = createdAt;
    }

    // Method Overloading Example 1: Match by a single search keyword
    public boolean matches(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return true;
        }
        String lowerKeyword = keyword.toLowerCase().trim();
        return (destinationName != null && destinationName.toLowerCase().contains(lowerKeyword))
            || (state != null && state.toLowerCase().contains(lowerKeyword))
            || (city != null && city.toLowerCase().contains(lowerKeyword))
            || (category != null && category.toLowerCase().contains(lowerKeyword));
    }

    // Method Overloading Example 2: Match by specific state and category filters
    public boolean matches(String filterState, String filterCategory) {
        boolean stateMatch = (filterState == null || filterState.equalsIgnoreCase("All States") 
                || (state != null && state.equalsIgnoreCase(filterState.trim())));
        boolean categoryMatch = (filterCategory == null || filterCategory.equalsIgnoreCase("All Categories") 
                || (category != null && category.equalsIgnoreCase(filterCategory.trim())));
        return stateMatch && categoryMatch;
    }

    // Getters and Setters
    public int getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(int destinationId) {
        this.destinationId = destinationId;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(double ticketPrice) {
        if (ticketPrice < 0) {
            throw new IllegalArgumentException("Ticket price cannot be negative.");
        }
        this.ticketPrice = ticketPrice;
    }

    public String getVisitingDuration() {
        return visitingDuration;
    }

    public void setVisitingDuration(String visitingDuration) {
        this.visitingDuration = visitingDuration;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return destinationName + " (" + city + ", " + state + ") - \u20B9" + ticketPrice;
    }
}
