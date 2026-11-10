package bharatyatra.model;

import java.util.List;

/**
 * Model class representing a complete Travel Itinerary.
 * Consolidates Trip details, Attractions, Travellers, and Expense breakdowns.
 */
public class Itinerary {
    private Trip trip;

    public Itinerary(Trip trip) {
        this.trip = trip;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    /**
     * Generates a well-formatted text summary of the travel itinerary.
     * Suitable for console preview, text area display, and project demonstrations.
     */
    public String generateSummaryText() {
        if (trip == null) {
            return "No trip details available.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("=========================================================\n");
        sb.append("         BHARAT YATRA - TRIP ITINERARY SUMMARY           \n");
        sb.append("=========================================================\n");
        sb.append("Trip Name:           ").append(trip.getTripName()).append("\n");
        sb.append("Travel Dates:        ").append(trip.getStartDate()).append(" to ").append(trip.getReturnDate())
          .append(" (").append(trip.getDurationInDays()).append(" days)\n");
        sb.append("Number of Travellers:").append(trip.getNumTravellers()).append("\n");
        sb.append("---------------------------------------------------------\n");
        sb.append("SELECTED TOURIST ATTRACTIONS:\n");

        List<Destination> dests = trip.getDestinations();
        if (dests.isEmpty()) {
            sb.append("  (No destinations selected)\n");
        } else {
            for (int i = 0; i < dests.size(); i++) {
                Destination d = dests.get(i);
                sb.append("  ").append(i + 1).append(". ").append(d.getDestinationName())
                  .append(" (").append(d.getCity()).append(", ").append(d.getState()).append(")")
                  .append(" - Base Ticket: \u20B9").append(d.getTicketPrice()).append("\n");
            }
        }

        sb.append("---------------------------------------------------------\n");
        sb.append("TRAVELLER BREAKDOWN:\n");
        List<Traveller> travellers = trip.getTravellers();
        if (travellers.isEmpty()) {
            sb.append("  (No traveller records added)\n");
        } else {
            for (int i = 0; i < travellers.size(); i++) {
                Traveller t = travellers.get(i);
                sb.append("  ").append(i + 1).append(". ").append(t.getFullName())
                  .append(" (").append(t.getGender()).append(", Age on trip: ")
                  .append(t.getAgeOn(trip.getStartDate())).append(" yrs) -> ")
                  .append(t.getDiscountCategory())
                  .append(" [\u20B9").append(t.getTicketPrice()).append("]\n");
            }
        }

        sb.append("---------------------------------------------------------\n");
        sb.append("ESTIMATED EXPENSE BREAKDOWN:\n");
        Expense exp = trip.getExpense();
        if (exp != null) {
            sb.append("  - Entry Tickets:      \u20B9").append(String.format("%.2f", exp.getTicketExpense())).append("\n");
            sb.append("  - Accommodation:      \u20B9").append(String.format("%.2f", exp.getAccommodationExpense())).append("\n");
            sb.append("  - Transportation:     \u20B9").append(String.format("%.2f", exp.getTransportExpense())).append("\n");
            sb.append("  - Food & Dining:      \u20B9").append(String.format("%.2f", exp.getFoodExpense())).append("\n");
            sb.append("  ---------------------------------------------------\n");
            sb.append("  TOTAL ESTIMATED BUDGET:\u20B9").append(String.format("%.2f", exp.getTotalExpense())).append("\n");
        } else {
            sb.append("  (Expenses not yet calculated)\n");
        }
        sb.append("=========================================================\n");

        return sb.toString();
    }

    @Override
    public String toString() {
        return generateSummaryText();
    }
}
