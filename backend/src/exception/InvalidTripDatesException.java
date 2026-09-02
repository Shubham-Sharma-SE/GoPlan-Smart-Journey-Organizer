package exception;

public class InvalidTripDatesException extends Exception {
    private static final long serialVersionUID = 1L;

    public InvalidTripDatesException(String message) {
        super(message);
    }
}
