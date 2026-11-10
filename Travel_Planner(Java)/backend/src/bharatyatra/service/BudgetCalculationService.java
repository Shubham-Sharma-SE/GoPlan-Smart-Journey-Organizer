package bharatyatra.service;

import bharatyatra.model.Expense;

import java.text.NumberFormat;
import java.util.Locale;

/**
 * Service class for calculating and formatting travel budgets.
 */
public class BudgetCalculationService {

    private final NumberFormat currencyFormatter;

    public BudgetCalculationService() {
        // Indian Rupee formatting
        currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
    }

    /**
     * Calculates total budget from individual cost items.
     */
    public double calculateTotalBudget(double ticketExp, double stayExp, double transportExp, double foodExp) {
        return Math.max(0, ticketExp) + Math.max(0, stayExp) + Math.max(0, transportExp) + Math.max(0, foodExp);
    }

    /**
     * Formats an amount into standard Indian currency representation.
     */
    public String formatCurrency(double amount) {
        return "\u20B9 " + String.format("%,.2f", Math.max(0, amount));
    }

    /**
     * Creates an Expense domain object with verified totals.
     */
    public Expense createExpense(int tripId, double ticketExp, double stayExp, double transportExp, double foodExp) {
        return new Expense(tripId, ticketExp, stayExp, transportExp, foodExp);
    }
}
