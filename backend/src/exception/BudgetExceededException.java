package exception;

// Custom exception representing a budget limit violation
public class BudgetExceededException extends Exception {
    private static final long serialVersionUID = 1L;

    public BudgetExceededException(String message) {
        super(message);
    }
}
