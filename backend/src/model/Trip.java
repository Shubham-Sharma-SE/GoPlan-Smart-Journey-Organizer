package model;

import exception.InvalidTripDatesException;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Trip implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String startingLocation;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int travelers;
    private String travelMode;
    private double estimatedBudget;
    private String description;
    private String status; // upcoming, ongoing, completed
    private String userId;

    public Trip() {}

    public Trip(String id, String name, String startingLocation, String destination, LocalDate startDate, LocalDate endDate, int travelers, String travelMode, double estimatedBudget, String description, String userId) throws InvalidTripDatesException {
        this.id = id;
        this.name = name;
        this.startingLocation = startingLocation;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.travelers = travelers;
        this.travelMode = travelMode;
        this.estimatedBudget = estimatedBudget;
        this.description = description;
        this.userId = userId;
        
        // Encapsulation validation rule checking
        validateDates();
        determineStatus();
    }

    // Encapsulation validation rules
    public void validateDates() throws InvalidTripDatesException {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new InvalidTripDatesException("Trip End Date (" + endDate + ") cannot be before Start Date (" + startDate + ")");
        }
    }

    // Dynamics status calculation using Java 8 Date Time API
    public void determineStatus() {
        LocalDate today = LocalDate.now();
        if (startDate == null || endDate == null) {
            this.status = "upcoming";
            return;
        }

        if (today.isBefore(startDate)) {
            this.status = "upcoming";
        } else if (today.isAfter(endDate)) {
            this.status = "completed";
        } else {
            this.status = "ongoing";
        }
    }

    // Java Date/Time Temporal API usage for duration calculation
    public long getDurationInDays() {
        if (startDate == null || endDate == null) return 0;
        return ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStartingLocation() { return startingLocation; }
    public void setStartingLocation(String startingLocation) { this.startingLocation = startingLocation; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) throws InvalidTripDatesException { 
        this.startDate = startDate; 
        validateDates();
        determineStatus();
    }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) throws InvalidTripDatesException { 
        this.endDate = endDate; 
        validateDates();
        determineStatus();
    }

    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }

    public String getTravelMode() { return travelMode; }
    public void setTravelMode(String travelMode) { this.travelMode = travelMode; }

    public double getEstimatedBudget() { return estimatedBudget; }
    public void setEstimatedBudget(double estimatedBudget) { this.estimatedBudget = estimatedBudget; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    @Override
    public String toString() {
        return "Trip{id='" + id + "', name='" + name + "', destination='" + destination + "', duration=" + getDurationInDays() + " days, status='" + status + "'}";
    }
}
