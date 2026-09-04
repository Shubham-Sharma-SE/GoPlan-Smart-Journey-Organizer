package service;

import exception.BudgetExceededException;
import java.util.List;
import model.Budget;
import model.Expense;
import model.Trip;
import repository.ExpenseRepository;
import repository.TripRepository;

public class ExpenseService {
    private ExpenseRepository expenseRepository;
    private TripRepository tripRepository;

    public ExpenseService() {
        this.expenseRepository = new ExpenseRepository();
        this.tripRepository = new TripRepository();
    }

    // Records an expense and verifies if it exceeds the Trip's estimated budget limit
    public void recordExpense(Expense expense) throws BudgetExceededException {
        // 1. Tally existing expenses for this trip
        List<Expense> tripExpenses = expenseRepository.findByTripId(expense.getTripId());
        double existingTotal = 0.0;
        for (Expense e : tripExpenses) {
            existingTotal += e.getAmount();
        }

        // 2. Fetch the Trip's budget limit
        Trip trip = tripRepository.findById(expense.getTripId());
        double budgetLimit = 0.0;
        if (trip != null) {
            budgetLimit = trip.getEstimatedBudget();
        }

        // 3. Create a Budget model to run calculations and check limits
        Budget budget = new Budget(expense.getTripId(), budgetLimit);
        budget.setSpent(existingTotal);
        
        // This will throw BudgetExceededException if exceeded
        budget.recordExpense(expense.getAmount());

        // 4. Save if check passes
        expenseRepository.save(expense);
    }

    public List<Expense> getExpensesByTripId(String tripId) {
        return expenseRepository.findByTripId(tripId);
    }

    public void deleteExpense(String id) {
        expenseRepository.delete(id);
    }
}
