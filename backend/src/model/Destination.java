package model;

import java.time.LocalDate;

// Inheritance: Destination inherits from TravelItem
public class Destination extends TravelItem {
    private static final long serialVersionUID = 1L;

    private String location;
    private LocalDate arrivalDate;
    private LocalDate departureDate;
    private String notes;
    private int order;

    public Destination() {}

    public Destination(String id, String tripId, String name, String location, LocalDate arrivalDate, LocalDate departureDate, double estimatedCost, String notes, int order) {
        super(id, tripId, name, estimatedCost);
        this.location = location;
        this.arrivalDate = arrivalDate;
        this.departureDate = departureDate;
        this.notes = notes;
        this.order = order;
    }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getArrivalDate() { return arrivalDate; }
    public void setArrivalDate(LocalDate arrivalDate) { this.arrivalDate = arrivalDate; }

    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }

    // Polymorphism: Returns the estimated cost of lodging/stop forecast
    @Override
    public double getCost() {
        return getEstimatedCost();
    }

    @Override
    public String toString() {
        return "Destination{name='" + getName() + "', location='" + location + "', arrival=" + arrivalDate + ", order=" + order + "}";
    }
}
