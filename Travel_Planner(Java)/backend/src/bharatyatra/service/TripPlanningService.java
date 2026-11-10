package bharatyatra.service;

import bharatyatra.dao.TripDAO;
import bharatyatra.model.Destination;
import bharatyatra.model.Expense;
import bharatyatra.model.Traveller;
import bharatyatra.model.Trip;
import bharatyatra.util.ValidationUtil;

import java.time.LocalDate;
import java.util.List;

/**
 * Service orchestrating trip creation, itinerary generation, date validation, and persistence.
 */
public class TripPlanningService {

    private final TripDAO tripDAO = new TripDAO();
    private final TicketCalculationService ticketService = new TicketCalculationService();
    private final BudgetCalculationService budgetService = new BudgetCalculationService();

    /**
     * Validates and saves a complete trip with destinations, travellers, and expense breakdown.
     */
    public int planAndSaveTrip(int userId, String tripName, LocalDate startDate, LocalDate returnDate,
                               List<Destination> destinations, List<Traveller> travellers,
                               double accommodationExp, double transportExp, double foodExp) {

        // 1. Validate inputs
        if (tripName == null || tripName.trim().isEmpty()) {
            throw new IllegalArgumentException("Please provide a name for your trip (e.g. 'Rajasthan Heritage Tour').");
        }

        if (!ValidationUtil.isValidTravelDates(startDate, returnDate)) {
            throw new IllegalArgumentException("Invalid travel dates. Start date cannot be in the past, and return date cannot be before start date.");
        }

        if (destinations == null || destinations.isEmpty()) {
            throw new IllegalArgumentException("Please select at least one tourist destination to visit.");
        }

        if (travellers == null || travellers.isEmpty()) {
            throw new IllegalArgumentException("Please add at least one traveller.");
        }

        // 2. Compute individual traveller ticket prices and total ticket expense
        double totalTicketExpense = 0.0;
        for (Traveller traveller : travellers) {
            double travellerTicketSum = 0.0;
            String category = "General";
            for (Destination dest : destinations) {
                var ticket = ticketService.calculateSingleVisitorTicket(dest, traveller, startDate);
                travellerTicketSum += ticket.calculatePrice();
                category = ticket.getDiscountCategory();
            }
            traveller.setTicketPrice(travellerTicketSum);
            traveller.setDiscountCategory(category);
            totalTicketExpense += travellerTicketSum;
        }

        // 3. Compute total trip budget
        double totalBudget = budgetService.calculateTotalBudget(totalTicketExpense, accommodationExp, transportExp, foodExp);

        // 4. Build Trip entity
        Trip trip = new Trip(userId, tripName.trim(), startDate, returnDate, travellers.size());
        trip.setDestinations(destinations);
        trip.setTravellers(travellers);
        trip.setTotalBudget(totalBudget);

        // 5. Build Expense entity
        Expense expense = budgetService.createExpense(0, totalTicketExpense, accommodationExp, transportExp, foodExp);
        trip.setExpense(expense);

        // 6. Save via TripDAO
        return tripDAO.createTrip(trip);
    }

    public List<Trip> getUserTrips(int userId) {
        return tripDAO.getTripsByUserId(userId);
    }

    public Trip getTripDetails(int tripId) {
        return tripDAO.getTripById(tripId);
    }

    public boolean deleteTrip(int tripId) {
        return tripDAO.deleteTrip(tripId);
    }

    public boolean updateTripDates(int tripId, LocalDate startDate, LocalDate returnDate) {
        if (!ValidationUtil.isValidTravelDates(startDate, returnDate)) {
            throw new IllegalArgumentException("Invalid dates. Return date cannot be earlier than start date.");
        }
        return tripDAO.updateTripDates(tripId, startDate, returnDate);
    }
}
