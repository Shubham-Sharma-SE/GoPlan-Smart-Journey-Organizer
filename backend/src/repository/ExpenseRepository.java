package repository;

import java.util.List;
import java.util.stream.Collectors;
import model.Expense;
import service.FileService;

// Repository Layer: Implements generic Repository interface for Expense entities
public class ExpenseRepository implements Repository<Expense> {
    private static final String FILE_PATH = "expenses.dat";

    @Override
    public void save(Expense expense) {
        List<Expense> expenses = findAll();
        int index = -1;
        for (int i = 0; i < expenses.size(); i++) {
            if (expenses.get(i).getId().equals(expense.getId())) {
                index = i;
                break;
            }
        }
        
        if (index != -1) {
            expenses.set(index, expense); // Update
        } else {
            expenses.add(expense); // Insert
        }
        FileService.saveToFile(FILE_PATH, expenses);
    }

    @Override
    public Expense findById(String id) {
        for (Expense e : findAll()) {
            if (e.getId().equals(id)) {
                return e;
            }
        }
        return null;
    }

    @Override
    public List<Expense> findAll() {
        return FileService.readFromFile(FILE_PATH);
    }

    @Override
    public void delete(String id) {
        List<Expense> expenses = findAll();
        expenses.removeIf(e -> e.getId().equals(id));
        FileService.saveToFile(FILE_PATH, expenses);
    }

    // Specific repository helper to find by trip
    public List<Expense> findByTripId(String tripId) {
        return findAll().stream()
                .filter(e -> e.getTripId().equals(tripId))
                .collect(Collectors.toList());
    }
}
