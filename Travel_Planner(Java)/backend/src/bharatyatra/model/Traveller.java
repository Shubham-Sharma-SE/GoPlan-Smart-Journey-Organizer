package bharatyatra.model;

import java.time.LocalDate;
import java.time.Period;

/**
 * Model class representing an individual Traveller on a trip.
 * Stores personal details used for calculating age-based discounts.
 */
public class Traveller {
    private int travellerId;
    private int tripId;
    private String fullName;
    private LocalDate dob;
    private String gender;
    private double ticketPrice;
    private String discountCategory;

    // Default constructor
    public Traveller() {
    }

    // Constructor without ID (for trip creation)
    public Traveller(String fullName, LocalDate dob, String gender) {
        this.fullName = fullName;
        this.dob = dob;
        this.gender = gender;
        this.ticketPrice = 0.0;
        this.discountCategory = "Pending Calculation";
    }

    // Full constructor (for database retrieval)
    public Traveller(int travellerId, int tripId, String fullName, LocalDate dob, 
                     String gender, double ticketPrice, String discountCategory) {
        this.travellerId = travellerId;
        this.tripId = tripId;
        this.fullName = fullName;
        this.dob = dob;
        this.gender = gender;
        this.ticketPrice = ticketPrice;
        this.discountCategory = discountCategory;
    }

    /**
     * Calculates the exact age of the traveller as of the planned travel date.
     * 
     * @param travelDate The date of visit/travel.
     * @return Age in complete years.
     */
    public int getAgeOn(LocalDate travelDate) {
        if (dob == null || travelDate == null) {
            return 0;
        }
        return Period.between(dob, travelDate).getYears();
    }

    // Getters and Setters
    public int getTravellerId() {
        return travellerId;
    }

    public void setTravellerId(int travellerId) {
        this.travellerId = travellerId;
    }

    public int getTripId() {
        return tripId;
    }

    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public String getDiscountCategory() {
        return discountCategory;
    }

    public void setDiscountCategory(String discountCategory) {
        this.discountCategory = discountCategory;
    }

    @Override
    public String toString() {
        return fullName + " (" + gender + ", DOB: " + dob + ") - " 
                + discountCategory + " [\u20B9" + ticketPrice + "]";
    }
}
