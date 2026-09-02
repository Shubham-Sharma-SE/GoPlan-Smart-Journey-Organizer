package model;

import exception.BudgetExceededException;
import java.io.Serializable;

public class Budget implements Serializable {
    private static final long serialVersionUID = 1L;

    private String tripId;
    private double totalBudget;
    private double spent;

    public Budget() {}

    public Budget(String tripId, double totalBudget) {
        this.tripId = tripId;
        this.totalBudget = totalBudget;
        this.spent = 0.0;
    }

    public String getTripId() { return tripId; }
    public void setTripId(String tripId) { this.tripId = tripId; }

    public double getTotalBudget() { return totalBudget; }
    public void setTotalBudget(double totalBudget) { this.totalBudget = totalBudget; }

    public double getSpent() { return spent; }
    public void setSpent(double spent) { this.spent = spent; }

    public double getRemaining() {
        return totalBudget - spent;
    }

    public double getUsagePercentage() {
        if (totalBudget <= 0) return 0.0;
        return (spent / totalBudget) * 100.0;
    }

    // Exception handling trigger: checking if transaction exceeds total budget
    public void recordExpense(double amount) throws BudgetExceededException {
        if (amount < 0) {
            throw new IllegalArgumentException("Expense amount cannot be negative.");
        }
        
        this.spent += amount;
        if (this.spent > this.totalBudget) {
            throw new BudgetExceededException("Alert! Trip budget exceeded. Limit: " + totalBudget + ", Spent: " + spent);
        }
    }

    public String getAlertMessage() {
        double pct = getUsagePercentage();
        if (pct < 70) {
            return "✓ You are comfortably within your budget.";
        } else if (pct >= 70 && pct < 90) {
            return "⚠ You are approaching your budget limit.";
        } else if (pct >= 90 && pct <= 100) {
            return "⚠ You have almost reached your budget.";
        } else {
            return "🔴 Your trip budget has been exceeded.";
        }
    }

    @Override
    public String toString() {
        return "Budget{tripId='" + tripId + "', limit=" + totalBudget + ", spent=" + spent + ", usage=" + String.format("%.1f", getUsagePercentage()) + "%}";
    }
}
