package model;

import java.io.Serializable;

// Abstraction: Abstract base class representing generic travel components
public abstract class TravelItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String tripId;
    private String name;
    private double estimatedCost;

    public TravelItem() {}

    public TravelItem(String id, String tripId, String name, double estimatedCost) {
        this.id = id;
        this.tripId = tripId;
        this.name = name;
        this.estimatedCost = estimatedCost;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(double estimatedCost) { this.estimatedCost = estimatedCost; }

    // Abstraction & Polymorphism: Abstract method to get actual cost calculated differently by sub-types
    public abstract double getCost();
}
