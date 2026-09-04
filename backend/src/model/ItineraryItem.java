package model;

import java.time.LocalDate;

// Inheritance: ItineraryItem inherits from TravelItem
public class ItineraryItem extends TravelItem {
    private static final long serialVersionUID = 1L;

    private LocalDate date;
    private String time;
    private String description;
    private String location;

    public ItineraryItem() {}

    public ItineraryItem(String id, String tripId, LocalDate date, String time, String activity, String location, String description, double estimatedCost) {
        super(id, tripId, activity, estimatedCost);
        this.date = date;
        this.time = time;
        this.location = location;
        this.description = description;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    // Polymorphism: Returns the forecasted cost of this specific timeline activity
    @Override
    public double getCost() {
        return getEstimatedCost();
    }

    @Override
    public String toString() {
        return "ItineraryItem{time='" + time + "', activity='" + getName() + "', cost=" + getEstimatedCost() + "}";
    }
}
