package bharatyatra.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Model class representing a User's Travel Plan/Trip.
 * Demonstrates Object Composition by containing Destinations, Travellers, and Expenses.
 */
public class Trip {
    private int tripId;
    private int userId;
    private String tripName;
    private LocalDate startDate;
    private LocalDate returnDate;
    private int numTravellers;
    private double totalBudget;
    private LocalDateTime createdAt;

    // Composition / Associations
    private List<Destination> destinations = new ArrayList<>();
    private List<Traveller> travellers = new ArrayList<>();
    private Expense expense;

    // Default constructor
    public Trip() {
    }

    // Constructor for creating a new trip
    public Trip(int userId, String tripName, LocalDate startDate, LocalDate returnDate, int numTravellers) {
        this.userId = userId;
        this.tripName = tripName;
        setDates(startDate, returnDate);
        this.numTravellers = Math.max(1, numTravellers);
        this.totalBudget = 0.0;
    }

    // Full constructor (for database retrieval)
    public Trip(int tripId, int userId, String tripName, LocalDate startDate, LocalDate returnDate, 
                int numTravellers, double totalBudget, LocalDateTime createdAt) {
        this.tripId = tripId;
        this.userId = userId;
        this.tripName = tripName;
        this.startDate = startDate;
        this.returnDate = returnDate;
        this.numTravellers = numTravellers;
        this.totalBudget = totalBudget;
        this.createdAt = createdAt;
    }

    /**
     * Validates and sets trip start and return dates.
     * Prevents return date from being earlier than start date.
     */
    public void setDates(LocalDate startDate, LocalDate returnDate) {
        if (startDate != null && returnDate != null && returnDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Return date cannot be earlier than start date.");
        }
        this.startDate = startDate;
        this.returnDate = returnDate;
    }

    /**
     * Calculates the duration of the trip in days.
     * 
     * @return number of days inclusive of start and end date.
     */
    public long getDurationInDays() {
        if (startDate == null || returnDate == null) {
            return 1;
        }
        return ChronoUnit.DAYS.between(startDate, returnDate) + 1;
    }

    // Management methods for associated collections
    public void addDestination(Destination destination) {
        if (destination != null && !destinations.contains(destination)) {
            destinations.add(destination);
        }
    }

    public void removeDestination(Destination destination) {
        destinations.remove(destination);
    }

    public void addTraveller(Traveller traveller) {
        if (traveller != null) {
            travellers.add(traveller);
            this.numTravellers = travellers.size();
        }
    }

    public void removeTraveller(Traveller traveller) {
        travellers.remove(traveller);
        this.numTravellers = travellers.size();
    }

    // Getters and Setters
    public int getTripId() {
        return tripId;
    }

    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getTripName() {
        return tripName;
    }

    public void setTripName(String tripName) {
        this.tripName = tripName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        if (returnDate != null && startDate != null && returnDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Return date cannot be earlier than start date.");
        }
        this.startDate = startDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        if (startDate != null && returnDate != null && returnDate.isBefore(startDate)) {
            throw new IllegalArgumentException("Return date cannot be earlier than start date.");
        }
        this.returnDate = returnDate;
    }

    public int getNumTravellers() {
        return numTravellers;
    }

    public void setNumTravellers(int numTravellers) {
        this.numTravellers = Math.max(1, numTravellers);
    }

    public double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Destination> getDestinations() {
        return destinations;
    }

    public void setDestinations(List<Destination> destinations) {
        this.destinations = (destinations != null) ? destinations : new ArrayList<Destination>();
    }

    public List<Traveller> getTravellers() {
        return travellers;
    }

    public void setTravellers(List<Traveller> travellers) {
        this.travellers = (travellers != null) ? travellers : new ArrayList<Traveller>();
        if (!this.travellers.isEmpty()) {
            this.numTravellers = this.travellers.size();
        }
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
        if (expense != null) {
            this.totalBudget = expense.getTotalExpense();
        }
    }

    @Override
    public String toString() {
        return tripName + " (" + startDate + " to " + returnDate + ") - Budget: \u20B9" + totalBudget;
    }
}
