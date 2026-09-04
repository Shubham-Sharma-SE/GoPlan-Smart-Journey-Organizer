package model;

import java.time.LocalDate;

// Inheritance: Expense inherits from TravelItem
public class Expense extends TravelItem {
    private static final long serialVersionUID = 1L;

    private double amount; // Actual spent amount
    private String category; // transport, accommodation, food, etc.
    private LocalDate date;
    private String description;

    public Expense() {}

    public Expense(String id, String tripId, String title, double amount, String category, LocalDate date, String description) {
        // Calling super-constructor of TravelItem
        super(id, tripId, title, amount);
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.description = description;
    }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // Polymorphism: Overriding getCost() to return the actual amount spent
    @Override
    public double getCost() {
        return this.amount;
    }

    @Override
    public String toString() {
        return "Expense{id='" + getId() + "', title='" + getName() + "', amount=" + amount + ", category='" + category + "'}";
    }
}
