package bharatyatra.model;

/**
 * Model class representing the itemized expenses for a trip.
 * Automatically computes Total Budget = Ticket Expenses + Accommodation + Transportation + Food.
 */
public class Expense {
    private int expenseId;
    private int tripId;
    private double ticketExpense;
    private double accommodationExpense;
    private double transportExpense;
    private double foodExpense;
    private double totalExpense;

    // Default constructor
    public Expense() {
    }

    // Constructor with components
    public Expense(int tripId, double ticketExpense, double accommodationExpense, 
                   double transportExpense, double foodExpense) {
        this.tripId = tripId;
        this.ticketExpense = Math.max(0, ticketExpense);
        this.accommodationExpense = Math.max(0, accommodationExpense);
        this.transportExpense = Math.max(0, transportExpense);
        this.foodExpense = Math.max(0, foodExpense);
        this.totalExpense = calculateTotal();
    }

    // Full constructor (for database retrieval)
    public Expense(int expenseId, int tripId, double ticketExpense, double accommodationExpense, 
                   double transportExpense, double foodExpense, double totalExpense) {
        this.expenseId = expenseId;
        this.tripId = tripId;
        this.ticketExpense = ticketExpense;
        this.accommodationExpense = accommodationExpense;
        this.transportExpense = transportExpense;
        this.foodExpense = foodExpense;
        this.totalExpense = totalExpense;
    }

    /**
     * Recomputes the grand total expense from all breakdown items.
     * 
     * @return sum of tickets, accommodation, transport, and food expenses.
     */
    public double calculateTotal() {
        this.totalExpense = this.ticketExpense + this.accommodationExpense + this.transportExpense + this.foodExpense;
        return this.totalExpense;
    }

    // Getters and Setters with validation
    public int getExpenseId() {
        return expenseId;
    }

    public void setExpenseId(int expenseId) {
        this.expenseId = expenseId;
    }

    public int getTripId() {
        return tripId;
    }

    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public double getTicketExpense() {
        return ticketExpense;
    }

    public void setTicketExpense(double ticketExpense) {
        if (ticketExpense < 0) {
            throw new IllegalArgumentException("Ticket expense cannot be negative.");
        }
        this.ticketExpense = ticketExpense;
        calculateTotal();
    }

    public double getAccommodationExpense() {
        return accommodationExpense;
    }

    public void setAccommodationExpense(double accommodationExpense) {
        if (accommodationExpense < 0) {
            throw new IllegalArgumentException("Accommodation expense cannot be negative.");
        }
        this.accommodationExpense = accommodationExpense;
        calculateTotal();
    }

    public double getTransportExpense() {
        return transportExpense;
    }

    public void setTransportExpense(double transportExpense) {
        if (transportExpense < 0) {
            throw new IllegalArgumentException("Transport expense cannot be negative.");
        }
        this.transportExpense = transportExpense;
        calculateTotal();
    }

    public double getFoodExpense() {
        return foodExpense;
    }

    public void setFoodExpense(double foodExpense) {
        if (foodExpense < 0) {
            throw new IllegalArgumentException("Food expense cannot be negative.");
        }
        this.foodExpense = foodExpense;
        calculateTotal();
    }

    public double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(double totalExpense) {
        this.totalExpense = totalExpense;
    }

    @Override
    public String toString() {
        return "Expense [Tickets: \u20B9" + ticketExpense + ", Stay: \u20B9" + accommodationExpense 
                + ", Transport: \u20B9" + transportExpense + ", Food: \u20B9" + foodExpense 
                + " | Total: \u20B9" + totalExpense + "]";
    }
}
